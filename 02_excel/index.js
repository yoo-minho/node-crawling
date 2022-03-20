import xlsx from 'xlsx';

const workbook = xlsx.readFile('02_excel/xlsx/data.xlsx');

workbook.SheetNames.forEach(v => {
    const ws = workbook.Sheets[v];
    const records = xlsx.utils.sheet_to_json(ws);
    console.log(records);
})
