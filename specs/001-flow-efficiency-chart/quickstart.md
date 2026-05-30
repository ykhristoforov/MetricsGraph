# Quickstart: Flow Efficiency Dashboard

## Prerequisites

- Node.js LTS.
- A modern desktop browser.
- Local XLSX fixture files for valid and invalid workbook scenarios.

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open the local Vite URL shown by the command.

## Validate The Primary Flow

1. Select `tests/fixtures/valid-flow-efficiency.xlsx`.
2. Confirm the app renders the `Flow Efficiency · Lead & Cycle Time` dashboard.
3. Confirm the dashboard shows the report period and four KPI widgets: average Flow Efficiency, average Lead Time, average Cycle Time, and Flow Efficiency range.
4. Confirm the chart shows Flow Efficiency bars plus Lead Time and Cycle Time lines.
5. Hover a month and confirm the tooltip shows month, LeadTime, CycleTime, and Flow Efficiency.
6. Confirm the export action is enabled.

## Validate Outlier Presentation

1. Use a valid workbook where CycleTime is greater than LeadTime or Flow Efficiency is above 100%.
2. Confirm the affected month is marked as an outlier on the chart.
3. Confirm the average KPI note states that an outlier month is excluded.
4. Confirm the insight block explains the month, LeadTime, CycleTime, and Flow Efficiency.

## Validate Offline Export

1. Build or run the app locally.
2. Load a valid workbook and wait for the dashboard.
3. Click «Скачать как HTML».
4. Disable network access.
5. Open the downloaded `.html` file in a browser.
6. Confirm the exported file displays the dashboard title, period, KPI widgets, chart, and outlier insight when present.
7. Confirm the exported chart remains interactive and contains the same months and Flow Efficiency values as the in-app dashboard.

## Validate Error Handling

Use fixture files to verify:

- Non-XLSX file -> file-format error.
- XLSX missing required columns -> content-format error listing required columns.
- Invalid `METRIC_MONTH` -> content-format error for month values.
- `LEAD_DAYS_V1_FIRST` equal to 0 or negative -> content-format error.
- Negative `CYCLE_DAYS_V1_FIRST` -> content-format error.
- Duplicate `METRIC_MONTH` -> content-format error.
- After any failed upload, the dashboard is hidden and export is unavailable.

## Build Static App

```bash
npm run build
```

The generated app must be deployable as static files with no backend service.

## Test

```bash
npm test
```

Expected coverage:
- Unit validation for workbook content rules.
- Unit calculation for `CycleTime / LeadTime * 100%`.
- Unit export checks for embedded dashboard content and absence of remote references.
- Browser integration for upload, dashboard rendering, chart interaction, and offline export.
