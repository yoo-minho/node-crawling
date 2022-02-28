import xlsx from 'xlsx';

const workbook = xlsx.readFile('02_excel/xlsx/data.xlsx');
const ws = workbook.Sheets.영화목록;
const records = xlsx.utils.sheet_to_json(ws);

console.log(records);