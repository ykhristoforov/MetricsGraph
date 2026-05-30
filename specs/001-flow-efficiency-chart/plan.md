# Implementation Plan: Flow Efficiency Chart

**Branch**: `001-flow-efficiency-chart` | **Date**: 2026-05-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-flow-efficiency-chart/spec.md`

## Summary

Build a static browser-only web application that accepts a local XLSX workbook,
validates required Flow Efficiency columns, parses the first worksheet containing
those columns, renders an interactive combined monthly bar plus trend-line chart,
and exports a single offline-capable HTML file with embedded Plotly, data, styles,
and graph configuration.

Technical approach: Vite with vanilla HTML/CSS/JS; SheetJS `xlsx` for browser XLSX
parsing; Plotly.js bundled locally for in-app rendering and embedded directly into
exported HTML. No backend, no server upload, no runtime CDN.

## Technical Context

**Language/Version**: JavaScript (ES modules) with Vite static build; Node.js LTS for build tooling

**Primary Dependencies**: Vite, SheetJS `xlsx`, Plotly.js, test tooling suitable for vanilla browser UI

**Storage**: Client-side only; parsed data held in memory and embedded into downloaded HTML export

**Testing**: Unit tests for parsing/validation/export generation; browser integration tests for upload, chart interaction, and offline export

**Target Platform**: Modern desktop browsers running a static web app

**Project Type**: Static web app/client-side tool

**Performance Goals**: Valid XLSX files with up to 120 monthly rows render a visible chart within 5 seconds on a typical user laptop

**Constraints**: Client-only; no backend/data upload; browser Excel parsing; self-contained HTML export; offline-capable exported report; runtime dependencies bundled locally

**Scale/Scope**: Single-user local workbook workflow; one chart per uploaded workbook; no persistence, accounts, collaboration, or server deployment beyond static hosting

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Client-only execution: PASS. The plan uses only local file input, in-memory data,
  static assets, and downloaded HTML. No backend, telemetry, or workbook upload.
- Browser Excel parsing: PASS. SheetJS runs in the browser against the user's local
  XLSX file and selects the first worksheet containing the required columns.
- Simple readable code: PASS. Vanilla modules are separated by import, validation,
  chart rendering, export, and UI orchestration. Dependencies are limited to Vite,
  SheetJS, Plotly, and focused test tooling.
- Self-contained HTML export: PASS. Export generation embeds data, styles, Plotly
  runtime, and Plotly config in one HTML file with no CDN, remote font, remote
  image, remote script, or endpoint dependency.
- File format errors: PASS. Plan includes distinct file-format and content-format
  validation flows, invalid fixture coverage, and user-facing messages.

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
The module layout mirrors the feature workflow: workbook import and validation,
domain calculation, Plotly rendering, and self-contained HTML export.

## Complexity Tracking

No constitution violations or complexity exceptions are required.
