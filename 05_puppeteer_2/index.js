import puppeteer from 'puppeteer';

const crawler = async () => {
    try {
        const browser = await puppeteer.launch({headless: true})
        const page = await browser.newPage();
        await page.goto('https://unsplash.com');
        let results = [];

        let src;
        let cycle = 0;
        while (cycle < 10) {
            console.log("cycle", cycle, results.length);
            try {
                src = await getSrc(page);
                results = [...results, ...src];
            } catch (e) {
                cycle = 10;
            }
            if (results.length > 100) {
                cycle = 10;
            }
            cycle++;
        }

        console.log(results.length, results);
        await page.close();
        await browser.close();
    } catch (e) {
        console.error(e);
    }

    async function getSrc(page) {
        const selectorTimeout = 3000;
        try {
            const src = await page.evaluate(() => {
                window.scrollBy(0, 0);
                const imgEls = document.querySelectorAll('figure[itemprop=image]');
                let data = [];
                if (imgEls.length > 0) {
                    data = [...imgEls].map(v => {
                        const url = v.querySelector('img').src;
                        v.parentElement.removeChild(v);
                        return url;
                    });
                }
                setTimeout(() => window.scrollBy(0, 300), 1000)
                return data;
            })
            await page.waitForSelector('figure[itemprop=image]', {timeout: selectorTimeout});
            return src;
        } catch (e) {
            return [];
        }
    }
}

crawler();
