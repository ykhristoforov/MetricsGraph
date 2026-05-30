import * as XLSX from 'xlsx';
import { fileFormatError } from '../lib/errors.js';

export async function readWorkbookFromFile(file) {
  if (!file || !file.name.toLowerCase().endsWith('.xlsx')) {
    throw fileFormatError('Ошибка формата файла. Выберите файл XLSX.');
  }

  try {
    const buffer = await file.arrayBuffer();
    return XLSX.read(buffer, { type: 'array', cellDates: true });
  } catch {
    throw fileFormatError('Ошибка формата файла. Файл не удалось прочитать как XLSX.');
  }
}

export function worksheetToRows(workbook, sheetName) {
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet, { defval: null, raw: false });
}
