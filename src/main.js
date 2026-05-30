import './styles.css';
import { readWorkbookFromFile } from './parsing/workbook-reader.js';
import { parseWorkbookToPoints } from './parsing/workbook-validation.js';
import { formatUserError } from './lib/errors.js';
import {
  calculateDashboardMetrics,
  renderFlowEfficiencyChart
} from './rendering/flow-efficiency-chart.js';
import { buildExportHtml, downloadHtml, EXPORT_STYLES } from './export/html-export.js';

const workbookInput = document.querySelector('#workbookInput');
const exportButton = document.querySelector('#exportButton');
const errorRegion = document.querySelector('#errorRegion');
const statusRegion = document.querySelector('#statusRegion');
const fileName = document.querySelector('#fileName');
const chart = document.querySelector('#chart');
const dashboard = document.querySelector('#dashboard');
const reportSubtitle = document.querySelector('#reportSubtitle');
const avgFlow = document.querySelector('#avgFlow');
const avgFlowNote = document.querySelector('#avgFlowNote');
const avgLead = document.querySelector('#avgLead');
const avgCycle = document.querySelector('#avgCycle');
const flowRange = document.querySelector('#flowRange');
const flowRangeNote = document.querySelector('#flowRangeNote');
const insightBox = document.querySelector('#insightBox');

let currentPoints = [];
let currentChartDefinition = null;

workbookInput.addEventListener('change', async (event) => {
  const [file] = event.target.files;
  if (!file) {
    return;
  }

  fileName.textContent = file.name;
  setError('');
  setStatus('Читаем файл...');
  setExportReady(false);
  clearChart();

  try {
    const workbook = await readWorkbookFromFile(file);
    currentPoints = parseWorkbookToPoints(workbook);
    renderDashboardSummary(currentPoints);
    dashboard.hidden = false;
    document.body.classList.add('has-data');
    currentChartDefinition = await renderFlowEfficiencyChart(chart, currentPoints);
    chart.classList.remove('chart-empty');
    setStatus(`Готово: загружено ${currentPoints.length} месяцев.`);
    setExportReady(true);
  } catch (error) {
    currentPoints = [];
    currentChartDefinition = null;
    setError(formatUserError(error));
    setStatus('Исправьте файл и загрузите его снова.');
    setExportReady(false);
    clearChart();
    dashboard.hidden = true;
    document.body.classList.remove('has-data');
  }
});

exportButton.addEventListener('click', () => {
  if (!currentChartDefinition || currentPoints.length === 0) {
    setError('Сначала загрузите валидный XLSX файл.');
    return;
  }

  const html = buildExportHtml({
    title: 'Flow Efficiency · Lead & Cycle Time',
    points: currentPoints,
    chartDefinition: currentChartDefinition,
    styles: EXPORT_STYLES
  });
  downloadHtml(html, 'flow-efficiency.html');
});

function setError(message) {
  errorRegion.hidden = !message;
  errorRegion.textContent = message;
}

function setStatus(message) {
  statusRegion.textContent = message;
}

function setExportReady(isReady) {
  exportButton.disabled = !isReady;
}

function clearChart() {
  chart.innerHTML = '';
  chart.classList.add('chart-empty');
  chart.textContent = 'График появится после успешной загрузки файла.';
}

function renderDashboardSummary(points) {
  const metrics = calculateDashboardMetrics(points);
  reportSubtitle.textContent = `Эффективность потока и время прохождения задач · ${metrics.period}`;
  avgFlow.textContent = formatPercentRu(metrics.avgFlow);
  avgLead.textContent = formatDaysRu(metrics.avgLead);
  avgCycle.textContent = formatDaysRu(metrics.avgCycle);
  avgFlowNote.textContent = metrics.excludedOutlierLabel
    ? `без выброса ${metrics.excludedOutlierLabel}`
    : 'по всем месяцам';
  flowRange.textContent = `${formatPercentRu(metrics.min.flowEfficiencyPercent)} – ${formatPercentRu(
    metrics.max.flowEfficiencyPercent
  )}`;
  flowRangeNote.textContent = `${metrics.min.label} → ${metrics.max.label}`;

  const [outlier] = metrics.outliers;
  if (outlier) {
    insightBox.hidden = false;
    insightBox.innerHTML = `⚠ <strong>${outlier.label}</strong> — Cycle Time (${formatDaysRu(
      outlier.cycleDays
    )}) превышает Lead Time (${formatDaysRu(
      outlier.leadDays
    )}), что даёт нерепрезентативный Flow Efficiency ${formatPercentRu(
      outlier.flowEfficiencyPercent
    )}. Скорее всего, это артефакт начала измерений: малый объём выборки или задачи с переопределённым жизненным циклом. Месяц помечен на графике и исключён из средних значений.`;
  } else {
    insightBox.hidden = true;
    insightBox.textContent = '';
  }
}

function formatPercentRu(value) {
  return `${formatNumberRu(value)}%`;
}

function formatDaysRu(value) {
  return `${formatNumberRu(value)} д.`;
}

function formatNumberRu(value) {
  return value.toLocaleString('ru-RU', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });
}
