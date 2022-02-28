import csv from 'csv-parser';
import fs from 'fs';

const records = [];
fs.createReadStream('01_csv/csv/data.csv')
    .pipe(csv(['Name', 'Url']))
    .on('data', (data) => {
        records.push(data)
    })
    .on('end', () => {
        console.log('records', records);
    });

