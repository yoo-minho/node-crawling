import puppeteer from 'puppeteer';
import axios from "axios";

const crawler = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
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
        await page.goto('https://blog.naver.com/PostList.naver?blogId=dellose&categoryNo=0');
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
