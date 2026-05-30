# UI Contract: Flow Efficiency Dashboard

## Upload Form

### Initial State

- Shows a single file input accepting `.xlsx`.
- Shows a status message asking the user to upload an XLSX workbook.
- Shows no dashboard.
- «Скачать как HTML» is disabled or unavailable until a valid dashboard exists.

### File Selection

Input:
- One local file selected by the user.

Expected behavior:
- Show the selected file name.
- Show a reading status while the file is being processed.
- If the file is not a valid XLSX workbook, show a file-format error, hide the dashboard, and keep export unavailable.
- If the workbook has no worksheet with all required columns, show a content-format error with the required columns.
- If row values are invalid, show a content-format error describing the invalid value category or row.
- If data is valid, render the dashboard and enable «Скачать как HTML».

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

Accepted-but-annotated content:
- Flow Efficiency above 100%.
- CycleTime greater than LeadTime.

## Dashboard Contract

Dashboard sections:
- Header with the title `Flow Efficiency · Lead & Cycle Time`.
- Subtitle containing the reporting period.
- MOEX IT brand marker.
- Four KPI widgets: average Flow Efficiency, average Lead Time, average Cycle Time, and Flow Efficiency range.
- Interactive chart.
- Optional outlier insight block.

KPI behavior:
- Average Flow Efficiency, Lead Time, and Cycle Time use non-outlier months when at least one non-outlier month exists.
- If all months are outliers, averages use all months.
- The Flow Efficiency widget states whether it uses all months or excludes an outlier.
- The range widget shows the minimum and maximum Flow Efficiency values and their month labels.

Outlier behavior:
- A month is an outlier when Flow Efficiency exceeds 100% or CycleTime exceeds LeadTime.
- Outlier months remain visible in dashboard context and chart interaction.
- The dashboard shows an insight block for the first outlier, including month, LeadTime, CycleTime, Flow Efficiency, and a human-readable explanation.

Visual rules:
- Use Moscow Exchange visual styling as the product color language.
- Do not depend on remote fonts, images, or styles at runtime.

## Chart Contract

Chart type:
- Combined chart with Flow Efficiency bars and Lead Time/Cycle Time lines.

Data:
- X-axis: months sorted ascending.
- Flow Efficiency values: bars on the percentage axis.
- Lead Time values: line on the days axis.
- Cycle Time values: line on the days axis.

Interaction:
- Hover or point selection shows month, LeadTime, CycleTime, and Flow Efficiency.
- Flow Efficiency values are displayed as percentages.
- LeadTime and CycleTime values are displayed in days.
- Values above 100% are displayed without normalization or capping.

Outlier presentation:
- Outlier months do not render as normal Flow Efficiency bars.
- Outlier months receive a chart annotation showing the calculated percentage and outlier label.
- Lead Time and Cycle Time lines still include the month.

## HTML Export Contract

Trigger:
- User clicks «Скачать как HTML» after a valid dashboard has been generated.

Output:
- One downloaded `.html` file.
- Suggested filename: `flow-efficiency.html`.

The file MUST include:
- Dashboard title and period.
- MOEX IT brand marker.
- KPI widgets.
- Parsed Flow Efficiency data.
- Chart data/layout/config.
- Chart runtime needed to render the graph.
- Styles needed for the exported dashboard.
- Outlier insight when present.

The file MUST NOT include:
- CDN script references.
- Remote font references.
- Remote image references.
- Server endpoint calls.
- Any dependency on the original XLSX file.

Offline acceptance:
- Opening the file with network disabled displays the same dashboard period, KPI
  values, months, chart, and Flow Efficiency values as the in-app dashboard.
