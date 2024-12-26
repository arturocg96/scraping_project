const puppeteer = require('puppeteer');
const { formatEventDate } = require('../utils/dateUtils');

const scrapeEvents = async () => {
    const url = 'https://www.aytoleon.es/es/actualidad/eventos/Paginas/default.aspx';
    return await scrapePage(url);
};

const scrapeAgenda = async () => {
    const url = 'https://www.aytoleon.es/es/actualidad/agenda/Paginas/default.aspx';
    return await scrapePage(url);
};

const scrapePage = async (url) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.waitForSelector('.row.listitem-row');

        const events = await page.evaluate(() => {
            const elements = document.querySelectorAll('.row.listitem-row');
            return Array.from(elements).map(element => {
                const rawDate = element.querySelector('.shortpoint-listitem-date')?.textContent.trim();
                const title = element.querySelector('.listitem-title')?.textContent.trim();
                const subtitle = element.querySelector('.listitem-subtitle')?.textContent.trim();

                let event_time = null;
                let location = null;

                if (subtitle) {
                    const timeMatch = subtitle.match(/^(\d{1,2}:\d{2})/);
                    if (timeMatch) {
                        event_time = timeMatch[1];
                        location = subtitle.replace(timeMatch[0], '').trim();
                    } else {
                        location = subtitle.trim();
                    }

                    location = location.replace(/^\s*horas\s*/i, '').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
                }

                return {
                    rawDate,
                    title,
                    location,
                    event_time,
                };
            });
        });

        await browser.close();

        return events.map(event => ({
            event_date: formatEventDate(event.rawDate),
            title: event.title,
            location: event.location,
            event_time: event.event_time,
        }));
    } catch (error) {
        await browser.close();
        throw error;
    }
};

module.exports = { scrapeEvents, scrapeAgenda };
