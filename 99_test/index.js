import axios from "axios";
import cheerio from 'cheerio';

console.log('Start');

//const response = await axios.get('https://blog.naver.com/dellose');
const response = await axios.get('https://velog.io/@wongue_shin');

if (response.status === 200) {
    const html = response.data;
    const $ = cheerio.load(html);
    const arr = [];
    $(".subinfo").each((i, v) => {
        arr.push($(v).find("span").eq(0).text());
    })
    console.log(arr);
}

console.log('End');