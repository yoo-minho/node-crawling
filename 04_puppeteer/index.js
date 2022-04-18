import csv from 'csv-parser';
import fs from 'fs';
import puppeteer from 'puppeteer'

const crawler = async (records) => {

    const isProduction = process.env.NODE_ENV === 'production';
    const browser = await puppeteer.launch({headless: true})

    try {
        await Promise.all(records.map(async (v) => {
            try {
                const page = await browser.newPage();
                await page.goto(v.Url);
                const result = await page.evaluate(() => {
                    const scoreEl = document.querySelector('.score.score_left .star_score')
                    if (scoreEl) {
                        return {
                            score: scoreEl.textContent.trim()
                        };
                    }
                })
                console.log(result);
                await page.close();
            } catch (e) {
                console.error(e);
            }
        }))
        await browser.close();
    } catch (e) {
        console.error(e);
    }
}


const records = [];
fs.createReadStream('01_csv/csv/data.csv')
    .pipe(csv(['Name', 'Url']))
    .on('data', (data) => {
        records.push(data);
    })
    .on('end', () => {
        crawler(records);
    });

