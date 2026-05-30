# Implementation Plan: Flow Efficiency Dashboard

**Branch**: `001-flow-efficiency-chart` | **Date**: 2026-05-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-flow-efficiency-chart/spec.md`

## Summary

Maintain a static browser-only mini-dashboard that accepts a local XLSX workbook,
validates the required Flow Efficiency columns, parses the first worksheet containing
those columns, renders dashboard KPI widgets plus an interactive monthly chart, and
exports the whole dashboard as a single offline-capable HTML file.

Technical approach: Vite with vanilla HTML/CSS/JS; SheetJS `xlsx` for browser XLSX
parsing; Plotly.js bundled locally for in-app chart rendering and embedded directly
into exported HTML. The implemented dashboard keeps workbook data in memory, shows
average Flow Efficiency, average Lead Time, average Cycle Time, Flow Efficiency
range, outlier insight when present, and downloads one autonomous HTML report. No
backend, no server upload, no runtime CDN.

## Technical Context

**Language/Version**: JavaScript ES modules with Vite static build; Node.js LTS for build tooling

**Primary Dependencies**: Vite, SheetJS `xlsx`, Plotly.js, Vitest, Playwright

**Storage**: Client-side only; parsed data and chart definition are held in memory and embedded into downloaded HTML export

**Testing**: Vitest unit tests for parsing/validation/calculation/export generation; Playwright browser integration tests for upload, dashboard rendering, and offline export

**Target Platform**: Modern desktop browsers running a static web app; exported HTML opens as a local browser file

**Project Type**: Static web app/client-side dashboard tool

**Performance Goals**: Valid XLSX files with up to 120 monthly rows render a visible dashboard within 5 seconds on a typical user laptop

**Constraints**: Client-only; no backend/data upload; browser Excel parsing; self-contained HTML export; offline-capable exported dashboard; runtime dependencies bundled locally

**Scale/Scope**: Single-user local workbook workflow; one dashboard per uploaded workbook; no persistence, accounts, collaboration, server deployment requirement, or remote data source

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Client-only execution: PASS. The plan uses only local file input, in-memory data,
  static assets, and downloaded HTML. No backend, telemetry, or workbook upload.
- Browser Excel parsing: PASS. SheetJS runs in the browser against the user's local
  XLSX file and selects the first worksheet containing the required columns.
- Simple readable code: PASS. Vanilla modules are separated by import, validation,
  calculation, dashboard/chart rendering, export, and UI orchestration. Dependencies
  are limited to Vite, SheetJS, Plotly, Vitest, and Playwright.
- Self-contained HTML export: PASS. Export generation embeds the dashboard data,
  KPI values, styles, Plotly runtime, and chart config in one HTML file with no CDN,
  remote font, remote image, remote script, endpoint, or source workbook dependency.
- File format errors: PASS. Plan includes distinct file-format and content-format
  validation flows, invalid fixture coverage, user-facing messages, and dashboard
  clearing after failed upload.

## Project Structure

### Documentation (this feature)

```text
specs/001-flow-efficiency-chart/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-contract.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
index.html
package.json
vite.config.js
src/
├── main.js
├── styles.css
├── parsing/
│   ├── workbook-reader.js
│   └── workbook-validation.js
├── rendering/
│   ├── flow-efficiency-chart.js
│   └── moex-palette.js
├── export/
│   └── html-export.js
└── lib/
    ├── flow-efficiency.js
    └── errors.js

tests/
├── fixtures/
│   ├── create-fixtures.mjs
│   ├── valid-flow-efficiency.xlsx
│   ├── invalid-format.txt
│   ├── missing-columns.xlsx
│   ├── invalid-values.xlsx
│   └── duplicate-month.xlsx
├── integration/
│   ├── upload-and-chart.spec.js
│   └── offline-export.spec.js
└── unit/
    ├── workbook-validation.test.js
    ├── flow-efficiency.test.js
    └── html-export.test.js
```

**Structure Decision**: Use a single static client application at repository root.
The module layout mirrors the delivered workflow: workbook import and validation,
domain calculation, dashboard/chart rendering, and self-contained dashboard export.

## Complexity Tracking

No constitution violations or complexity exceptions are required.
