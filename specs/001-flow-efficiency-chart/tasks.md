# Tasks: Flow Efficiency Chart

**Input**: Design documents from `/specs/001-flow-efficiency-chart/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/ui-contract.md, quickstart.md

**Tests**: Test tasks are included because the quickstart and success criteria require fixture validation, browser upload checks, and offline export verification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Static client app at repository root
- Source files under `src/`
- Tests under `tests/`
- Fixtures under `tests/fixtures/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the Vite + vanilla JS static client and baseline project files.

- [X] T001 Create Vite vanilla app package metadata and scripts in package.json
- [X] T002 Create Vite config for static client build in vite.config.js
- [X] T003 Create application shell markup with upload, error, chart, and export regions in index.html
- [X] T004 [P] Create base stylesheet with MOEX-ready CSS variables and responsive layout in src/styles.css
- [X] T005 [P] Create source directory structure with placeholder modules in src/main.js, src/parsing/workbook-reader.js, src/parsing/workbook-validation.js, src/rendering/flow-efficiency-chart.js, src/rendering/moex-palette.js, src/export/html-export.js, src/lib/flow-efficiency.js, and src/lib/errors.js
- [X] T006 [P] Create test directory structure in tests/fixtures, tests/unit, and tests/integration

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared domain rules, dependencies, test tooling, and fixture data required by all user stories.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T007 Install and configure dependencies for Vite, SheetJS xlsx, Plotly.js, unit tests, and browser integration tests in package.json
- [X] T008 [P] Define ValidationError categories and user-facing error helpers in src/lib/errors.js
- [X] T009 [P] Implement Flow Efficiency calculation and month sorting helpers in src/lib/flow-efficiency.js
- [X] T010 [P] Create valid workbook fixture with required columns and multiple months in tests/fixtures/valid-flow-efficiency.xlsx
- [X] T011 [P] Create invalid non-XLSX fixture in tests/fixtures/invalid-format.txt
- [X] T012 [P] Create missing columns workbook fixture in tests/fixtures/missing-columns.xlsx
- [X] T013 [P] Create invalid values workbook fixture with invalid month, zero LeadTime, negative LeadTime, non-numeric LeadTime, and negative CycleTime cases in tests/fixtures/invalid-values.xlsx
- [X] T014 [P] Create duplicate month workbook fixture in tests/fixtures/duplicate-month.xlsx
- [X] T015 [P] Add unit tests for Flow Efficiency calculation, >100% display values, and chronological sorting in tests/unit/flow-efficiency.test.js
- [X] T016 [P] Add unit test scaffolding for workbook validation rules in tests/unit/workbook-validation.test.js
- [X] T017 [P] Add unit test scaffolding for self-contained HTML export checks in tests/unit/html-export.test.js
- [X] T018 Configure test scripts so npm test runs unit tests and browser integration tests from package.json

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Upload Valid XLSX And View Flow Efficiency (Priority: P1) MVP

**Goal**: User uploads a valid XLSX workbook and sees an interactive combined Flow Efficiency chart by month.

**Independent Test**: Upload `tests/fixtures/valid-flow-efficiency.xlsx`, confirm months render chronologically as bars plus trend line, and hover shows month, LeadTime, CycleTime, and Flow Efficiency.

### Tests for User Story 1

- [X] T019 [P] [US1] Add workbook reader unit tests for local XLSX parsing and first matching worksheet selection in tests/unit/workbook-validation.test.js
- [X] T020 [P] [US1] Add chart integration test for valid upload, chronological bars, trend line, and hover details in tests/integration/upload-and-chart.spec.js
- [X] T021 [P] [US1] Add UI contract assertions for enabled chart state after valid upload in tests/integration/upload-and-chart.spec.js

### Implementation for User Story 1

- [X] T022 [US1] Implement browser File to workbook parsing with SheetJS in src/parsing/workbook-reader.js
- [X] T023 [US1] Implement worksheet selection for first sheet containing METRIC_MONTH, LEAD_DAYS_V1_FIRST, and CYCLE_DAYS_V1_FIRST in src/parsing/workbook-validation.js
- [X] T024 [US1] Implement valid row normalization to FlowEfficiencyPoint objects in src/parsing/workbook-validation.js
- [X] T025 [US1] Implement MOEX palette module with officially sourced color tokens and source note in src/rendering/moex-palette.js
- [X] T026 [US1] Implement Plotly combined bar plus trend-line chart rendering in src/rendering/flow-efficiency-chart.js
- [X] T027 [US1] Implement upload event flow, parsed state, chart state, and hover-ready data wiring in src/main.js
- [X] T028 [US1] Connect chart container, upload controls, and primary UI states in index.html
- [X] T029 [US1] Style upload form, chart area, and MOEX color usage in src/styles.css
- [X] T030 [US1] Run US1 validation using npm test and record any fixture or assertion updates in tests/integration/upload-and-chart.spec.js

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Understand File Problems (Priority: P2)

**Goal**: User receives clear file-format or content-format messages for invalid uploads, without partial charts or raw stack traces.

**Independent Test**: Upload invalid-format, missing-columns, invalid-values, and duplicate-month fixtures and confirm the expected user-facing error category and message.

### Tests for User Story 2

- [X] T031 [P] [US2] Add unit tests for invalid file format handling in tests/unit/workbook-validation.test.js
- [X] T032 [P] [US2] Add unit tests for missing required columns, invalid first-day month, zero or negative LeadTime, negative CycleTime, non-numeric values, and duplicate months in tests/unit/workbook-validation.test.js
- [X] T033 [P] [US2] Add integration tests for invalid upload messages and no partial chart rendering in tests/integration/upload-and-chart.spec.js

### Implementation for User Story 2

- [X] T034 [US2] Implement invalid XLSX read handling and file-format ValidationError mapping in src/parsing/workbook-reader.js
- [X] T035 [US2] Implement missing column, empty worksheet, invalid date, invalid number, zero LeadTime, negative CycleTime, and duplicate month content validation in src/parsing/workbook-validation.js
- [X] T036 [US2] Implement localized user-facing error message rendering for file-format and content-format errors in src/main.js
- [X] T037 [US2] Add accessible error region styling and empty/error state behavior in src/styles.css
- [X] T038 [US2] Ensure invalid uploads clear chart state and keep export unavailable in src/main.js
- [X] T039 [US2] Run US2 validation using npm test and record any fixture or assertion updates in tests/unit/workbook-validation.test.js

**Checkpoint**: User Story 2 is independently functional and testable.

---

## Phase 5: User Story 3 - Download Offline HTML Result (Priority: P3)

**Goal**: User downloads one autonomous HTML file that opens offline and displays the same interactive chart and data.

**Independent Test**: Generate a graph from the valid fixture, download HTML, open it with network disabled, and confirm the chart renders with matching months and Flow Efficiency values.

### Tests for User Story 3

- [X] T040 [P] [US3] Add unit tests for HTML export embedding Plotly runtime, data, layout, config, and styles in tests/unit/html-export.test.js
- [X] T041 [P] [US3] Add unit tests ensuring exported HTML contains no CDN, remote font, remote image, remote script, endpoint, or original XLSX dependency in tests/unit/html-export.test.js
- [X] T042 [P] [US3] Add browser integration test for download, offline open, and matching chart values in tests/integration/offline-export.spec.js

### Implementation for User Story 3

- [X] T043 [US3] Implement serializable Plotly data, layout, and config generation shared by app and export in src/rendering/flow-efficiency-chart.js
- [X] T044 [US3] Implement local Plotly runtime extraction or bundling strategy for export embedding in src/export/html-export.js
- [X] T045 [US3] Implement self-contained HTML document generation with embedded data, Plotly runtime, config, and styles in src/export/html-export.js
- [X] T046 [US3] Implement «Скачать как HTML» button enablement, click handling, filename generation, and Blob download in src/main.js
- [X] T047 [US3] Add export button disabled and ready states in index.html
- [X] T048 [US3] Style export controls and exported report shell CSS in src/styles.css
- [X] T049 [US3] Run US3 offline export validation using npm test and manual quickstart steps from specs/001-flow-efficiency-chart/quickstart.md

**Checkpoint**: User Story 3 is independently functional and testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, accessibility, static build readiness, and documentation cleanup across all stories.

- [X] T050 [P] Verify generated app has no backend, telemetry, or workbook data upload paths by reviewing src/main.js, src/parsing/workbook-reader.js, and vite.config.js
- [X] T051 [P] Verify exported HTML has no runtime CDN, remote font, remote image, remote script, or endpoint references in tests/unit/html-export.test.js
- [X] T052 [P] Add performance smoke test for valid XLSX with up to 120 monthly rows rendering within 5 seconds in tests/integration/upload-and-chart.spec.js
- [X] T053 [P] Review keyboard focus order, labels, and error announcement behavior in index.html and src/styles.css
- [X] T054 Run npm run build and confirm dist output is deployable as static files with no server requirement
- [X] T055 Run full quickstart validation and update specs/001-flow-efficiency-chart/quickstart.md only if commands or fixture names changed
- [X] T056 Run full npm test suite and fix any remaining failures in src/ or tests/

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion; delivers MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational completion and integrates with upload/chart state from US1.
- **User Story 3 (Phase 5)**: Depends on US1 chart data/config and Foundational export checks.
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1**: Independent after Foundation; MVP scope.
- **US2**: Can be developed after Foundation, but final UI behavior depends on US1 chart state cleanup.
- **US3**: Requires US1 chart data/config generation before export can be completed.

### Within Each User Story

- Tests are written before implementation tasks in each story phase.
- Domain helpers before parsing/rendering/export integration.
- Core modules before UI wiring.
- Story validation before moving to the next priority.

---

## Parallel Opportunities

- T004, T005, and T006 can run in parallel after T001-T003 are understood.
- T008-T017 can run in parallel after dependencies and folders exist.
- US1 test tasks T019-T021 can run in parallel.
- US2 test tasks T031-T033 can run in parallel.
- US3 test tasks T040-T042 can run in parallel.
- Polish checks T050-T053 can run in parallel after all user stories are implemented.

## Parallel Example: User Story 1

```bash
Task: "T019 [P] [US1] Add workbook reader unit tests for local XLSX parsing and first matching worksheet selection in tests/unit/workbook-validation.test.js"
Task: "T020 [P] [US1] Add chart integration test for valid upload, chronological bars, trend line, and hover details in tests/integration/upload-and-chart.spec.js"
Task: "T021 [P] [US1] Add UI contract assertions for enabled chart state after valid upload in tests/integration/upload-and-chart.spec.js"
```

## Parallel Example: User Story 2

```bash
Task: "T031 [P] [US2] Add unit tests for invalid file format handling in tests/unit/workbook-validation.test.js"
Task: "T032 [P] [US2] Add unit tests for missing required columns, invalid first-day month, zero or negative LeadTime, negative CycleTime, non-numeric values, and duplicate months in tests/unit/workbook-validation.test.js"
Task: "T033 [P] [US2] Add integration tests for invalid upload messages and no partial chart rendering in tests/integration/upload-and-chart.spec.js"
```

## Parallel Example: User Story 3

```bash
Task: "T040 [P] [US3] Add unit tests for HTML export embedding Plotly runtime, data, layout, config, and styles in tests/unit/html-export.test.js"
Task: "T041 [P] [US3] Add unit tests ensuring exported HTML contains no CDN, remote font, remote image, remote script, endpoint, or original XLSX dependency in tests/unit/html-export.test.js"
Task: "T042 [P] [US3] Add browser integration test for download, offline open, and matching chart values in tests/integration/offline-export.spec.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate upload of `tests/fixtures/valid-flow-efficiency.xlsx` renders the combined chart.

### Incremental Delivery

1. US1 delivers the valid upload and chart MVP.
2. US2 hardens file and content errors without changing the happy path.
3. US3 adds offline HTML export using the same parsed data and chart config.
4. Polish verifies static build, accessibility, performance, and constitution constraints.

### Validation Gates

- No user story is complete until its tests pass and its independent test criteria are manually reproducible.
- The feature is complete only when `npm test`, `npm run build`, and the quickstart offline export flow pass.

---

## Notes

- Keep all workbook parsing and generated exports client-side.
- Do not add a backend, API route, telemetry upload, runtime CDN, remote font, or remote image.
- Use official MOEX brand color tokens in `src/rendering/moex-palette.js`; document the official source in code comments or adjacent metadata.
- Exported HTML must embed Plotly, parsed data, config, and styles in one file.
