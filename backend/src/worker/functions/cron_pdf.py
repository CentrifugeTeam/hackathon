import aiohttp
from bs4 import BeautifulSoup
import json
import datetime

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
                                                print(pdf_url)
                                                return pdf_url

                                print(f"Документ для {current_year} года не найден.")
                        except json.JSONDecodeError as e:
                            print(f"Ошибка при обработке JSON данных: {e}")
            else:
                print(f"Ошибка: {response.status}")


