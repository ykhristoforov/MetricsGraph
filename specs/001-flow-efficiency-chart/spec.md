# Feature Specification: Flow Efficiency Chart

**Feature Branch**: `001-flow-efficiency-chart`

**Created**: 2026-05-29

**Status**: Draft

**Input**: User description: "Веб-приложение с формой: пользователь загружает файл (формат XLSX), приложение валидирует формат и показывает ошибку при несоответствии. Лист Excel файла должен содержать колонки METRIC_MONTH, LEAD_DAYS_V1_FIRST, CYCLE_DAYS_V1_FIRST. METRIC_MONTH содержит дату первого дня месяца. Остальные две колонки - это числовые значения LeadTime и CycleTime соответственно. После загрузки данные парсятся. В случае ошибки несоответствия формата файла, пользователю выводится сообщение об ошибке либо формата файла, либо формата содержимого файла. Строится интерактивный график Flow Efficiency по полученным данным. Должна использоваться цветовая гамма Московской Биржи. Есть кнопка «Скачать как HTML», которая выгружает один автономный .html файл с графиком и встроенными данными, открывающийся в любом браузере офлайн."

## Clarifications

### Session 2026-05-29

- Q: Which worksheet should be used when the workbook has multiple sheets? → A: Use the first sheet that contains `METRIC_MONTH`, `LEAD_DAYS_V1_FIRST`, and `CYCLE_DAYS_V1_FIRST`.
- Q: How should rows with zero or negative LeadTime be handled? → A: `LEAD_DAYS_V1_FIRST` must be greater than 0; zero or negative values are content errors.
- Q: How should the Moscow Exchange color palette be defined? → A: Use official Moscow Exchange brand colors sourced during planning.
- Q: How should duplicate `METRIC_MONTH` values be handled? → A: Duplicate `METRIC_MONTH` values are content errors.
- Q: What chart form should display Flow Efficiency? → A: Combined chart: bars plus trend line.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Upload Valid XLSX And View Flow Efficiency (Priority: P1)

Пользователь загружает XLSX-файл с месячными значениями LeadTime и CycleTime,
после чего видит интерактивный график Flow Efficiency по месяцам.

**Why this priority**: Это основной пользовательский сценарий: без успешной
загрузки и построения графика продукт не приносит ценности.

**Independent Test**: Можно загрузить валидный XLSX-файл с обязательными колонками
и несколькими месяцами, затем убедиться, что данные распознаны, месяцы отображены,
а значения Flow Efficiency рассчитаны для каждой строки.

**Acceptance Scenarios**:

1. **Given** пользователь находится на форме загрузки, **When** он выбирает валидный XLSX-файл с колонками `METRIC_MONTH`, `LEAD_DAYS_V1_FIRST`, `CYCLE_DAYS_V1_FIRST`, **Then** приложение показывает интерактивный комбинированный график Flow Efficiency по данным файла.
2. **Given** валидный файл содержит несколько месяцев, **When** данные загружены, **Then** график отображает каждый месяц в хронологическом порядке как столбец и точку линии тренда.
3. **Given** пользователь взаимодействует с графиком, **When** он наводит указатель или выбирает точку, **Then** он видит месяц, LeadTime, CycleTime и Flow Efficiency для выбранного периода.

---

### User Story 2 - Understand File Problems (Priority: P2)

Пользователь загружает неподходящий файл и получает понятное сообщение о том,
что именно не соответствует требованиям: формат файла или содержимое workbook.

**Why this priority**: Ошибки входного файла ожидаемы и должны помогать
пользователю исправить файл, а не оставлять его без результата.

**Independent Test**: Можно загрузить файл не-XLSX, XLSX без обязательных колонок,
XLSX с неправильными датами и XLSX с нечисловыми значениями, затем проверить
соответствующие сообщения об ошибке.

**Acceptance Scenarios**:

1. **Given** пользователь выбирает файл другого формата, **When** приложение проверяет файл, **Then** оно показывает ошибку формата файла и не строит график.
2. **Given** XLSX-файл не содержит одну или несколько обязательных колонок, **When** приложение проверяет содержимое, **Then** оно показывает ошибку содержимого файла с перечнем отсутствующих колонок.
3. **Given** обязательные колонки есть, но значения дат или чисел некорректны, **When** приложение проверяет строки, **Then** оно показывает ошибку содержимого файла с указанием проблемного типа данных.

---

### User Story 3 - Download Offline HTML Result (Priority: P3)

Пользователь скачивает построенный график как один автономный HTML-файл, который
можно открыть офлайн в любом современном браузере.

**Why this priority**: Экспорт делает результат переносимым для отчётности,
архивации и отправки без исходного Excel-файла.

**Independent Test**: После построения графика можно нажать «Скачать как HTML»,
открыть скачанный файл без доступа к сети и увидеть тот же график со встроенными
данными.

**Acceptance Scenarios**:

1. **Given** график успешно построен, **When** пользователь нажимает «Скачать как HTML», **Then** приложение скачивает один `.html` файл с графиком и встроенными данными.
2. **Given** скачанный HTML-файл открыт без подключения к интернету, **When** пользователь просматривает файл в браузере, **Then** график отображается и остаётся интерактивным.
3. **Given** данные ещё не были успешно загружены, **When** пользователь хочет скачать HTML, **Then** скачивание недоступно или сопровождается понятным сообщением о необходимости сначала загрузить валидный файл.

---

### Edge Cases

- Загружен файл без расширения `.xlsx` или с расширением `.xlsx`, но с неподходящим внутренним форматом.
- XLSX-файл пустой, не содержит листов или выбранный лист не содержит строк данных.
- В файле отсутствует одна или несколько колонок `METRIC_MONTH`, `LEAD_DAYS_V1_FIRST`, `CYCLE_DAYS_V1_FIRST`.
- `METRIC_MONTH` не является датой первого дня месяца, пустой или не может быть однозначно прочитан как дата.
- `LEAD_DAYS_V1_FIRST` пустой, нечисловой, равен нулю или отрицательный.
- `CYCLE_DAYS_V1_FIRST` пустой, нечисловой или отрицательный.
- В файле есть лишние колонки: они не мешают загрузке, если обязательные колонки валидны.
- В файле есть дублирующиеся месяцы: пользователь получает ошибку содержимого, чтобы избежать неоднозначного графика.
- Flow Efficiency превышает 100%: данные принимаются, но значение визуально отображается как фактический результат без скрытой нормализации.
- Скачанный HTML открывается офлайн без доступа к внешним ресурсам.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a file upload form that accepts a user-selected XLSX workbook.
- **FR-002**: System MUST reject files that are not valid XLSX workbooks and show a file format error.
- **FR-003**: System MUST validate that the workbook content includes the required columns `METRIC_MONTH`, `LEAD_DAYS_V1_FIRST`, and `CYCLE_DAYS_V1_FIRST`.
- **FR-003a**: System MUST use the first worksheet that contains all required columns when the workbook has multiple sheets.
- **FR-004**: System MUST validate that `METRIC_MONTH` contains the first day of a month for every data row.
- **FR-005**: System MUST validate that `LEAD_DAYS_V1_FIRST` contains numeric LeadTime values greater than 0 for every data row.
- **FR-006**: System MUST validate that `CYCLE_DAYS_V1_FIRST` contains numeric CycleTime values for every data row.
- **FR-006a**: System MUST reject duplicate `METRIC_MONTH` values as workbook content errors.
- **FR-007**: System MUST distinguish user-facing errors for invalid file format and invalid file content.
- **FR-008**: System MUST parse valid workbook rows into monthly Flow Efficiency data.
- **FR-009**: System MUST calculate Flow Efficiency for each row as `CycleTime / LeadTime * 100%`.
- **FR-010**: System MUST display an interactive combined Flow Efficiency graph with monthly bars and a trend line using official Moscow Exchange brand colors identified during planning.
- **FR-011**: System MUST show month, LeadTime, CycleTime, and Flow Efficiency values during graph interaction.
- **FR-012**: System MUST provide a «Скачать как HTML» action after a graph has been successfully generated.
- **FR-013**: System MUST export one autonomous `.html` file containing the graph and the parsed data.
- **FR-014**: System MUST ensure the exported HTML opens offline in a browser without runtime external dependencies.
- **FR-015**: System MUST process workbook data entirely in the browser without uploading it to a server.
- **FR-016**: System MUST preserve the user's original file locally and not modify it during validation or parsing.

### Key Entities *(include if feature involves data)*

- **Workbook Upload**: The user-selected XLSX file, including its file identity, validation status, and any user-facing error category.
- **Workbook Row**: One row of monthly source data containing `METRIC_MONTH`, LeadTime, and CycleTime.
- **Flow Efficiency Point**: A calculated graph point with month, LeadTime, CycleTime, and Flow Efficiency percentage.
- **HTML Export**: A downloaded single-file report containing the graph, embedded data, styling, and interaction needed for offline viewing.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of valid XLSX files with up to 120 monthly rows produce a visible graph within 5 seconds after selection on a typical user laptop.
- **SC-002**: 100% of invalid file-format samples show a file format error and do not show a partial graph.
- **SC-003**: 100% of workbook-content validation samples show a content error that identifies the missing or invalid required field category.
- **SC-004**: Users can download the generated HTML file in one action after a valid graph is displayed.
- **SC-005**: 100% of exported HTML samples open offline and display the same months and Flow Efficiency values as the source graph.
- **SC-006**: At least 90% of first-time users in a usability check can upload a valid file, inspect a graph value, and download HTML without assistance.

## Assumptions

- The source sheet is the first worksheet that contains all required columns.
- The workbook has one header row containing the required column names exactly as specified.
- Dates in `METRIC_MONTH` may be stored as Excel dates or text dates, but each valid value represents the first calendar day of a month.
- Flow Efficiency is interpreted as `CycleTime / LeadTime * 100%` because LeadTime represents total elapsed time and CycleTime represents active cycle time.
- Exact Moscow Exchange brand colors will be confirmed from an official source during planning.
- Extra columns are ignored when all required columns are present and valid.
- Duplicate months are treated as a content error to keep the graph unambiguous.
- The target user has a modern browser capable of selecting local files and opening downloaded HTML files.
