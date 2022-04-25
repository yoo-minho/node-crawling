import puppeteer from 'puppeteer';
import dotenv from 'dotenv';

dotenv.config();

const crawler = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--window-size=1920,1080']
        })
        const page = await browser.newPage()
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1,
            isMobile: false,
            hasTouch: false,
            isLandscape: false
        });
        await page.goto('https://facebook.com');

        const id = process.env.EMAIL;
        const password = process.env.PASSWORD;

        console.log(password);

        // await page.evaluate((id, password) => {
        //     document.querySelector('#email').value = id;
        //     document.querySelector('#pass').value = password;
        //     document.querySelector('form button').click();
        // }, id, password)
        await page.type('#email', id);
        await page.type('#pass', password);

        await page.hover('form button');
        await page.waitForTimeout(3000);
        await page.click('form button');



        return;
        await page.waitForSelector('#listTopForm', {timeout:3000})
        const res = await page.evaluate(() => {
            const trEls = document.getElementById('listTopForm').querySelectorAll('tbody tr');
            if (trEls.length > 0) {
                return [...trEls].map(v => {
                    const el = v.querySelector('._setTopListUrl');
                    return {
                        title: el?.textContent,
                        url: el?.href,
                        date: v.querySelector('.date.pcol2')?.textContent
                    }
                })
            }
            return [];
        })
        console.log(res);
        await browser.close();
    } catch (e) {
        console.error(e);
    }
}

crawler();
