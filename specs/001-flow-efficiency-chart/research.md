# Research: Flow Efficiency Chart

## Decision: Vite + vanilla HTML/CSS/JS for the app shell

**Rationale**: The feature needs one focused client workflow: upload XLSX, validate,
render a chart, and export HTML. Vite provides a simple static build and development
server while vanilla modules keep the code path readable and aligned with the
constitution's simplicity principle.

**Alternatives considered**:
- React/Vue/Svelte: rejected because the current UI does not require component state
  machinery and would add framework concepts without enough value.
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

## Decision: Plotly.js for interactive chart rendering

**Rationale**: Plotly supports combined bar and scatter/line traces, hover labels,
offline rendering, and serializable data/layout/config objects. This matches the
interactive Flow Efficiency chart and export requirements.

**Alternatives considered**:
- Chart.js: viable, but export would still need embedded runtime and custom offline
  assembly; Plotly's serialized graph model better fits one-file export.
- SVG/canvas from scratch: rejected because interaction and accessibility behavior
  would take longer and be riskier than using a proven chart library.

## Decision: Export as one generated HTML document with embedded Plotly runtime

**Rationale**: The exported report must open offline in any modern browser. The
export generator will inline the parsed Flow Efficiency data, chart layout, graph
config, CSS, and the local Plotly bundle text into one HTML document. The export
MUST NOT reference CDN scripts, remote fonts, images, or endpoints.

**Alternatives considered**:
- Exporting a ZIP with assets: rejected because the requirement is one `.html` file.
- Referencing Plotly CDN: rejected because offline runtime and constitution require
  no external dependencies.
- Exporting a static image: rejected because the exported graph must remain
  interactive.

## Decision: Official Moscow Exchange color basis

**Rationale**: The spec requires official Moscow Exchange colors. The official MOEX
brand announcement states that Moscow Exchange retains red as the basis of the
brand, and external reporting of the same announcement identifies the main colors
as red and white. Planning will treat red/white as the required brand basis, and
implementation must source exact HEX values from official MOEX logo/brand assets
available at implementation time rather than inventing approximate colors.

Sources:
- Official MOEX announcement: https://www.moex.com/n38997
- RBC report citing main colors red and white: https://www.rbc.ru/quote/news/article/61bc7f8c9a79477f8cbdfe8f

**Alternatives considered**:
- Use an approximate MOEX-like palette: rejected because the clarification requires
  official colors.
- Hard-code a third-party palette: rejected because it would be difficult to verify
  against an official source.

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
invalid workbook content. The pipeline will validate extension/internal workbook
format first, then worksheet/columns, then row values and uniqueness before charting.

**Alternatives considered**:
- Best-effort partial parsing: rejected because partial charts can hide data quality
  problems.
- Skip invalid rows: rejected because the spec requires content errors and duplicate
  months to block ambiguous output.
