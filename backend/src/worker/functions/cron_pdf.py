import asyncio
import os
from uuid import uuid4

import aiofiles
import aiohttp
from bs4 import BeautifulSoup
import json
import datetime
from logging import getLogger
import aiohttp
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from ..parser_pdf.parser import ParserPDF
from ..utils import update_db

logger = getLogger(__name__)


async def cron_update_calendar_table(ctx):
    logger.info('start fetching pdf')
    file_name = await fetch_pdf(ctx)
    logger.info('fetched pdf_file')
    maker = ctx['async_session_maker']
    maker: async_sessionmaker
    parser = ParserPDF()
    try:
        rows = parser.grap_rows(file_name)
        logger.info('fetched rows %d', len(rows))
        await update_db(maker, rows)
    finally:
        os.remove(file_name)


async def _fetch_pdf(ctx, url_to_pdf: str):
    async with aiohttp.ClientSession() as session:
        async with session.get(url_to_pdf, ssl=False) as response:
            file_name = str(uuid4())
            async with aiofiles.open(file_name, 'wb') as f:
                while data := await response.content.read(1024 * 1024):
                    await f.write(data)

    return file_name


async def fetch_pdf(ctx):
    url = 'https://www.minsport.gov.ru/activity/government-regulation/edinyj-kalendarnyj-plan/'
    async with aiohttp.ClientSession() as session:
        async with session.get(url, ssl=False) as response:
            if response.status == 200:
                page_content = await response.text()

                soup = BeautifulSoup(page_content, 'html.parser')

                scripts = soup.find_all('script')

                for script in scripts:
                    if script.string:
                        try:
                            json_data = json.loads(script.string.strip())

                            if 'props' in json_data:
                                data = json_data['props']['pageProps']

                                sections = data.get('sections', [])

                                current_year = str(datetime.datetime.now().year)

                                for section in sections:
                                    section_title = section.get('title', '').strip()

                                    if "II часть ЕКП" in section_title:
                                        documents = section.get('documents', [])
                                        for document in documents:
                                            doc_title = document.get('attributes', {}).get('title', '')

                                            if current_year in doc_title:
                                                pdf_url = document['attributes']['file']['data']['attributes']['url']
                                                logger.info(pdf_url)
                                                return await _fetch_pdf(ctx, pdf_url)

                        except json.JSONDecodeError as e:
                            logger.exception(f"Ошибка при обработке JSON данных:", exc_info=e)
            else:
                logger.info(f"Ошибка: %s", response.status)
