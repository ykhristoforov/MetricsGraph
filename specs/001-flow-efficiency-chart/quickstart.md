# Quickstart: Flow Efficiency Chart

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
2. Confirm the app renders a combined Flow Efficiency chart with monthly bars and a trend line.
3. Hover a month and confirm the tooltip shows month, LeadTime, CycleTime, and Flow Efficiency.
4. Click «Скачать как HTML».
5. Disable network access.
6. Open the downloaded `.html` file in a browser.
7. Confirm the graph renders offline and contains the same months and Flow Efficiency values.

## Validate Error Handling

Use fixture files to verify:

- Non-XLSX file -> file-format error.
- XLSX missing required columns -> content-format error listing missing columns.
- Invalid `METRIC_MONTH` -> content-format error for month values.
- `LEAD_DAYS_V1_FIRST` equal to 0 or negative -> content-format error.
- Negative `CYCLE_DAYS_V1_FIRST` -> content-format error.
- Duplicate `METRIC_MONTH` -> content-format error.

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
- Unit export checks for absence of remote references.
- Browser integration for upload, chart interaction, and offline export.
