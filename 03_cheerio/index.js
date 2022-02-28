import axios from "axios";
import cheerio from 'cheerio';
import xlsx from 'xlsx';

const workbook = xlsx.readFile('02_excel/xlsx/data.xlsx');
const ws = workbook.Sheets.영화목록;
const records = xlsx.utils.sheet_to_json(ws);

const crawler = (records) => {
    return Promise.all(records.map(async (r) => {
        const response = await axios.get(r.링크);
        if(response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            r.point = $("#pointNetizenPersentBasic").text();
        }
        return r;
    }))
}

const result = await crawler(records);

console.log(result);