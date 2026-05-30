# Tasks: Flow Efficiency Dashboard

**Input**: Design documents from `/specs/001-flow-efficiency-chart/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/ui-contract.md, quickstart.md

**Tests**: Test tasks are included because the quickstart and success criteria require fixture validation, browser upload checks, KPI/dashboard assertions, outlier verification, and offline export verification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. This task list documents the functionality already implemented in code.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- Static client app at repository root
- Source files under `src/`
- Tests under `tests/`
- Fixtures under `tests/fixtures/`
- Feature documentation under `specs/001-flow-efficiency-chart/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the Vite + vanilla JS static client, baseline UI shell, source modules, and test folders.

- [X] T001 Create Vite vanilla app package metadata and scripts in package.json
- [X] T002 Create Vite config for static client build in vite.config.js
- [X] T003 Create application shell markup with upload, error/status, dashboard, chart, KPI, insight, and export regions in index.html
- [X] T004 [P] Create base stylesheet with MOEX-ready CSS variables, responsive layout, dashboard cards, KPI widgets, chart area, insight block, and export controls in src/styles.css
- [X] T005 [P] Create source directory structure with modules in src/main.js, src/parsing/workbook-reader.js, src/parsing/workbook-validation.js, src/rendering/flow-efficiency-chart.js, src/rendering/moex-palette.js, src/export/html-export.js, src/lib/flow-efficiency.js, and src/lib/errors.js
- [X] T006 [P] Create test directory structure in tests/fixtures, tests/unit, and tests/integration

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared domain rules, dependencies, test tooling, fixture data, validation helpers, and export/runtime foundations required by all user stories.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T007 Install and configure dependencies for Vite, SheetJS xlsx, Plotly.js, Vitest, and Playwright in package.json
- [X] T008 [P] Define ValidationError categories and user-facing error helpers in src/lib/errors.js
- [X] T009 [P] Implement Flow Efficiency calculation, percentage formatting, and month sorting helpers in src/lib/flow-efficiency.js
- [X] T010 [P] Create fixture generation script for workbook samples in tests/fixtures/create-fixtures.mjs
- [X] T011 [P] Create valid workbook fixture with required columns, multiple months, and an outlier-capable month in tests/fixtures/valid-flow-efficiency.xlsx
- [X] T012 [P] Create invalid non-XLSX fixture in tests/fixtures/invalid-format.txt
- [X] T013 [P] Create missing columns workbook fixture in tests/fixtures/missing-columns.xlsx
- [X] T014 [P] Create invalid values workbook fixture with invalid month, zero LeadTime, negative LeadTime, non-numeric LeadTime, and negative CycleTime cases in tests/fixtures/invalid-values.xlsx
- [X] T015 [P] Create duplicate month workbook fixture in tests/fixtures/duplicate-month.xlsx
- [X] T016 [P] Add unit tests for Flow Efficiency calculation, values above 100%, and chronological sorting in tests/unit/flow-efficiency.test.js
- [X] T017 [P] Add unit test scaffolding for workbook validation rules in tests/unit/workbook-validation.test.js
- [X] T018 [P] Add unit test scaffolding for self-contained dashboard HTML export checks in tests/unit/html-export.test.js
- [X] T019 Configure test scripts so npm test runs unit tests and browser integration tests from package.json

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Upload Valid XLSX And View Dashboard (Priority: P1) MVP

**Goal**: User uploads a valid XLSX workbook and sees a Flow Efficiency mini-dashboard with report period, four KPI widgets, interactive Flow/Lead/Cycle chart, and export-ready state.

**Independent Test**: Upload `tests/fixtures/valid-flow-efficiency.xlsx`, confirm the dashboard appears, the period is shown, all four KPI widgets are populated, the chart shows Flow Efficiency bars plus Lead Time and Cycle Time lines, and hover shows month, LeadTime, CycleTime, and Flow Efficiency.

### Tests for User Story 1

- [X] T020 [P] [US1] Add workbook reader unit tests for local XLSX parsing and first matching worksheet selection in tests/unit/workbook-validation.test.js
- [X] T021 [P] [US1] Add integration test for valid upload, visible dashboard, title, enabled export button, and rendered chart layers in tests/integration/upload-and-chart.spec.js
- [X] T022 [P] [US1] Add UI contract assertions for dashboard period and four KPI widgets after valid upload in tests/integration/upload-and-chart.spec.js
- [X] T023 [P] [US1] Add chart assertions for Flow Efficiency bars plus Lead Time and Cycle Time lines with hover-ready data in tests/integration/upload-and-chart.spec.js

### Implementation for User Story 1

- [X] T024 [US1] Implement browser File to workbook parsing with SheetJS in src/parsing/workbook-reader.js
- [X] T025 [US1] Implement worksheet selection for first sheet containing METRIC_MONTH, LEAD_DAYS_V1_FIRST, and CYCLE_DAYS_V1_FIRST in src/parsing/workbook-validation.js
- [X] T026 [US1] Implement valid row normalization to FlowEfficiencyPoint objects in src/parsing/workbook-validation.js
- [X] T027 [US1] Implement MOEX palette module with dashboard and chart color tokens in src/rendering/moex-palette.js
- [X] T028 [US1] Implement chart definition with Flow Efficiency bars and Lead Time/Cycle Time lines in src/rendering/flow-efficiency-chart.js
- [X] T029 [US1] Implement dashboard metrics calculation for period, average Flow Efficiency, average Lead Time, average Cycle Time, and Flow Efficiency range in src/rendering/flow-efficiency-chart.js
- [X] T030 [US1] Implement upload event flow, parsed state, chart state, dashboard visibility, and status messaging in src/main.js
- [X] T031 [US1] Wire dashboard title, subtitle, KPI widgets, chart container, upload controls, and export control in index.html
- [X] T032 [US1] Style upload form, dashboard shell, KPI grid, chart area, and MOEX color usage in src/styles.css
- [X] T033 [US1] Run US1 validation using npm test and record any fixture or assertion updates in tests/integration/upload-and-chart.spec.js

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Understand File Problems (Priority: P2)

**Goal**: User receives clear file-format or content-format messages for invalid uploads, without stale dashboard data, partial charts, enabled export, or raw stack traces.

**Independent Test**: Upload invalid-format, missing-columns, invalid-values, and duplicate-month fixtures and confirm the expected user-facing error category/message, hidden dashboard, and unavailable export.

### Tests for User Story 2

- [X] T034 [P] [US2] Add unit tests for invalid file format handling in tests/unit/workbook-validation.test.js
- [X] T035 [P] [US2] Add unit tests for missing required columns, invalid first-day month, zero or negative LeadTime, negative CycleTime, non-numeric values, and duplicate months in tests/unit/workbook-validation.test.js
- [X] T036 [P] [US2] Add integration tests for invalid upload messages, hidden dashboard, cleared chart state, and disabled export in tests/integration/upload-and-chart.spec.js

### Implementation for User Story 2

- [X] T037 [US2] Implement invalid XLSX read handling and file-format ValidationError mapping in src/parsing/workbook-reader.js
- [X] T038 [US2] Implement missing column, empty worksheet, invalid date, invalid number, zero LeadTime, negative CycleTime, and duplicate month content validation in src/parsing/workbook-validation.js
- [X] T039 [US2] Implement localized user-facing error message rendering for file-format and content-format errors in src/main.js
- [X] T040 [US2] Ensure invalid uploads clear current points, chart definition, dashboard visibility, body data state, and export availability in src/main.js
- [X] T041 [US2] Add accessible error/status region styling and empty/error state behavior in src/styles.css
- [X] T042 [US2] Keep upload, error region, status region, dashboard, and export controls accessible in index.html
- [X] T043 [US2] Run US2 validation using npm test and record any fixture or assertion updates in tests/unit/workbook-validation.test.js and tests/integration/upload-and-chart.spec.js

**Checkpoint**: User Story 2 is independently functional and testable.

---

## Phase 5: User Story 3 - Review Outliers Without Distorting Averages (Priority: P3)

**Goal**: User sees нерепрезентативные months when Flow Efficiency exceeds 100% or CycleTime exceeds LeadTime, understands why they are outliers, and sees dashboard averages calculated without them when regular months exist.

**Independent Test**: Upload a valid workbook containing an outlier month, confirm the month is annotated on the chart, the average Flow Efficiency note names the excluded month, the insight block explains LeadTime/CycleTime/Flow Efficiency, and KPI averages are calculated from non-outlier months when available.

### Tests for User Story 3

- [X] T044 [P] [US3] Add unit tests for outlier detection when Flow Efficiency exceeds 100% or CycleTime exceeds LeadTime in tests/unit/flow-efficiency.test.js
- [X] T045 [P] [US3] Add unit tests for dashboard metrics excluding outliers when regular months exist and falling back to all months when every month is an outlier in tests/unit/flow-efficiency.test.js
- [X] T046 [P] [US3] Add integration assertions for visible outlier annotation, average KPI note, and insight block after valid upload in tests/integration/upload-and-chart.spec.js

### Implementation for User Story 3

- [X] T047 [US3] Implement outlier flag preparation for Flow Efficiency values above 100% or CycleTime greater than LeadTime in src/rendering/flow-efficiency-chart.js
- [X] T048 [US3] Implement dashboard metric basis selection that excludes outliers when at least one non-outlier month exists in src/rendering/flow-efficiency-chart.js
- [X] T049 [US3] Implement chart outlier presentation with hidden normal bar value and visible annotation in src/rendering/flow-efficiency-chart.js
- [X] T050 [US3] Implement average Flow Efficiency note, Flow Efficiency range labels, and outlier insight rendering in src/main.js
- [X] T051 [US3] Add insight block markup hook and dashboard KPI placeholders for outlier states in index.html
- [X] T052 [US3] Style outlier insight block and outlier-compatible dashboard states in src/styles.css
- [X] T053 [US3] Run US3 validation using npm test and quickstart outlier checks from specs/001-flow-efficiency-chart/quickstart.md

**Checkpoint**: User Story 3 is independently functional and testable.

---

## Phase 6: User Story 4 - Download Offline Dashboard Result (Priority: P4)

**Goal**: User downloads one autonomous HTML file containing the full dashboard: title, period, MOEX marker, KPI widgets, interactive chart, parsed data, styles, and outlier insight when present.

**Independent Test**: Generate a dashboard from the valid fixture, download HTML, open it with network disabled, and confirm the exported file displays the same title, period, KPI widgets, chart, outlier insight, months, and Flow Efficiency values as the in-app dashboard.

### Tests for User Story 4

- [X] T054 [P] [US4] Add unit tests for HTML export embedding dashboard title, period, KPI widgets, outlier insight, chart definition, runtime, data, and styles in tests/unit/html-export.test.js
- [X] T055 [P] [US4] Add unit tests ensuring exported dashboard HTML contains no CDN, remote font, remote image, remote script, endpoint, or original XLSX dependency in tests/unit/html-export.test.js
- [X] T056 [P] [US4] Add browser integration test for download, offline open, rendered KPI widgets, rendered chart layers, and matching dashboard values in tests/integration/offline-export.spec.js

### Implementation for User Story 4

- [X] T057 [US4] Implement serializable chart data, layout, config, and prepared metadata shared by app and export in src/rendering/flow-efficiency-chart.js
- [X] T058 [US4] Implement local Plotly runtime extraction or bundling strategy for export embedding in src/export/html-export.js
- [X] T059 [US4] Implement self-contained HTML document generation with embedded title, period, KPI widgets, parsed data, chart definition, Plotly runtime, styles, and outlier insight in src/export/html-export.js
- [X] T060 [US4] Implement remote-reference detection for exported dashboard HTML in src/export/html-export.js
- [X] T061 [US4] Implement «Скачать как HTML» button enablement, click handling, filename generation, and Blob download in src/main.js
- [X] T062 [US4] Add export button disabled and ready states in index.html
- [X] T063 [US4] Style export controls and exported dashboard shell CSS in src/styles.css
- [X] T064 [US4] Run US4 offline dashboard export validation using npm test and manual quickstart steps from specs/001-flow-efficiency-chart/quickstart.md

**Checkpoint**: User Story 4 is independently functional and testable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, accessibility, static build readiness, privacy checks, performance checks, and documentation cleanup across all stories.

- [X] T065 [P] Verify generated app has no backend, telemetry, or workbook data upload paths by reviewing src/main.js, src/parsing/workbook-reader.js, and vite.config.js
- [X] T066 [P] Verify workbook parsing preserves the original selected file locally and does not mutate source workbook data in src/parsing/workbook-reader.js and src/parsing/workbook-validation.js
- [X] T067 [P] Verify exported dashboard HTML has no runtime CDN, remote font, remote image, remote script, endpoint, or source XLSX dependency in tests/unit/html-export.test.js
- [X] T068 [P] Add or verify performance smoke coverage for valid XLSX data up to 120 monthly rows rendering a visible dashboard within 5 seconds in tests/integration/upload-and-chart.spec.js
- [X] T069 [P] Review keyboard focus order, labels, status announcements, error announcement behavior, dashboard labels, and export button accessibility in index.html and src/styles.css
- [X] T070 Run npm run build and confirm dist output is deployable as static files with no server requirement in dist/index.html
- [X] T071 Run full quickstart validation and update specs/001-flow-efficiency-chart/quickstart.md only if commands, fixture names, or dashboard validation steps changed
- [X] T072 Run full npm test suite and fix any remaining failures in src/ or tests/

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion; delivers MVP dashboard.
- **User Story 2 (Phase 4)**: Depends on Foundational completion and integrates with upload/dashboard cleanup from US1.
- **User Story 3 (Phase 5)**: Depends on US1 dashboard metrics and chart rendering.
- **User Story 4 (Phase 6)**: Depends on US1 dashboard data, US3 outlier state, and Foundational export checks.
- **Polish (Phase 7)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1**: Independent after Foundation; MVP scope.
- **US2**: Can be developed after Foundation, but final UI behavior depends on US1 dashboard state cleanup.
- **US3**: Requires US1 dashboard metrics and chart rendering before outlier behavior can be completed.
- **US4**: Requires US1 dashboard content and US3 outlier insight before full-dashboard export can be completed.

### Within Each User Story

- Tests are written before implementation tasks in each story phase.
- Domain helpers before parsing/rendering/export integration.
- Core modules before UI wiring.
- Story validation before moving to the next priority.

---

## Parallel Opportunities

- T004, T005, and T006 can run in parallel after T001-T003 are understood.
- T008-T018 can run in parallel after dependencies and folders exist.
- US1 test tasks T020-T023 can run in parallel.
- US2 test tasks T034-T036 can run in parallel.
- US3 test tasks T044-T046 can run in parallel.
- US4 test tasks T054-T056 can run in parallel.
- Polish checks T065-T069 can run in parallel after all user stories are implemented.

## Parallel Example: User Story 1

```bash
Task: "T020 [P] [US1] Add workbook reader unit tests for local XLSX parsing and first matching worksheet selection in tests/unit/workbook-validation.test.js"
Task: "T021 [P] [US1] Add integration test for valid upload, visible dashboard, title, enabled export button, and rendered chart layers in tests/integration/upload-and-chart.spec.js"
Task: "T022 [P] [US1] Add UI contract assertions for dashboard period and four KPI widgets after valid upload in tests/integration/upload-and-chart.spec.js"
Task: "T023 [P] [US1] Add chart assertions for Flow Efficiency bars plus Lead Time and Cycle Time lines with hover-ready data in tests/integration/upload-and-chart.spec.js"
```

## Parallel Example: User Story 2

```bash
Task: "T034 [P] [US2] Add unit tests for invalid file format handling in tests/unit/workbook-validation.test.js"
Task: "T035 [P] [US2] Add unit tests for missing required columns, invalid first-day month, zero or negative LeadTime, negative CycleTime, non-numeric values, and duplicate months in tests/unit/workbook-validation.test.js"
Task: "T036 [P] [US2] Add integration tests for invalid upload messages, hidden dashboard, cleared chart state, and disabled export in tests/integration/upload-and-chart.spec.js"
```

## Parallel Example: User Story 3

```bash
Task: "T044 [P] [US3] Add unit tests for outlier detection when Flow Efficiency exceeds 100% or CycleTime exceeds LeadTime in tests/unit/flow-efficiency.test.js"
Task: "T045 [P] [US3] Add unit tests for dashboard metrics excluding outliers when regular months exist and falling back to all months when every month is an outlier in tests/unit/flow-efficiency.test.js"
Task: "T046 [P] [US3] Add integration assertions for visible outlier annotation, average KPI note, and insight block after valid upload in tests/integration/upload-and-chart.spec.js"
```

## Parallel Example: User Story 4

```bash
Task: "T054 [P] [US4] Add unit tests for HTML export embedding dashboard title, period, KPI widgets, outlier insight, chart definition, runtime, data, and styles in tests/unit/html-export.test.js"
Task: "T055 [P] [US4] Add unit tests ensuring exported dashboard HTML contains no CDN, remote font, remote image, remote script, endpoint, or original XLSX dependency in tests/unit/html-export.test.js"
Task: "T056 [P] [US4] Add browser integration test for download, offline open, rendered KPI widgets, rendered chart layers, and matching dashboard values in tests/integration/offline-export.spec.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate upload of `tests/fixtures/valid-flow-efficiency.xlsx` renders the dashboard with period, four KPI widgets, and Flow/Lead/Cycle chart.

### Incremental Delivery

1. US1 delivers the valid upload and dashboard MVP.
2. US2 hardens file and content errors without changing the happy path.
3. US3 adds outlier interpretation, outlier-safe averages, chart annotation, and insight text.
4. US4 adds offline HTML export using the full dashboard state and chart config.
5. Polish verifies static build, accessibility, performance, privacy, and constitution constraints.

### Validation Gates

- No user story is complete until its tests pass and its independent test criteria are manually reproducible.
- The feature is complete only when `npm test`, `npm run build`, and the quickstart offline dashboard export flow pass.

---

## Notes

- Keep all workbook parsing and generated exports client-side.
- Do not add a backend, API route, telemetry upload, runtime CDN, remote font, or remote image.
- Use Moscow Exchange visual styling in `src/rendering/moex-palette.js` and `src/styles.css`.
- Exported HTML must embed the whole dashboard: title, period, KPI widgets, chart definition, Plotly runtime, parsed data, styles, and outlier insight when present.
- This file is synchronized to the already implemented code; code changes are out of scope for this documentation update.
