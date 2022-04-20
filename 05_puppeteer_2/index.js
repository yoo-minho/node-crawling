import csv from 'csv-parser';
import fs from 'fs';
import puppeteer from 'puppeteer';
import axios from 'axios';

const crawler = async () => {

    const isProduction = process.env.NODE_ENV === 'production';
    try {
        const browser = await puppeteer.launch({headless: false})
        const page = await browser.newPage();
        await page.goto('https://unsplash.com');
        const result = await page.evaluate(() => {
            const imgEls = document.querySelectorAll('figure[itemprop=image]');
            if (imgEls.length > 0) {
                return [...imgEls].map(v => {
                    const url = v.querySelector('img').src;
                    v.parentElement.removeChild(v);
                    return url;
                });
            }
            window.scrollBy(0, 1000);
        })
        console.log(result);
        await page.waitForSelector('figure[itemprop=image]');
        console.log('태그 로딩 완료');
        //await page.close();
        //await browser.close();
    } catch (e) {
        console.error(e);
    }

}

crawler();
