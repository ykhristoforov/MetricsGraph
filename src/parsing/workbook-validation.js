import { calculateFlowEfficiency, sortPointsByMonth } from '../lib/flow-efficiency.js';
import { contentFormatError } from '../lib/errors.js';
import { worksheetToRows } from './workbook-reader.js';

export const REQUIRED_COLUMNS = [
  'METRIC_MONTH',
  'LEAD_DAYS_V1_FIRST',
  'CYCLE_DAYS_V1_FIRST'
];

export function parseWorkbookToPoints(workbook) {
  const selected = selectWorksheetWithRequiredColumns(workbook);
  const rows = worksheetToRows(workbook, selected.sheetName);

  if (rows.length === 0) {
    throw contentFormatError('Ошибка содержимого файла', ['Выбранный лист не содержит строк данных']);
  }

  const seenMonths = new Set();
  const points = rows.map((row, index) => normalizeRow(row, index + 2, seenMonths));
  return sortPointsByMonth(points);
}

export function selectWorksheetWithRequiredColumns(workbook) {
  if (!workbook?.SheetNames?.length) {
    throw contentFormatError('Ошибка содержимого файла', ['Workbook не содержит листов']);
  }

  for (const sheetName of workbook.SheetNames) {
    const rows = worksheetToRows(workbook, sheetName);
    const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
    const missing = REQUIRED_COLUMNS.filter((column) => !headers.includes(column));
    if (missing.length === 0) {
      return { sheetName, headers, rows };
    }
  }

  throw contentFormatError(
    'Ошибка содержимого файла',
    [`Не найдены обязательные колонки: ${REQUIRED_COLUMNS.join(', ')}`]
  );
}

function normalizeRow(row, sourceRowNumber, seenMonths) {
  const month = normalizeMonth(row.METRIC_MONTH, sourceRowNumber);
  if (seenMonths.has(month)) {
    throw contentFormatError('Ошибка содержимого файла', [
      `Строка ${sourceRowNumber}: дублирующийся METRIC_MONTH ${month}`
    ]);
  }
  seenMonths.add(month);

  const leadDays = parseRequiredNumber(row.LEAD_DAYS_V1_FIRST, 'LEAD_DAYS_V1_FIRST', sourceRowNumber);
  if (leadDays <= 0) {
    throw contentFormatError('Ошибка содержимого файла', [
      `Строка ${sourceRowNumber}: LEAD_DAYS_V1_FIRST должен быть больше 0`
    ]);
  }

  const cycleDays = parseRequiredNumber(row.CYCLE_DAYS_V1_FIRST, 'CYCLE_DAYS_V1_FIRST', sourceRowNumber);
  if (cycleDays < 0) {
    throw contentFormatError('Ошибка содержимого файла', [
      `Строка ${sourceRowNumber}: CYCLE_DAYS_V1_FIRST не может быть отрицательным`
    ]);
  }

  const flowEfficiencyPercent = calculateFlowEfficiency(cycleDays, leadDays);
  return {
    month,
    label: new Intl.DateTimeFormat('ru-RU', { month: 'short', year: 'numeric' }).format(
      dateFromMonth(month)
    ),
    leadDays,
    cycleDays,
    flowEfficiencyPercent
  };
}

function normalizeMonth(value, sourceRowNumber) {
  const date = parseDate(value);
  if (!date || date.getUTCDate() !== 1) {
    throw contentFormatError('Ошибка содержимого файла', [
      `Строка ${sourceRowNumber}: METRIC_MONTH должен быть первым днём месяца`
    ]);
  }

  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-01`;
}

function parseDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
  }

  if (typeof value !== 'string' && typeof value !== 'number') {
    return null;
  }

  if (typeof value === 'number') {
    const epoch = new Date(Date.UTC(1899, 11, 30));
    epoch.setUTCDate(epoch.getUTCDate() + value);
    return epoch;
  }

  const trimmed = value.trim();
  const isoLikeMatch = trimmed.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (isoLikeMatch) {
    return new Date(
      Date.UTC(Number(isoLikeMatch[1]), Number(isoLikeMatch[2]) - 1, Number(isoLikeMatch[3]))
    );
  }

  const europeanDateMatch = trimmed.match(/^(\d{1,2})[.](\d{1,2})[.](\d{4})$/);
  if (europeanDateMatch) {
    return new Date(
      Date.UTC(
        Number(europeanDateMatch[3]),
        Number(europeanDateMatch[2]) - 1,
        Number(europeanDateMatch[1])
      )
    );
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return new Date(Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()));
}

function parseRequiredNumber(value, column, sourceRowNumber) {
  if (value === null || value === undefined || value === '') {
    throw contentFormatError('Ошибка содержимого файла', [
      `Строка ${sourceRowNumber}: ${column} обязателен`
    ]);
  }

  const number = Number(String(value).replace(',', '.'));
  if (!Number.isFinite(number)) {
    throw contentFormatError('Ошибка содержимого файла', [
      `Строка ${sourceRowNumber}: ${column} должен быть числом`
    ]);
  }
  return number;
}

function dateFromMonth(month) {
  const [year, monthNumber] = month.split('-').map(Number);
  return new Date(Date.UTC(year, monthNumber - 1, 1));
}
