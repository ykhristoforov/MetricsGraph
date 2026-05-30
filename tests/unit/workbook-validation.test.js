import { describe, expect, it } from 'vitest';
import * as XLSX from 'xlsx';
import { ERROR_CATEGORIES } from '../../src/lib/errors.js';
import { parseWorkbookToPoints, selectWorksheetWithRequiredColumns } from '../../src/parsing/workbook-validation.js';

function workbookFromSheets(sheets) {
  const workbook = XLSX.utils.book_new();
  for (const [name, rows] of Object.entries(sheets)) {
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), name);
  }
  return workbook;
}

describe('workbook validation', () => {
  it('selects the first sheet containing required columns', () => {
    const workbook = workbookFromSheets({
      Cover: [{ NOTE: 'ignore' }],
      Data: [{ METRIC_MONTH: '2024-01-01', LEAD_DAYS_V1_FIRST: 10, CYCLE_DAYS_V1_FIRST: 5 }]
    });
    expect(selectWorksheetWithRequiredColumns(workbook).sheetName).toBe('Data');
  });

  it('normalizes valid rows to chart points', () => {
    const workbook = workbookFromSheets({
      Data: [
        { METRIC_MONTH: '2024-02-01', LEAD_DAYS_V1_FIRST: 20, CYCLE_DAYS_V1_FIRST: 10 },
        { METRIC_MONTH: '2024-01-01', LEAD_DAYS_V1_FIRST: 10, CYCLE_DAYS_V1_FIRST: 5 }
      ]
    });
    const points = parseWorkbookToPoints(workbook);
    expect(points.map((point) => point.month)).toEqual(['2024-01-01', '2024-02-01']);
    expect(points[0].flowEfficiencyPercent).toBe(50);
  });

  it('accepts METRIC_MONTH in dd.MM.yyyy format when it is the first day of month', () => {
    const workbook = workbookFromSheets({
      Data: [{ METRIC_MONTH: '01.05.2025', LEAD_DAYS_V1_FIRST: '     26.74', CYCLE_DAYS_V1_FIRST: '     74.06' }]
    });
    const points = parseWorkbookToPoints(workbook);
    expect(points[0].month).toBe('2025-05-01');
    expect(points[0].leadDays).toBe(26.74);
    expect(points[0].cycleDays).toBe(74.06);
  });

  it('throws content error for missing columns', () => {
    const workbook = workbookFromSheets({ Data: [{ METRIC_MONTH: '2024-01-01' }] });
    expectValidationDetail(() => parseWorkbookToPoints(workbook), /обязательные колонки/);
  });

  it('throws content error for invalid month date', () => {
    const workbook = workbookFromSheets({
      Data: [{ METRIC_MONTH: '2024-01-15', LEAD_DAYS_V1_FIRST: 10, CYCLE_DAYS_V1_FIRST: 5 }]
    });
    expectValidationDetail(() => parseWorkbookToPoints(workbook), /первым днём месяца/);
  });

  it('throws content error for zero LeadTime', () => {
    const workbook = workbookFromSheets({
      Data: [{ METRIC_MONTH: '2024-01-01', LEAD_DAYS_V1_FIRST: 0, CYCLE_DAYS_V1_FIRST: 5 }]
    });
    expectValidationDetail(() => parseWorkbookToPoints(workbook), /больше 0/);
  });

  it('throws content error for negative CycleTime', () => {
    const workbook = workbookFromSheets({
      Data: [{ METRIC_MONTH: '2024-01-01', LEAD_DAYS_V1_FIRST: 10, CYCLE_DAYS_V1_FIRST: -1 }]
    });
    expectValidationDetail(() => parseWorkbookToPoints(workbook), /не может быть отрицательным/);
  });

  it('throws content error for duplicate months', () => {
    const workbook = workbookFromSheets({
      Data: [
        { METRIC_MONTH: '2024-01-01', LEAD_DAYS_V1_FIRST: 10, CYCLE_DAYS_V1_FIRST: 5 },
        { METRIC_MONTH: '2024-01-01', LEAD_DAYS_V1_FIRST: 12, CYCLE_DAYS_V1_FIRST: 6 }
      ]
    });
    expectValidationDetail(() => parseWorkbookToPoints(workbook), /дублирующийся/);
  });

  it('uses content-format category for validation failures', () => {
    const workbook = workbookFromSheets({ Data: [{ METRIC_MONTH: '2024-01-01' }] });
    try {
      parseWorkbookToPoints(workbook);
    } catch (error) {
      expect(error.category).toBe(ERROR_CATEGORIES.CONTENT_FORMAT);
    }
  });
});

function expectValidationDetail(action, pattern) {
  try {
    action();
    throw new Error('Expected validation error');
  } catch (error) {
    expect(error.details.join('; ')).toMatch(pattern);
  }
}
