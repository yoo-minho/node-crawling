import csv from 'csv-parser';
import fs from 'fs';
import puppeteer from 'puppeteer'

const crawler = async () => {
    const browser = await puppeteer.launch({headless:false})
    const page = await browser.newPage();
    const page2 = await browser.newPage();
    await Promise.all([
        page.goto('http://flow.team'),
        page2.goto('http://naver.com'),
    ])
    await page.waitForTimeout(3000);
    await page2.waitForTimeout(1000);
    await page.close();
    await page2.close();
    await browser.close();
}

crawler();

const records = [];
fs.createReadStream('01_csv/csv/data.csv')
    .pipe(csv(['Name', 'Url']))
    .on('data', (data) => {
        records.push(data)
    })
    .on('end', () => {
        console.log('records', records);
    });

