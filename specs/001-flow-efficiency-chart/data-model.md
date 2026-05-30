# Data Model: Flow Efficiency Chart

## WorkbookUpload

Represents the file selected by the user.

Fields:
- `fileName`: Original local filename.
- `mimeType`: Browser-provided MIME type, if available.
- `sizeBytes`: Local file size.
- `status`: `idle | reading | invalid-format | invalid-content | parsed | exported`.
- `error`: Optional `ValidationError`.

Validation rules:
- File MUST be a valid XLSX workbook.
- Original file is never modified or uploaded.

State transitions:
- `idle` -> `reading` when the user selects a file.
- `reading` -> `invalid-format` when the file cannot be read as XLSX.
- `reading` -> `invalid-content` when workbook content fails validation.
- `reading` -> `parsed` when rows become valid Flow Efficiency points.
- `parsed` -> `exported` after a successful HTML download generation.

## WorksheetCandidate

Represents one worksheet inspected during import.

Fields:
- `sheetName`: Workbook worksheet name.
- `headers`: Header names detected in the first row.
- `rows`: Raw row objects keyed by header.
- `hasRequiredColumns`: Whether all required columns are present.

Validation rules:
- The source worksheet is the first worksheet with `METRIC_MONTH`,
  `LEAD_DAYS_V1_FIRST`, and `CYCLE_DAYS_V1_FIRST`.
- If no worksheet contains all required columns, the workbook has a content error.

## WorkbookRow

Represents a validated source row from the selected worksheet.

Fields:
- `metricMonth`: Date value from `METRIC_MONTH`, normalized to `YYYY-MM-01`.
- `leadDays`: Numeric LeadTime from `LEAD_DAYS_V1_FIRST`.
- `cycleDays`: Numeric CycleTime from `CYCLE_DAYS_V1_FIRST`.
- `sourceRowNumber`: 1-based worksheet row number for error messages.

Validation rules:
- `metricMonth` MUST be readable as a date and MUST be the first day of a month.
- `leadDays` MUST be numeric and greater than 0.
- `cycleDays` MUST be numeric and greater than or equal to 0.
- `metricMonth` MUST be unique across all validated rows.
- Extra columns are ignored.

## FlowEfficiencyPoint

Represents one chart-ready monthly point.

Fields:
- `month`: Normalized month string `YYYY-MM-01`.
- `label`: Human-readable month label.
- `leadDays`: LeadTime value.
- `cycleDays`: CycleTime value.
- `flowEfficiencyPercent`: `cycleDays / leadDays * 100`.

Relationships:
- One `WorkbookRow` produces one `FlowEfficiencyPoint`.
- Points are sorted ascending by `month` before rendering and export.

Validation rules:
- `flowEfficiencyPercent` MAY exceed 100 and MUST be displayed as calculated.
- Values are not normalized or capped.

## ChartConfig

Represents the serializable Plotly chart definition.

Fields:
- `data`: Plotly traces for monthly bars and trend line.
- `layout`: Titles, axes, colors, hover behavior, and responsive layout.
- `config`: Interaction options needed by in-app and exported rendering.
- `palette`: Official MOEX brand color tokens used by the chart.

Validation rules:
- Chart MUST use monthly bars plus a trend line.
- Chart MUST expose month, LeadTime, CycleTime, and Flow Efficiency in interaction.
- Chart MUST use official Moscow Exchange brand colors sourced from official assets.

## HtmlExport

Represents the generated offline report.

Fields:
- `fileName`: Suggested `.html` download name.
- `html`: Full HTML document string.
- `embeddedData`: Flow Efficiency points embedded in the document.
- `embeddedChartConfig`: Plotly data/layout/config embedded in the document.
- `embeddedRuntime`: Plotly runtime embedded in the document.

Validation rules:
- Export MUST be one autonomous `.html` file.
- Export MUST NOT reference remote scripts, fonts, images, CDNs, or endpoints.
- Export MUST open offline and display the same points as the source chart.

## ValidationError

Represents an actionable user-facing validation failure.

Fields:
- `category`: `file-format | content-format`.
- `message`: User-facing message.
- `details`: Optional list of missing columns, invalid rows, or invalid value types.
- `sourceRowNumber`: Optional row number when the error is row-specific.

Validation rules:
- Raw stack traces are never shown to users.
- Format errors and content errors are distinguishable.
