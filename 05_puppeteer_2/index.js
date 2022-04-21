import puppeteer from 'puppeteer';

const crawler = async () => {
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
