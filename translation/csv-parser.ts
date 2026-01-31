import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';

interface TranslationRow {
  key: string;
  en: string;
  ko: string;
  [key: string]: string; // For other languages
}

const csvFilePath = path.resolve(__dirname, 'translation.csv');
const outputPath = path.resolve(__dirname); // Output to the same directory

const translations: { [lang: string]: { [key: string]: string } } = {
  en: {},
  ko: {},
};

// Determine available languages from the CSV header
let languages: string[] = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('headers', (headers: string[]) => {
    // Assuming the first column is 'key' and subsequent columns are language codes
    languages = headers.filter(header => header !== 'key');
    languages.forEach(lang => {
      translations[lang] = {};
    });
  })
  .on('data', (row: TranslationRow) => {
    const key = row.key;
    if (key) {
      languages.forEach(lang => {
        translations[lang][key] = row[lang] || '';
      });
    }
  })
  .on('end', () => {
    for (const lang of languages) {
      const jsonFilePath = path.join(outputPath, `${lang}.json`);
      fs.writeFileSync(jsonFilePath, JSON.stringify(translations[lang], null, 2), 'utf-8');
      console.log(`Generated ${jsonFilePath}`);
    }
    console.log('i18n JSON files generated successfully.');
  });
