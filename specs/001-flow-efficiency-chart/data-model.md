# Data Model: Flow Efficiency Dashboard

## WorkbookUpload

Represents the file selected by the user.

Fields:
- `fileName`: Original local filename.
- `mimeType`: Browser-provided MIME type, if available.
- `sizeBytes`: Local file size.
- `status`: `idle | reading | invalid-format | invalid-content | parsed | exported`.
- `error`: Optional validation failure.

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

Represents one dashboard-ready monthly point.

Fields:
- `month`: Normalized month string `YYYY-MM-01`.
- `label`: Human-readable month label.
- `leadDays`: LeadTime value.
- `cycleDays`: CycleTime value.
- `flowEfficiencyPercent`: `cycleDays / leadDays * 100`.
- `isOutlier`: Whether the month is treated as нерепрезентативный for average KPI calculations.

Relationships:
- One `WorkbookRow` produces one `FlowEfficiencyPoint`.
- Points are sorted ascending by `month` before dashboard rendering and export.
- Points feed both KPI calculations and the interactive chart.

Validation and interpretation rules:
- `flowEfficiencyPercent` MAY exceed 100 and MUST be displayed as calculated.
- Values are not normalized or capped.
- A point is an outlier when Flow Efficiency exceeds 100% or CycleTime exceeds LeadTime.

## DashboardMetrics

Represents the aggregate values shown in dashboard widgets.

Fields:
- `period`: Display range from the first month to the last month.
- `avgFlow`: Average Flow Efficiency.
- `avgLead`: Average Lead Time.
- `avgCycle`: Average Cycle Time.
- `min`: Point with the minimum Flow Efficiency in the calculation basis.
- `max`: Point with the maximum Flow Efficiency in the calculation basis.
- `outliers`: Points marked as outliers.
- `excludedOutlierLabel`: Label of the first outlier excluded from average KPI calculations, if any.

Relationships:
- Calculated from `FlowEfficiencyPoint` values.
- Feeds the on-screen dashboard and exported HTML dashboard.

Calculation rules:
- If at least one non-outlier point exists, average and range widgets use only non-outlier points.
- If all points are outliers, widgets use all points so the dashboard remains populated.
- Outlier insight is shown when at least one outlier exists.

## ChartDefinition

Represents the serializable chart definition used in the app and export.

Fields:
- `data`: Chart traces for Flow Efficiency bars and Lead Time/Cycle Time lines.
- `layout`: Axes, colors, annotations, hover behavior, legend, and responsive layout.
- `config`: Interaction options needed by in-app and exported rendering.
- `meta`: Prepared chart points, including labels and outlier flags.

Validation rules:
- Chart MUST show months sorted ascending.
- Chart MUST show Flow Efficiency as bars on the percentage axis.
- Chart MUST show Lead Time and Cycle Time as lines on the days axis.
- Chart MUST expose month, LeadTime, CycleTime, and Flow Efficiency in interaction.
- Outlier months MUST be visibly annotated instead of silently removed from the chart context.

## DashboardView

Represents the generated report visible to the user.

Fields:
- `title`: Dashboard title.
- `subtitle`: Description plus reporting period.
- `brandMarker`: MOEX IT marker.
- `kpiWidgets`: Average Flow Efficiency, average Lead Time, average Cycle Time, and Flow Efficiency range.
- `chartDefinition`: Interactive chart configuration.
- `insight`: Optional outlier explanation.
- `exportReady`: Whether «Скачать как HTML» is available.

Validation rules:
- Dashboard appears only after valid workbook parsing.
- Dashboard is hidden or cleared after failed import.
- Export remains unavailable until a valid dashboard exists.

## HtmlExport

Represents the generated offline dashboard report.

Fields:
- `fileName`: Suggested `.html` download name.
- `html`: Full HTML document string.
- `embeddedData`: Flow Efficiency points embedded in the document.
- `embeddedChartDefinition`: Chart data/layout/config embedded in the document.
- `embeddedRuntime`: Chart runtime embedded in the document.
- `embeddedStyles`: Dashboard styles embedded in the document.
- `embeddedMetrics`: Dashboard KPI values derived from the embedded data.

Validation rules:
- Export MUST be one autonomous `.html` file.
- Export MUST contain the full dashboard, not only the chart.
- Export MUST NOT reference remote scripts, fonts, images, CDNs, or endpoints.
- Export MUST NOT depend on the original XLSX file.
- Export MUST open offline and display the same period, KPI values, months, and Flow Efficiency values as the source dashboard.

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
- A failed import leaves no stale dashboard visible as the current result.
