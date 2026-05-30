# Feature Specification: Flow Efficiency Dashboard

**Feature Branch**: `001-flow-efficiency-chart`

**Created**: 2026-05-29

**Status**: Draft

**Input**: User description: "Изменения уже реализованы в коде и работают. НЕ меняй код, НЕ запускай реализацию. Задача — привести spec.md в соответствие с тем, что уже сделано: продукт теперь мини-дашборд (несколько виджетов, экспорт всего дашборда в автономный HTML). Обнови существующую спецификацию и user stories, чтобы они точно описывали текущее поведение приложения. Только документация."

## Clarifications

### Session 2026-05-29

- Q: Which worksheet should be used when the workbook has multiple sheets? → A: Use the first sheet that contains `METRIC_MONTH`, `LEAD_DAYS_V1_FIRST`, and `CYCLE_DAYS_V1_FIRST`.
- Q: How should rows with zero or negative LeadTime be handled? → A: `LEAD_DAYS_V1_FIRST` must be greater than 0; zero or negative values are content errors.
- Q: How should the Moscow Exchange color palette be defined? → A: Use official Moscow Exchange brand colors sourced during planning.
- Q: How should duplicate `METRIC_MONTH` values be handled? → A: Duplicate `METRIC_MONTH` values are content errors.
- Q: What chart form should display Flow Efficiency? → A: A mini-dashboard with KPI widgets plus an interactive combined chart.

### Session 2026-05-30

- Q: What is the current product scope after implementation? → A: The product is a browser-only mini-dashboard that shows several Flow Efficiency widgets, an interactive Lead/Cycle/Flow chart, outlier insight, and exports the whole dashboard as one autonomous HTML file.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Upload Valid XLSX And View Dashboard (Priority: P1)

Пользователь загружает XLSX-файл с месячными значениями LeadTime и CycleTime,
после чего видит мини-дашборд Flow Efficiency: период отчёта, ключевые KPI,
диапазон эффективности, интерактивный график и, при необходимости, пояснение
по выбросу.

**Why this priority**: Это основной пользовательский сценарий: ценность продукта
заключается не только в построении графика, но и в быстром чтении состояния
потока через несколько виджетов на одном экране.

**Independent Test**: Можно загрузить валидный XLSX-файл с обязательными колонками
и несколькими месяцами, затем убедиться, что дашборд отображает период, средний
Flow Efficiency, средний Lead Time, средний Cycle Time, диапазон Flow Efficiency
и интерактивный график с теми же месяцами.

**Acceptance Scenarios**:

1. **Given** пользователь находится на форме загрузки, **When** он выбирает валидный XLSX-файл с колонками `METRIC_MONTH`, `LEAD_DAYS_V1_FIRST`, `CYCLE_DAYS_V1_FIRST`, **Then** приложение показывает мини-дашборд Flow Efficiency по данным файла.
2. **Given** валидный файл содержит несколько месяцев, **When** данные загружены, **Then** дашборд отображает период от первого до последнего месяца в хронологическом порядке.
3. **Given** данные успешно загружены, **When** пользователь просматривает верхние виджеты, **Then** он видит средний Flow Efficiency, средний Lead Time, средний Cycle Time и диапазон Flow Efficiency.
4. **Given** пользователь взаимодействует с графиком, **When** он наводит указатель или выбирает точку, **Then** он видит месяц, LeadTime, CycleTime и Flow Efficiency для выбранного периода.

---

### User Story 2 - Understand File Problems (Priority: P2)

Пользователь загружает неподходящий файл и получает понятное сообщение о том,
что именно не соответствует требованиям: формат файла или содержимое workbook.
После ошибки дашборд скрывается, экспорт недоступен, а пользователь может
исправить файл и загрузить его снова.

**Why this priority**: Ошибки входного файла ожидаемы и должны помогать
пользователю исправить файл, а не оставлять его с частичным или устаревшим
результатом.

**Independent Test**: Можно загрузить файл не-XLSX, XLSX без обязательных колонок,
XLSX с неправильными датами, нечисловыми значениями, отрицательными значениями
или дублями месяцев, затем проверить соответствующие сообщения об ошибке и
недоступность экспорта.

**Acceptance Scenarios**:

1. **Given** пользователь выбирает файл другого формата, **When** приложение проверяет файл, **Then** оно показывает ошибку формата файла, скрывает дашборд и не позволяет скачать HTML.
2. **Given** XLSX-файл не содержит одну или несколько обязательных колонок, **When** приложение проверяет содержимое, **Then** оно показывает ошибку содержимого файла с перечнем обязательных колонок.
3. **Given** обязательные колонки есть, но значения дат или чисел некорректны, **When** приложение проверяет строки, **Then** оно показывает ошибку содержимого файла с указанием проблемного типа данных или строки.
4. **Given** после ошибки пользователь выбирает исправленный валидный файл, **When** загрузка завершается успешно, **Then** приложение заменяет ошибку новым дашбордом и включает экспорт.

---

### User Story 3 - Review Outliers Without Distorting Averages (Priority: P3)

Пользователь видит, когда месяц даёт нерепрезентативный Flow Efficiency из-за
CycleTime выше LeadTime или значения Flow Efficiency выше 100%, и понимает, что
такой месяц помечен как выброс и исключён из средних значений дашборда.

**Why this priority**: Дашборд должен помогать интерпретировать данные, а не
только отображать расчёты; выбросы могут исказить средние показатели и привести
к неверным выводам.

**Independent Test**: Можно загрузить валидный XLSX-файл, где один месяц имеет
CycleTime больше LeadTime, затем проверить, что месяц помечен как выброс,
появляется поясняющий инсайт, а средние KPI рассчитываются без этого месяца.

**Acceptance Scenarios**:

1. **Given** валидные данные содержат месяц с Flow Efficiency выше 100%, **When** дашборд построен, **Then** этот месяц помечен как выброс на графике и не используется в средних KPI, если есть хотя бы один невыбросный месяц.
2. **Given** дашборд содержит выброс, **When** пользователь просматривает KPI среднего Flow Efficiency, **Then** он видит пояснение, какой месяц исключён из среднего.
3. **Given** дашборд содержит выброс, **When** пользователь просматривает блок пояснения, **Then** он видит месяц, CycleTime, LeadTime, значение Flow Efficiency и текстовое объяснение причины пометки.
4. **Given** все месяцы являются выбросами, **When** рассчитываются KPI, **Then** средние значения рассчитываются по всем доступным месяцам, чтобы дашборд оставался заполненным.

---

### User Story 4 - Download Offline Dashboard Result (Priority: P4)

Пользователь скачивает весь построенный мини-дашборд как один автономный HTML-файл:
заголовок, период, KPI-виджеты, интерактивный график, встроенные данные, стили и
пояснение по выбросу сохраняются вместе и открываются офлайн в современном
браузере.

**Why this priority**: Экспорт делает результат переносимым для отчётности,
архивации и отправки без исходного Excel-файла и без доступа к приложению.

**Independent Test**: После построения дашборда можно нажать «Скачать как HTML»,
открыть скачанный файл без доступа к сети и увидеть тот же отчётный дашборд со
встроенными данными и интерактивным графиком.

**Acceptance Scenarios**:

1. **Given** дашборд успешно построен, **When** пользователь нажимает «Скачать как HTML», **Then** приложение скачивает один `.html` файл со всем дашбордом и встроенными данными.
2. **Given** скачанный HTML-файл открыт без подключения к интернету, **When** пользователь просматривает файл в браузере, **Then** KPI, период, график и пояснение по выбросу отображаются без внешних ресурсов.
3. **Given** пользователь взаимодействует с графиком в скачанном HTML, **When** он наводит указатель на месяц, **Then** он видит месяц, LeadTime, CycleTime и Flow Efficiency для выбранного периода.
4. **Given** данные ещё не были успешно загружены, **When** пользователь хочет скачать HTML, **Then** скачивание недоступно или сопровождается понятным сообщением о необходимости сначала загрузить валидный файл.

---

### Edge Cases

- Загружен файл без расширения `.xlsx` или с расширением `.xlsx`, но с неподходящим внутренним форматом.
- XLSX-файл пустой, не содержит листов или ни один лист не содержит строк данных с обязательными колонками.
- В файле отсутствует одна или несколько колонок `METRIC_MONTH`, `LEAD_DAYS_V1_FIRST`, `CYCLE_DAYS_V1_FIRST`.
- В workbook несколько листов: используется первый лист, в котором найдены все обязательные колонки.
- `METRIC_MONTH` не является датой первого дня месяца, пустой или не может быть однозначно прочитан как дата.
- `METRIC_MONTH` указан как Excel-дата, ISO-подобная дата или дата в формате `dd.MM.yyyy`; валидным считается только первый день месяца.
- `LEAD_DAYS_V1_FIRST` пустой, нечисловой, равен нулю или отрицательный.
- `CYCLE_DAYS_V1_FIRST` пустой, нечисловой или отрицательный.
- Числовые значения могут быть переданы как числа или строки с точкой либо запятой в качестве десятичного разделителя.
- В файле есть лишние колонки: они не мешают загрузке, если обязательные колонки валидны.
- В файле есть дублирующиеся месяцы: пользователь получает ошибку содержимого, чтобы избежать неоднозначного дашборда.
- Flow Efficiency превышает 100% или CycleTime превышает LeadTime: строка принимается как валидная, месяц помечается как выброс и исключается из средних KPI, если есть невыбросные месяцы.
- После неуспешной загрузки предыдущий дашборд не должен оставаться видимым как актуальный результат.
- Скачанный HTML открывается офлайн без доступа к внешним ресурсам и без исходного XLSX-файла.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a file upload form that accepts a user-selected XLSX workbook.
- **FR-002**: System MUST reject files that are not valid XLSX workbooks and show a file format error.
- **FR-003**: System MUST validate that workbook content includes the required columns `METRIC_MONTH`, `LEAD_DAYS_V1_FIRST`, and `CYCLE_DAYS_V1_FIRST`.
- **FR-004**: System MUST use the first worksheet that contains all required columns when the workbook has multiple sheets.
- **FR-005**: System MUST validate that `METRIC_MONTH` contains the first day of a month for every data row.
- **FR-006**: System MUST validate that `LEAD_DAYS_V1_FIRST` contains numeric LeadTime values greater than 0 for every data row.
- **FR-007**: System MUST validate that `CYCLE_DAYS_V1_FIRST` contains numeric CycleTime values greater than or equal to 0 for every data row.
- **FR-008**: System MUST reject duplicate `METRIC_MONTH` values as workbook content errors.
- **FR-009**: System MUST distinguish user-facing errors for invalid file format and invalid file content.
- **FR-010**: System MUST parse valid workbook rows into monthly Flow Efficiency data sorted chronologically.
- **FR-011**: System MUST calculate Flow Efficiency for each row as `CycleTime / LeadTime * 100%`.
- **FR-012**: System MUST display a mini-dashboard after successful parsing, including report period, average Flow Efficiency, average Lead Time, average Cycle Time, Flow Efficiency range, and an interactive chart.
- **FR-013**: System MUST display an interactive combined chart with Flow Efficiency bars and Lead Time and Cycle Time lines using the Moscow Exchange visual palette.
- **FR-014**: System MUST show month, LeadTime, CycleTime, and Flow Efficiency values during chart interaction.
- **FR-015**: System MUST identify months where Flow Efficiency exceeds 100% or CycleTime exceeds LeadTime as outliers.
- **FR-016**: System MUST exclude identified outlier months from average KPI calculations when at least one non-outlier month exists.
- **FR-017**: System MUST show a visible explanation when an outlier is present, including the affected month, LeadTime, CycleTime, Flow Efficiency, and the reason the month is treated as нерепрезентативный.
- **FR-018**: System MUST provide a «Скачать как HTML» action only after a dashboard has been successfully generated.
- **FR-019**: System MUST export one autonomous `.html` file containing the whole dashboard: title, period, KPI widgets, chart, outlier explanation when present, styling, and parsed data.
- **FR-020**: System MUST ensure the exported HTML opens offline in a browser without runtime external dependencies or the original XLSX file.
- **FR-021**: System MUST process workbook data entirely in the browser without uploading it to a server.
- **FR-022**: System MUST preserve the user's original file locally and not modify it during validation or parsing.
- **FR-023**: System MUST hide or clear the dashboard after a failed upload so invalid data is not presented as the current result.
- **FR-024**: System MUST keep the export action disabled or unavailable until a valid dashboard is available.

### Key Entities *(include if feature involves data)*

- **Workbook Upload**: The user-selected XLSX file, including its file name, validation status, and any user-facing error category.
- **Workbook Sheet**: A worksheet within the workbook that may or may not contain the required metric columns.
- **Workbook Row**: One row of monthly source data containing `METRIC_MONTH`, LeadTime, and CycleTime.
- **Flow Efficiency Point**: A calculated monthly point with normalized month, display label, LeadTime, CycleTime, Flow Efficiency percentage, and outlier status.
- **Dashboard Metrics**: Aggregated values shown in KPI widgets: report period, average Flow Efficiency, average Lead Time, average Cycle Time, minimum Flow Efficiency, maximum Flow Efficiency, and outlier summary.
- **Dashboard View**: The generated on-screen report containing KPI widgets, chart, status, MOEX-styled presentation, and optional outlier insight.
- **HTML Export**: A downloaded single-file report containing the full dashboard, embedded data, styling, and interaction needed for offline viewing.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of valid XLSX files with up to 120 monthly rows produce a visible dashboard within 5 seconds after selection on a typical user laptop.
- **SC-002**: 100% of valid dashboard loads show the report period, four KPI widgets, and an interactive chart.
- **SC-003**: 100% of invalid file-format samples show a file format error, hide the dashboard, and keep export unavailable.
- **SC-004**: 100% of workbook-content validation samples show a content error that identifies the missing or invalid required field category.
- **SC-005**: 100% of valid samples with Flow Efficiency above 100% or CycleTime above LeadTime show an outlier indication and explanatory insight.
- **SC-006**: Users can download the generated dashboard HTML file in one action after a valid dashboard is displayed.
- **SC-007**: 100% of exported HTML samples open offline and display the same period, KPI values, months, and Flow Efficiency values as the source dashboard.
- **SC-008**: At least 90% of first-time users in a usability check can upload a valid file, inspect a KPI or graph value, understand whether an outlier is present, and download HTML without assistance.

## Assumptions

- The source sheet is the first worksheet that contains all required columns.
- The workbook has one header row containing the required column names exactly as specified.
- Dates in `METRIC_MONTH` may be stored as Excel dates or text dates, but each valid value represents the first calendar day of a month.
- Flow Efficiency is interpreted as `CycleTime / LeadTime * 100%` because LeadTime represents total elapsed time and CycleTime represents active cycle time.
- Extra columns are ignored when all required columns are present and valid.
- Duplicate months are treated as a content error to keep the dashboard unambiguous.
- A month with Flow Efficiency above 100% or CycleTime above LeadTime is valid source data but нерепрезентативен for average KPI calculations.
- The dashboard and exported HTML use Moscow Exchange visual styling as the product color language.
- The target user has a modern browser capable of selecting local files and opening downloaded HTML files.
