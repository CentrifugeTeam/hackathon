from datetime import datetime, date
from itertools import islice, batched
from typing import BinaryIO, Generator, Any
import pymupdf
from pymupdf import Document, Page
from dataclasses import dataclass
from pydantic import BaseModel, validator, field_validator
from logging import getLogger

logger = getLogger(__name__)


@dataclass
class Block:
    x1: int
    x2: int
    y1: int
    y2: int
    text: list[str]
    num1: int
    num2: int


class PersonRequirements(BaseModel):
    name: str
    start: int | None = None
    end: int | None = None


class SportEvent(BaseModel):
    id: int
    name: str


class IntervalEvent(BaseModel):
    start_date: date
    end_date: date

    @field_validator('start_date', 'end_date', mode='before')
    @classmethod
    def timestamp_to_date(cls, v: Any) -> Any:
        """
        Extract the date from a string like '2004-01-01T00:00:00Z'.
        """
        if not v:
            return None
        if not isinstance(v, str):
            raise TypeError(
                f"timestamp_to_date expected a string value, received {v!r}"
            )

        return datetime.strptime(v, '%d.%m.%Y').date()


class EventMap(BaseModel):
    country: str
    region: str | None
    city: str


class Competition(BaseModel):
    name: str


class Competitions(BaseModel):
    disciplines: list[Competition]
    programs: list[Competition]


class Row(BaseModel):
    sport_event: SportEvent
    interval: IntervalEvent
    map: EventMap
    count_people: int
    sport: str
    category: str
    reqs: list[PersonRequirements]
    competitions: Competitions


class ParserPDF:

    def __init__(self):
        self._current_sport: str | None = None
        self._current_category: str | None = None
        self.items_on_update = None
        self._key_words_for_choice_sport = [
            'Основной состав',
            "Молодежный (резервный) состав",
        ]

    def grap_rows(self, file: BinaryIO):
        logger.info('start parcing')
        pdf = pymupdf.open(file)
        gen = self._create_generator_for_page(pdf[0])
        logger.info('start proccessing page 1')
        result = []
        for row in self._start_parse_pdf(gen):
            result.append(row)
        logger.info('finished proccessing page 1')

        for page in pdf[1:]:
            page: Page
            # logger.info('start proccessing page %d', page.number)
            gen = self._create_generator_for_page(page)
            for row in self._parse_rows(gen):
                result.append(row)
            # logger.info('finished proccessing page %d', page.number)

        logger.info('end parcing')
        return result

    def _start_parse_pdf(self, gen: Generator):
        # в начале документа иду до основного состава и беру спорт
        for block in gen:
            if len(block.text) == 1 and block.text[0] in self._key_words_for_choice_sport:
                self._current_category = block.text[0]
                self._current_sport = self._current_sport[0]
                # logger.info('found first categories %s and sports %s', self._current_category, self._current_sport)
                return self._parse_rows(gen)
            else:
                self._current_sport = block.text

    def _create_generator_for_page(self, page: Page):
        return (self._parse_raw_data(data) for data in page.get_text('blocks'))

    def _handle_default_row(self, gen: Generator, blocks: tuple[Block, Block]) -> Row:
        # logger.info('blocks %s', blocks)
        sport_block, date_block = blocks
        if len(sport_block.text) != 2:
            logger.warning('sport block with text less then 2! %s', sport_block)
            reqs = []
        else:
            reqs = list(self._convert_to_person_requirements(sport_block.text[2]))

        sport_event = SportEvent(id=sport_block.text[0], name=sport_block.text[1])
        interval_event = IntervalEvent(start_date=date_block.text[0], end_date=date_block.text[1])
        competitions = self._convert_to_programs_and_disciplines(sport_block.text[3])
        event_map = self._create_event_map(gen)
        # logger.info('event_map %s, interval_event %s , sport_event %s', event_map, interval_event, sport_event)

        count_block = next(gen)
        row = Row(sport_event=sport_event, interval=interval_event, map=event_map,
                  count_people=count_block.text[0],
                  sport=self._current_sport,
                  category=self._current_category,
                  reqs=reqs,
                  competitions=competitions
                  )
        # logger.info('row %s', row)
        return row

    def _convert_to_disciplines(self, text: str):
        res = []
        for name in text.split(','):
            name = name.strip()
            res.append(Competition(name=name))
        return res

    def _convert_to_programs_and_disciplines(self, text: str):
        programs = []
        disciplines = []

        for block in text.split(','):
            block = block.strip()
            index = block.find(' ')
            name = block[:index]
            competition = block[index + 1:]
            if competition.startswith('- '):
                competition = competition[2:]

            competition = competition.strip()
            if name == 'КЛАСС':
                programs.append(Competition(name=competition))
            elif name.lower().startswith('дисциплин'):
                disciplines.append(Competition(name=competition))
            elif name == competition:
                disciplines.append(Competition(name=competition))

        return Competitions(programs=programs, disciplines=disciplines)

    def _convert_to_person_requirements(self, text: str):
        words = text.split(' ')
        people: list[PersonRequirements] = []
        start = None
        end = None
        for i, word in enumerate(words):
            word = word.strip(',. ')
            if word[0].isdigit():
                split = word.split('-')
                if len(split) == 2:
                    start = int(split[0])
                    end = int(split[1])
            elif word in ['и', "старше", "младше"]:
                continue
            elif word == 'лет':
                for person in people:
                    person.start = start
                    person.end = end
                    yield person

                people = []
                start = None
                end = None
            elif word == 'от':
                start = int(words[i + 1])
            elif word == 'до':
                end = int(words[i + 1])
            else:
                people.append(PersonRequirements(name=word))

        for person in people:
            person.start = start
            person.end = end
            yield person

    def _create_event_map(self, gen):
        city_block = next(gen)
        split = city_block.text[1].split(',')
        if len(split) == 2:
            event_map = EventMap(country=city_block.text[0], region=split[0], city=split[1].strip(' '))
        else:
            event_map = EventMap(country=city_block.text[0], region=None, city=split[0].strip(' '))
        return event_map

    def _handle_name_sport_row(self, gen: Generator, sport_block: Block) -> Row:
        # logger.info('sport_block %s', sport_block)
        sport_event = SportEvent(id=sport_block.text[0], name=sport_block.text[1])
        if len(sport_block.text) < 2:
            logger.warning('sport block with text less then 2! %s', sport_block)
            reqs = []
        else:
            reqs = list(self._convert_to_person_requirements(sport_block.text[2]))
        date_block = next(gen)
        interval_event = IntervalEvent(start_date=date_block.text[0], end_date=date_block.text[1])
        competitions = self._convert_to_programs_and_disciplines(sport_block.text[3])
        event_map = self._create_event_map(gen)
        # logger.info('event_map %s, interval_event %s , sport_event %s', event_map, interval_event, sport_event)

        name_city: str
        count_block = next(gen)
        row = Row(sport_event=sport_event, interval=interval_event, map=event_map,
                  count_people=count_block.text[0],
                  sport=self._current_sport,
                  category=self._current_category,
                  reqs=reqs,
                  competitions=competitions
                  )
        # logger.info('row %s', row)
        return row

    def _handle_category_sport_row(self, gen: Generator) -> Row:
        # logger.info('row %s', row)
        pass

    def _parse_rows(self, gen: Generator) -> Row:
        while True:
            try:
                res = self._parse_row(gen)
            except Exception as e:
                logger.exception('Exception in parsing rows', exc_info=e)
            else:
                if res is None:
                    break
                yield res

    def _parse_row(self, gen: Generator) -> Row | None:
        for blocks in batched(gen, 2):
            if len(blocks[0].text) == 1 and len(blocks) == 2:
                # если категория первая в списке, а второе как обычное поле
                if blocks[0].text[0] in self._key_words_for_choice_sport:
                    self._current_category = blocks[0].text[0]
                    return self._handle_name_sport_row(gen, blocks[1])
                # если название состава первая в списке и второе соответственно категория
                elif blocks[1].text[0] in self._key_words_for_choice_sport:
                    self._current_sport = blocks[0].text[0]
                    self._current_category = blocks[1].text[0]
                    # return self._handle_category_sport_row(gen)
            elif len(blocks) == 1 and blocks[0].text[0].startswith('Стр'):
                return None

            elif len(blocks) == 2:
                return self._handle_default_row(gen, blocks)

    def _parse_raw_data(self, data: tuple) -> Block:
        block = Block(*data)
        block.text: str  # type: ignore
        block.text = (block.text.rstrip('\n')).split('\n')
        return block
