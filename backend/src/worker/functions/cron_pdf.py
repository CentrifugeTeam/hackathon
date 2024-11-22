import asyncio

import aiohttp
from bs4 import BeautifulSoup
import json
import datetime
from logging import getLogger
from concurrent.futures import ProcessPoolExecutor
from ..parser_pdf.parser import ParserPDF

logger = getLogger(__name__)


async def cron_update_calendar_table(ctx):
    pdf_file = await fetch_pdf()
    # check if file is updated
    parser = ParserPDF()
    loop = asyncio.get_running_loop()
    with ProcessPoolExecutor() as executor:
        res = await loop.run_in_executor(executor, parser.grap_rows, pdf_file)

    logger.info('fetched pdf_file %s', pdf_file)
    pass


async def _fetch_pdf(url_to_pdf: str):
    async with aiohttp.ClientSession() as session:
        async with session.get(url_to_pdf, ssl=False) as response:
            return await response.read()





async def fetch_pdf():
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
                                                return await _fetch_pdf(pdf_url)

                                logger.info(f"Документ для %s года не найден.", current_year)
                        except json.JSONDecodeError as e:
                            logger.exception(f"Ошибка при обработке JSON данных:", exc_info=e)
            else:
                logger.info(f"Ошибка: %s", response.status)
