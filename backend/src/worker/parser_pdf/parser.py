from datetime import datetime, date
from itertools import islice, batched
from typing import BinaryIO, Generator, Any, List
import pymupdf
from pymupdf import Document, Page
from dataclasses import dataclass
from pydantic import BaseModel, validator, field_validator, Field
from logging import getLogger

from worker.parser_pdf.exception import ParseRowException

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


class AgeGroupSchema(BaseModel):
    name: str
    start: int | None = Field(default=None, serialization_alias='age_from')
    end: int | None = Field(default=None, serialization_alias='age_to')


class EventTypeSchema(BaseModel):
    sport: str


class LocationSchema(BaseModel):
    country: str
    region: str | None
    city: str


class CompetitionSchema(BaseModel):
    name: str
    type: str


class EventSchema(BaseModel):
    id: int
    name: str
    start_date: date
    end_date: date
    category: str
    count_people: int = Field(serialization_alias='participants_count', le=90000)

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


class Row(BaseModel):
    event_type: EventTypeSchema
    event: EventSchema
    location: LocationSchema
    sexes: list[AgeGroupSchema]
    competitions: list[CompetitionSchema]


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
        result = []
        for row in self._start_parse_pdf(gen):
            result.append(row)

        for page in pdf[1:]:
            page: Page
            gen = self._create_generator_for_page(page)
            for row in self._parse_rows(gen):
                result.append(row)

        logger.info(f'end parcing')
        return result

    def _start_parse_pdf(self, gen: Generator):
        # в начале документа иду до основного состава и беру спорт
        for block in gen:
            if len(block.text) == 1 and block.text[0] in self._key_words_for_choice_sport:
                self._current_category = block.text[0]
                self._current_sport = self._current_sport[0]
                return self._parse_rows(gen)
            else:
                self._current_sport = block.text

    def _create_generator_for_page(self, page: Page):
        return (self._parse_raw_data(data) for data in page.get_text('blocks'))

    def _handle_default_row(self, gen: Generator, blocks: tuple[Block, Block]) -> Row:
        return self._handle_after_date_block(gen, *blocks)

    def _convert_to_programs_and_disciplines(self, text: str) -> list[CompetitionSchema]:
        items = []

        for block in text.split(','):
            block = block.strip()
            index = block.find(' ')
            name = block[:index]
            competition = block[index + 1:]
            if competition.startswith('- '):
                competition = competition[2:]

            competition = competition.strip()

            if name == 'КЛАСС':
                items.append(CompetitionSchema(name=competition, type='program'))
            elif name.lower().startswith('дисциплин'):
                items.append(CompetitionSchema(name=competition, type='discipline'))
            elif name == competition and name != '':
                items.append(CompetitionSchema(name=competition, type='discipline'))

        return items

    def _convert_to_person_requirements(self, text: str):
        words = text.split(' ')
        people: list[AgeGroupSchema] = []
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
                if word[0].isupper() or not word.isalpha() or word.istitle():
                    continue
                people.append(AgeGroupSchema(name=word))

        for person in people:
            person.start = start
            person.end = end
            yield person

    def _create_location(self, gen):
        city_block = next(gen)
        split = city_block.text[1].split(',')
        if len(split) == 2:
            city = self._parse_city(split[1])
            event_map = LocationSchema(country=city_block.text[0], region=split[0], city=city)
        else:
            split[0]: str
            city = self._parse_city(split[0])
            event_map = LocationSchema(country=city_block.text[0], region=None, city=city)
        return event_map

    def _handle_name_sport_row(self, gen: Generator, sport_block: Block) -> Row:
        date_block = next(gen)
        return self._handle_after_date_block(gen, sport_block, date_block)

    def _parse_city(self, city: str):
        return city.strip(' ').removeprefix('Город').removeprefix('г.').removeprefix('Г.').removeprefix('г').strip(' ')

    def _handle_after_date_block(self, gen: Generator,
                                 sport_block: Block,
                                 date_block: Block):
        event_id = sport_block.text[0]
        event_name = sport_block.text[1]
        if len(sport_block.text) < 3:
            # logger.warning('sport block with text less then 3! %s', sport_block)
            reqs = []

        else:
            reqs = list(self._convert_to_person_requirements(sport_block.text[2]))

        if len(sport_block.text) > 5:
            competitions = self._convert_to_programs_and_disciplines(" ".join(sport_block.text[2:]))
        elif len(sport_block.text) < 3:
            competitions = self._convert_to_programs_and_disciplines(sport_block.text[2])
        else:
            competitions = []

        location = self._create_location(gen)

        count_block = next(gen)
        event = EventSchema(
            category=self._current_category,
            id=event_id, name=event_name, start_date=date_block.text[0], end_date=date_block.text[1],
            count_people=count_block.text[0]
        )
        event_type = EventTypeSchema(sport=self._current_sport)

        row = Row(
            event_type=event_type,
            location=location,
            sexes=reqs,
            event=event,
            competitions=competitions,
        )
        return row

    def _parse_blocks(self, blocks: list[str]):
        first = blocks[0].strip(',. ')
        start = None
        end = None
        if len(first) == 1:
            people = []
        else:
            people = [first]

        age = blocks[-1]
        for block in blocks[1:-1]:
            block = block.strip('., ')
            if block == 'от':
                return [AgeGroupSchema(name=person, start=age) for person in people]
            elif block == 'до':
                return [AgeGroupSchema(name=person, end=age) for person in people]
            elif len(block) == 1 or block == 'старше':
                continue
            else:
                people.append(block)

        split = age.split('-')
        if len(split) == 2:
            start = int(split[0])
            end = int(split[1])
        return [AgeGroupSchema(name=person, start=start, end=end) for person in people]

    def _wrapped_parse(self, text: str):
        if text == '':
            return
        index = text.find('лет')
        if index == -1:
            for name in text.split(','):
                if name != '':
                    yield AgeGroupSchema(name=name.strip('., '))

        blocks = text[:index].strip(',. ').split(' ')
        sexes = self._parse_blocks(blocks)
        for sex in sexes:
            yield sex

        return self._wrapped_parse(text[index + 3:])

    def _parse_rows(self, gen: Generator) -> Row:
        while True:
            try:
                res = self._parse_row(gen)
            except ParseRowException as e:
                pass
                # raise e


            else:
                if res is None:
                    break
                yield res

    def _parse_row(self, gen: Generator) -> Row | None:
        for blocks in batched(gen, 2):
            try:
                if len(blocks[0].text) == 1 and len(blocks) == 2:
                    # если категория первая в списке, а второе как обычное поле
                    if blocks[0].text[0] in self._key_words_for_choice_sport:
                        self._current_category = blocks[0].text[0]
                        return self._handle_name_sport_row(gen, blocks[1])
                    # если название состава первая в списке и второе соответственно категория
                    elif blocks[1].text[0] in self._key_words_for_choice_sport:
                        self._current_sport = blocks[0].text[0]
                        self._current_category = blocks[1].text[0]

                elif len(blocks) == 1 and blocks[0].text[0].startswith('Стр'):
                    return None

                elif len(blocks) == 2:
                    return self._handle_default_row(gen, blocks)
            except Exception as e:
                raise ParseRowException(blocks) from e

    def _parse_raw_data(self, data: tuple) -> Block:
        block = Block(*data)
        block.text = (block.text.rstrip('\n')).split('\n')
        return block
