from datetime import datetime
from itertools import islice, batched
from typing import BinaryIO
import pymupdf
from pymupdf import Document, Page
from collections import namedtuple
from dataclasses import dataclass
from sqlalchemy.ext.asyncio import async_sessionmaker


@dataclass
class Block:
    x1: int
    x2: int
    y1: int
    y2: int
    text: list[str]
    num1: int
    num2: int


class PersonRequirements:
    name: str
    after: int | None
    before: int | None


class SportEvent:
    id: int
    name: str
    people: list[PersonRequirements]
    text: str


class IntervalEvent:
    start_date: datetime
    end_date: datetime


class EventMap:
    country: str
    region: str
    city: str


@dataclass
class Row:
    sport_event: SportEvent
    interval: IntervalEvent
    map: EventMap
    count_people: int
    sport: str
    category: str


class ParserPDF:

    def __init__(self, file: BinaryIO, maker: async_sessionmaker):
        self.maker = maker
        self.file = file
        self._current_sport = None
        self._current_stuff = None
        self.items_on_update = None
        self._key_words_for_choice_sport = [
            'Основной состав',
            "Молодежный (резервный) состав",
        ]

    async def __call__(self, *args, **kwargs):

        pdf = pymupdf.open(self.file)
        self._start_parse_pdf(pdf[1])

        for page in pdf[1:-1]:
            pass

        self._end_parse_pdf(pdf[-1])

    def _maybe_sport_block(self, block: Block):
        pass

    def _start_parse_pdf(self, page: Page):
        # в начале документа иду до основного состава и беру спорт
        pass

    def _end_parse_pdf(self, page: Page):
        pass

    def _while_dont_meet_sport(self, page: Page):

        # id и кубок россии, дата, город и округ, количество человек
        # и после количества человек может быть спорт или состав
        gen = (self._parse_raw_data(data) for data in page.get_text('blocks'))
        row = self._parse_row(page, gen)
        # self._current_sport = block.text

    def _handle_default_row(self, blocks: tuple[Block]):
        pass

    def _handle_name_sport_row(self, blocks: tuple[Block]):
        pass

    def _handle_category_sport_row(self, blocks: tuple[Block]):
        pass

    def _parse_row(self, page: Page, generator) -> Row:
        current_sport = None
        current_category = None
        for blocks in batched(generator, 2):
            if len(blocks[0]) == 1:
                # если категория первая в списке
                if blocks[0].text[0] in self._key_words_for_choice_sport:
                    current_stuff = blocks[0].text[0]
                    id_name_sex = blocks[1]
                # если название состава первая в списке и второе соответственно категория
                elif blocks[1].text[0] in self._key_words_for_choice_sport:
                    current_sport = blocks[0].text[0]
                    current_stuff = blocks[1].text[0]

    def _parse_raw_data(self, data: tuple) -> Block:
        block = Block(*data)
        block.text: str  # type: ignore
        block.text = (block.text.rstrip('\n')).split('\n')
        return block
