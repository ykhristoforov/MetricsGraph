# Research: Flow Efficiency Dashboard

## Decision: Vite + vanilla HTML/CSS/JS for the dashboard shell

**Rationale**: The product is one focused client workflow: upload XLSX, validate,
render a mini-dashboard, and export autonomous HTML. Vite provides a simple static
build and development server while vanilla modules keep the code path readable and
aligned with the constitution's simplicity principle.

**Alternatives considered**:
- React/Vue/Svelte: rejected because the current dashboard state is small and does
  not require framework-level component machinery.
- Plain static HTML without Vite: rejected because dependency bundling and test
  ergonomics are important for SheetJS, Plotly, and self-contained export.

## Decision: SheetJS `xlsx` for browser XLSX parsing

**Rationale**: SheetJS is a mature browser-capable parser for XLSX workbooks. It can
read a local `File`/`ArrayBuffer`, inspect worksheets, and convert rows into objects
for validation without server processing.

**Alternatives considered**:
- Server-side conversion: rejected by the constitution and privacy requirement.
- CSV-only import: rejected because the feature explicitly requires XLSX.
- Hand-written XLSX parsing: rejected as too complex and brittle for a zipped XML
  workbook format.

## Decision: Plotly.js for interactive dashboard chart rendering

**Rationale**: Plotly supports combined bar and scatter/line traces, hover labels,
dual axes, annotations, responsive browser rendering, and serializable
data/layout/config objects. This matches the implemented dashboard chart: Flow
Efficiency bars plus Lead Time and Cycle Time lines, with outlier annotations.

**Alternatives considered**:
- Chart.js: viable, but export would still need embedded runtime and custom offline
  assembly; Plotly's serialized graph model better fits one-file export.
- SVG/canvas from scratch: rejected because interaction, axes, annotations, and
  offline rendering would take longer and be riskier than using a proven chart
  library.

## Decision: Dashboard KPI layer above the chart

**Rationale**: The implemented product is a mini-dashboard, not just a chart. KPI
widgets provide immediate summary values: average Flow Efficiency, average Lead
Time, average Cycle Time, and Flow Efficiency range. This helps users read the
state of the flow without interpreting every point in the chart.

**Alternatives considered**:
- Chart-only report: rejected because it no longer matches the delivered product
  surface and makes common questions slower to answer.
- Large multi-page report: rejected because the current workflow is a compact
  local dashboard intended for one uploaded workbook.

## Decision: Outlier marking and KPI exclusion for нерепрезентативные months

**Rationale**: Months where Flow Efficiency exceeds 100% or CycleTime exceeds
LeadTime can distort averages. The implemented dashboard keeps those rows as valid
source data, marks them on the chart, explains the issue in an insight block, and
excludes them from average KPI calculations when at least one regular month exists.

**Alternatives considered**:
- Reject outlier rows as content errors: rejected because the values can represent
  real historical artifacts rather than malformed workbook data.
- Include outliers in averages unconditionally: rejected because it makes summary
  KPI widgets misleading.
- Hide outliers completely: rejected because users still need to see and explain
  the source data.

## Decision: Export as one generated HTML dashboard with embedded Plotly runtime

**Rationale**: The exported report must open offline in any modern browser. The
export generator inlines the parsed points, chart definition, dashboard KPI values,
styles, outlier insight, and the local Plotly bundle text into one HTML document.
The export MUST NOT reference CDN scripts, remote fonts, images, or endpoints.

**Alternatives considered**:
- Exporting a ZIP with assets: rejected because the requirement is one `.html` file.
- Referencing Plotly CDN: rejected because offline runtime and constitution require
  no external dependencies.
- Exporting a static image: rejected because the exported dashboard chart must
  remain interactive.

## Decision: Moscow Exchange visual palette as the product color language

**Rationale**: The dashboard uses a MOEX-styled visual language with red/white as
the brand basis plus supporting colors for Lead Time, Cycle Time, neutral text,
surface, and insight states. This keeps the dashboard visually aligned with the
requested Moscow Exchange palette while preserving readability of multiple metrics.

Sources:
- Official MOEX announcement: https://www.moex.com/n38997
- RBC report citing main colors red and white: https://www.rbc.ru/quote/news/article/61bc7f8c9a79477f8cbdfe8f

**Alternatives considered**:
- Use an approximate single-color red palette only: rejected because the dashboard
  needs distinguishable metric roles.
- Hard-code a third-party palette unrelated to MOEX: rejected because it would be
  difficult to justify against the product requirement.

## Decision: First worksheet containing required columns

**Rationale**: Workbooks may include cover or metadata sheets. Selecting the first
worksheet that contains all required columns keeps the UI simple while reducing
false content errors.

**Alternatives considered**:
- Always use the first worksheet: rejected because valid data could be on the next
  sheet.
- Ask the user to choose a worksheet: rejected for v1 because it adds an extra
  interaction not needed for the stated workflow.

## Decision: Validation-first import pipeline

**Rationale**: User-facing errors must clearly distinguish invalid file format from
invalid workbook content. The pipeline validates extension/internal workbook format
first, then worksheet/columns, then row values and uniqueness before rendering the
dashboard.

**Alternatives considered**:
- Best-effort partial parsing: rejected because partial dashboards can hide data
  quality problems.
- Skip invalid rows: rejected because the spec requires content errors and duplicate
  months to block ambiguous output.
