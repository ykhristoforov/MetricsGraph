import * as XLSX from 'xlsx';
import { writeFileSync, mkdirSync } from 'node:fs';

mkdirSync('tests/fixtures', { recursive: true });

function writeWorkbook(path, sheets) {
  const workbook = XLSX.utils.book_new();
  for (const [name, rows] of Object.entries(sheets)) {
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), name);
  }
  XLSX.writeFile(workbook, path, { bookType: 'xlsx' });
}

writeWorkbook('tests/fixtures/valid-flow-efficiency.xlsx', {
  Cover: [{ NOTE: 'This sheet should be ignored' }],
  Metrics: [
    { METRIC_MONTH: '2024-01-01', LEAD_DAYS_V1_FIRST: 10, CYCLE_DAYS_V1_FIRST: 5 },
    { METRIC_MONTH: '2024-02-01', LEAD_DAYS_V1_FIRST: 12, CYCLE_DAYS_V1_FIRST: 6 },
    { METRIC_MONTH: '2024-03-01', LEAD_DAYS_V1_FIRST: 8, CYCLE_DAYS_V1_FIRST: 10 }
  ]
});

writeFileSync('tests/fixtures/invalid-format.txt', 'not an xlsx workbook\n');

writeWorkbook('tests/fixtures/missing-columns.xlsx', {
  Data: [{ METRIC_MONTH: '2024-01-01', LEAD_DAYS_V1_FIRST: 10 }]
});

writeWorkbook('tests/fixtures/invalid-values.xlsx', {
  Data: [
    { METRIC_MONTH: '2024-01-15', LEAD_DAYS_V1_FIRST: 10, CYCLE_DAYS_V1_FIRST: 5 },
    { METRIC_MONTH: '2024-02-01', LEAD_DAYS_V1_FIRST: 0, CYCLE_DAYS_V1_FIRST: 5 },
    { METRIC_MONTH: '2024-03-01', LEAD_DAYS_V1_FIRST: -1, CYCLE_DAYS_V1_FIRST: 5 },
    { METRIC_MONTH: '2024-04-01', LEAD_DAYS_V1_FIRST: 'bad', CYCLE_DAYS_V1_FIRST: 5 },
    { METRIC_MONTH: '2024-05-01', LEAD_DAYS_V1_FIRST: 10, CYCLE_DAYS_V1_FIRST: -1 }
  ]
});

writeWorkbook('tests/fixtures/duplicate-month.xlsx', {
  Data: [
    { METRIC_MONTH: '2024-01-01', LEAD_DAYS_V1_FIRST: 10, CYCLE_DAYS_V1_FIRST: 5 },
    { METRIC_MONTH: '2024-01-01', LEAD_DAYS_V1_FIRST: 12, CYCLE_DAYS_V1_FIRST: 6 }
  ]
});
