import axios from "axios";
import cheerio from 'cheerio';
import xlsx from 'xlsx';
import {add_to_sheet} from "./add_to_sheet.js";

const workbook = xlsx.readFile('02_excel/xlsx/data.xlsx');

const crawler = async (ws, records) => {
    add_to_sheet(ws, 'C1', 'S', '평점');
    for (const [i, r] of records.entries()) {
        const response = await axios.get(r.링크);
        if (response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            const text = $("#pointNetizenPersentBasic").text();
            const newCell = `C${i+2}`
            add_to_sheet(ws, newCell, 'S', parseFloat(text.trim()));
        }
    }
    xlsx.writeFile(workbook, '02_excel/xlsx/result.xlsx');
}

workbook.SheetNames.forEach(async v => {
    const ws = workbook.Sheets[v];
    const records = xlsx.utils.sheet_to_json(ws);
    const result = await crawler(ws, records);
    console.log(result);
})