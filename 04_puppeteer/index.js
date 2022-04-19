import csv from 'csv-parser';
import fs from 'fs';
import puppeteer from 'puppeteer';
import axios from 'axios';

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

const crawlerPeople = async (records) => {

    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36';
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--window-size=1920,1080']
    })
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080,
    })
    await page.setUserAgent(userAgent);
    for (const [_, v] of records.entries()) {
        await page.goto(v.Url);
        const result = await page.evaluate(() => {
            const scoreEl = document.querySelector('.score.score_left .star_score');
            const posterEl = document.querySelector('.poster img');
            return {
                score: scoreEl?.textContent?.trim(),
                img: posterEl?.src
            };
        })
        if (result.img) {
            const imgResult = await axios.get(result.img, {responseType: "arraybuffer"});
            fs.writeFileSync(`poster/${v.Name}.jpg`, imgResult.data);
        }

        await page.screenshot({
            path: `screenshot/${v.Name}.jpg`,
            fullPage: true,
            // clip: {
            //     x: 100,
            //     y: 100,
            //     width: 300,
            //     height: 300,
            // }
        });

        console.log(result);
        await page.waitForTimeout(1000)
    }
    await page.close();
    await browser.close();
}

fs.readdir('poster', (err) => {
    if (err) {
        console.error('poster 폴더가 없어서 생성합니다.');
        fs.mkdirSync('poster');
    }
})

fs.readdir('screenshot', (err) => {
    if (err) {
        console.error('screenshot 폴더가 없어서 생성합니다.');
        fs.mkdirSync('screenshot');
    }
})

const records = [];
fs.createReadStream('01_csv/csv/data.csv')
    .pipe(csv(['Name', 'Url']))
    .on('data', (data) => {
        records.push(data);
    })
    .on('end', () => {
        crawlerPeople(records);
    });

