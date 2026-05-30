# UI Contract: Flow Efficiency Chart

## Upload Form

### Initial State

- Shows a single file input accepting `.xlsx`.
- Shows no chart.
- «Скачать как HTML» is disabled or unavailable until a valid chart exists.

### File Selection

Input:
- One local file selected by the user.

Expected behavior:
- If the file is not a valid XLSX workbook, show a file-format error.
- If the workbook has no worksheet with all required columns, show a content-format
  error with the missing required columns.
- If row values are invalid, show a content-format error describing the invalid
  value category.
- If data is valid, render the chart and enable «Скачать как HTML».

## Workbook Content Contract

Required columns:
- `METRIC_MONTH`: Date value representing the first day of a month.
- `LEAD_DAYS_V1_FIRST`: Numeric LeadTime, greater than 0.
- `CYCLE_DAYS_V1_FIRST`: Numeric CycleTime, greater than or equal to 0.

Worksheet selection:
- Inspect worksheets in workbook order.
- Use the first worksheet containing all required columns.
- Ignore extra columns.

Rejected content:
- Missing required columns.
- Empty workbook or worksheet.
- Invalid month date or non-first-day date.
- Empty or non-numeric LeadTime/CycleTime.
- Zero or negative LeadTime.
- Negative CycleTime.
- Duplicate `METRIC_MONTH` values.

## Chart Contract

Chart type:
- Combined chart with monthly bars plus a trend line.

Data:
- X-axis: months sorted ascending.
- Bar values: Flow Efficiency percentage by month.
- Trend line: same Flow Efficiency series connected across months.

Interaction:
- Hover or point selection shows month, LeadTime, CycleTime, and Flow Efficiency.
- Flow Efficiency values are displayed as percentages.
- Values above 100% are displayed without normalization or capping.

Visual rules:
- Use official Moscow Exchange brand colors identified from official sources.
- Do not depend on remote fonts, images, or styles at runtime.

## HTML Export Contract

Trigger:
- User clicks «Скачать как HTML» after a valid chart has been generated.

Output:
- One downloaded `.html` file.

The file MUST include:
- Parsed Flow Efficiency data.
- Plotly data/layout/config.
- Plotly runtime needed to render the graph.
- Styles needed for the exported report.

The file MUST NOT include:
- CDN script references.
- Remote font references.
- Remote image references.
- Server endpoint calls.
- Any dependency on the original XLSX file.

Offline acceptance:
- Opening the file with network disabled displays the same months and Flow
  Efficiency values as the in-app chart.
