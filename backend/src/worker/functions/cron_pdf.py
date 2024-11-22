import asyncio
import os
from uuid import uuid4

import aiofiles
import aiohttp
from bs4 import BeautifulSoup
import json
import datetime
from logging import getLogger
from concurrent.futures import ProcessPoolExecutor
import aiohttp
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..parser_pdf.parser import ParserPDF
from storage.db.models import FilePDF, File

logger = getLogger(__name__)


async def cron_update_calendar_table(ctx):
    logger.info('start fetching pdf')
    file_name = await fetch_pdf(ctx)
    if not file_name:
        return
    # check if file is updated
    logger.info('fetched pdf_file')
    parser = ParserPDF()
    loop = asyncio.get_running_loop()

    with ProcessPoolExecutor() as executor:
        rows = await loop.run_in_executor(executor, parser.grap_rows, file_name)

    os.remove(file_name)
    # logger.info('count rows %d', len(rows))


async def _fetch_pdf(ctx, url_to_pdf: str):
    maker = ctx['async_session_maker']
    # async with maker() as db_session:
    #     db_session: AsyncSession
    #     stmt = select(FilePDF).join(File, File.id == FilePDF.file_id).where(File.file_path == url_to_pdf)
    #     file_pdf = await db_session.execute(stmt)

    async with aiohttp.ClientSession() as session:
        async with session.get(url_to_pdf, ssl=False) as response:
            logger.info('got response %s', response)
            response_date = response.headers['Date']
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

                                # logger.info(f"Документ для %s года не найден.", current_year)
                        except json.JSONDecodeError as e:
                            logger.exception(f"Ошибка при обработке JSON данных:", exc_info=e)
            else:
                logger.info(f"Ошибка: %s", response.status)
