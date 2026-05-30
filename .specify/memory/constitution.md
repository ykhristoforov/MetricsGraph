<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- Template principle 1 -> I. Client-Only Execution
- Template principle 2 -> II. Browser Excel Parsing
- Template principle 3 -> III. Simple, Readable Code
- Template principle 4 -> IV. Self-Contained HTML Export
- Template principle 5 -> V. File Format Error Handling
Added sections:
- Project Constraints
- Development Workflow
Removed sections:
- None
Templates requiring updates:
- UPDATED .specify/templates/plan-template.md
- UPDATED .specify/templates/spec-template.md
- UPDATED .specify/templates/tasks-template.md
- REVIEWED .specify/templates/commands/*.md (no command templates present)
- REVIEWED AGENTS.md (no principle-specific update required)
Follow-up TODOs:
- None
-->
# MetricsGraph Constitution

## Core Principles

### I. Client-Only Execution
All user data MUST remain in the browser runtime. The application MUST NOT include
backend services, server-side processing, telemetry uploads, analytics beacons, or
network calls that transmit workbook data, derived metrics, chart state, or export
content. Any future network capability MUST be disabled by default and justified by
an approved constitution amendment.

Rationale: MetricsGraph handles user-provided Excel files, so privacy and local
control are product requirements rather than deployment preferences.

### II. Browser Excel Parsing
Excel files MUST be parsed in the browser. Parsing logic MUST operate on the local
file selected by the user and MUST NOT require upload, remote conversion, or server
pre-processing. Supported workbook formats, worksheet selection behavior, and data
shape assumptions MUST be explicit in feature specifications.

Rationale: Local parsing makes the privacy guarantee testable and keeps the product
usable as a static client application.

### III. Simple, Readable Code
Code MUST favor direct, understandable implementations over speculative abstraction.
Modules MUST have clear responsibilities, readable names, and minimal hidden state.
New dependencies MUST be justified by concrete value for Excel parsing, rendering,
export, testing, or build ergonomics.

Rationale: The project is most maintainable when the data flow from workbook input
to graph output can be inspected without chasing unnecessary framework layers.

### IV. Self-Contained HTML Export
Exported results MUST be autonomous HTML documents that run without runtime external
dependencies. Each export MUST embed the data, styles, scripts, and rendering assets
needed to reopen the result locally. Export generation MUST NOT reference CDNs,
remote fonts, remote scripts, remote images, or server endpoints at runtime.

Rationale: Users must be able to share or archive the generated result as a single
portable artifact without relying on this project, a server, or third-party hosts.

### V. File Format Error Handling
The application MUST detect and report invalid, unsupported, encrypted, malformed,
or structurally unexpected Excel files without crashing or exposing raw stack traces
to users. Error messages MUST identify the actionable problem where possible and
preserve the original file locally.

Rationale: Workbook input is user-controlled, so robust format handling is part of
the core user experience.

## Project Constraints

MetricsGraph MUST be deliverable as a static client application. Runtime behavior
MUST NOT depend on a backend, database, server session, server-hosted assets, or
runtime package registry access. Build-time tooling MAY use external packages, but
all runtime dependencies needed by the shipped app and exported HTML MUST be bundled
locally.

Plans and specifications MUST document privacy-sensitive flows explicitly: file
selection, workbook parsing, derived data storage, graph rendering, and export.
Any proposed dependency, browser API, worker, or asset pipeline MUST preserve the
client-only and self-contained export guarantees.

## Development Workflow

Every feature plan MUST pass the Constitution Check before research and again after
design. The check MUST confirm there is no backend requirement, Excel parsing occurs
in the browser, code remains simple enough for direct review, exported HTML is
self-contained at runtime, and file format failures have user-facing handling.

Tasks MUST include validation work for the principles they touch. Features that
modify import logic MUST include invalid-file scenarios. Features that modify export
logic MUST include a self-contained HTML verification. Features that add dependencies
MUST record why the dependency is necessary and how it is bundled for runtime use.

## Governance

This constitution supersedes conflicting plans, templates, implementation choices,
and informal practices. Amendments require an explicit update to this document, a
Sync Impact Report, and updates to affected Spec Kit templates or runtime guidance.

Versioning follows semantic versioning:
MAJOR for removing or redefining a principle in a backward-incompatible way, MINOR
for adding a principle or materially expanding governance, and PATCH for wording
clarifications that do not change required behavior.

Compliance review is required during planning, task generation, implementation, and
review. Any violation MUST be documented in the plan's Complexity Tracking section
with a reason, rejected simpler alternative, and mitigation. Unjustified violations
block implementation.

**Version**: 1.0.0 | **Ratified**: 2026-05-29 | **Last Amended**: 2026-05-29
