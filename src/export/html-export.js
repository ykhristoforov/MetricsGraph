import plotlySource from 'plotly.js-dist-min/plotly.min.js?raw';
import { calculateDashboardMetrics } from '../rendering/flow-efficiency-chart.js';

export function buildExportHtml({ title, points, chartDefinition, styles }) {
  const payload = JSON.stringify({ points, chartDefinition }).replace(/</g, '\\u003c');
  const metrics = calculateDashboardMetrics(points);
  const insight = buildInsight(metrics);
  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>${styles}</style>
</head>
<body class="has-data">
  <main class="app-shell">
    <div class="workspace">
      <section class="dashboard-card" aria-label="Flow Efficiency dashboard">
        <header class="workspace__header">
          <div>
            <h1>${escapeHtml(title)}</h1>
            <p class="subtitle">${escapeHtml(`Эффективность потока и время прохождения задач · ${metrics.period}`)}</p>
          </div>
          <div class="header-actions">
            <span class="brand-pill">MOEX ИТ</span>
          </div>
        </header>

        <div class="divider"></div>

        <section class="kpi-grid" aria-label="Ключевые метрики">
          <article class="kpi-card kpi-card--red">
            <p>Средний Flow Efficiency</p>
            <strong>${escapeHtml(formatPercentRu(metrics.avgFlow))}</strong>
            <span>${escapeHtml(
              metrics.excludedOutlierLabel ? `без выброса ${metrics.excludedOutlierLabel}` : 'по всем месяцам'
            )}</span>
          </article>
          <article class="kpi-card kpi-card--blue">
            <p>Средний Lead Time</p>
            <strong>${escapeHtml(formatDaysRu(metrics.avgLead))}</strong>
            <span>от создания до закрытия</span>
          </article>
          <article class="kpi-card kpi-card--brown">
            <p>Средний Cycle Time</p>
            <strong>${escapeHtml(formatDaysRu(metrics.avgCycle))}</strong>
            <span>активная работа</span>
          </article>
          <article class="kpi-card">
            <p>Диапазон Flow Eff.</p>
            <strong>${escapeHtml(
              `${formatPercentRu(metrics.min.flowEfficiencyPercent)} – ${formatPercentRu(metrics.max.flowEfficiencyPercent)}`
            )}</strong>
            <span>${escapeHtml(`${metrics.min.label} → ${metrics.max.label}`)}</span>
          </article>
        </section>

        <section class="chart-section" aria-label="Интерактивный график Flow Efficiency">
          <div id="chart"></div>
        </section>
        ${insight}
      </section>
    </div>
  </main>
  <script>${escapeScript(plotlySource)}</script>
  <script>
    const payload = ${payload};
    Plotly.newPlot(
      'chart',
      payload.chartDefinition.data,
      payload.chartDefinition.layout,
      payload.chartDefinition.config
    );
  </script>
</body>
</html>`;
}

export function hasRemoteReferences(html) {
  return /(<(?:script|img|iframe|link)\b[^>]*(?:src|href)=["'](?:https?:)?\/\/|action=["'](?:https?:)?\/\/|@import\s+["'](?:https?:)?\/\/|url\(\s*["']?(?:https?:)?\/\/)/i.test(
    html
  );
}

export function downloadHtml(html, fileName) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export const EXPORT_STYLES = `
:root { --moex-red: #e30613; --moex-red-dark: #a50021; --moex-white: #ffffff; --ink: #20242a; --muted: #68707d; --line: #dfe3e8; --surface: #f4f6f8; font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: var(--ink); background: var(--surface); }
* { box-sizing: border-box; }
body { margin: 0; background: var(--surface); }
.app-shell { min-height: 100vh; padding: 12px; }
.workspace { max-width: 1440px; margin: 0 auto; }
.dashboard-card { margin: 0 auto; padding: 36px 42px 28px; border: 1px solid rgba(32, 36, 42, 0.08); border-radius: 18px; background: var(--moex-white); box-shadow: 0 16px 48px rgba(32, 36, 42, 0.1); }
.workspace__header { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 0 0 22px; }
h1 { margin: 0; color: var(--ink); font-size: clamp(2rem, 3vw, 3rem); line-height: 1.05; }
.subtitle { margin: 10px 0 0; color: #8a8f98; font-size: 1.25rem; font-weight: 600; }
.header-actions { display: flex; align-items: center; gap: 14px; }
.brand-pill { display: inline-flex; align-items: center; min-height: 28px; padding: 0 12px; border-radius: 6px; color: var(--moex-white); background: var(--moex-red); font-weight: 800; line-height: 1; }
.divider { height: 1px; margin-bottom: 24px; background: #eceff2; }
.kpi-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-bottom: 36px; }
.kpi-card { min-height: 108px; padding: 18px 20px; border: 1px solid #e4e7eb; border-radius: 14px; background: #fbfbfc; }
.kpi-card p { margin: 0 0 6px; color: #8a8f98; font-size: 0.95rem; font-weight: 800; text-transform: uppercase; }
.kpi-card strong { display: block; color: var(--ink); font-size: 2rem; line-height: 1.05; }
.kpi-card span { display: block; margin-top: 6px; color: #8a8f98; font-weight: 650; }
.kpi-card--red { border-color: #ffc9c9; background: #fff4f4; }
.kpi-card--red p, .kpi-card--red strong { color: #c21d1d; }
.kpi-card--blue { border-color: #c8dcf3; background: #f1f7ff; }
.kpi-card--blue p, .kpi-card--blue strong { color: #2f66a8; }
.kpi-card--brown { border-color: #efd39f; background: #fff7e8; }
.kpi-card--brown p, .kpi-card--brown strong { color: #8a5a20; }
.chart-section { min-height: 620px; background: var(--moex-white); }
#chart { width: 100%; min-height: 640px; height: min(62vh, 720px); }
.insight-box { margin-top: 18px; padding: 18px 20px; border: 1px solid #f2d59b; border-radius: 10px; color: #704914; background: #fff9ec; font-size: 1.05rem; font-weight: 600; line-height: 1.45; }
@media (max-width: 720px) { .app-shell { padding: 16px; } .workspace__header { align-items: stretch; flex-direction: column; } .dashboard-card { padding: 24px 16px; } .kpi-grid { grid-template-columns: 1fr; } }
`;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeScript(value) {
  return String(value).replace(/<\/script/gi, '<\\/script');
}

function buildInsight(metrics) {
  const [outlier] = metrics.outliers;
  if (!outlier) {
    return '';
  }

  return `<aside class="insight-box">⚠ <strong>${escapeHtml(outlier.label)}</strong> — Cycle Time (${escapeHtml(
    formatDaysRu(outlier.cycleDays)
  )}) превышает Lead Time (${escapeHtml(formatDaysRu(outlier.leadDays))}), что даёт нерепрезентативный Flow Efficiency ${escapeHtml(
    formatPercentRu(outlier.flowEfficiencyPercent)
  )}. Скорее всего, это артефакт начала измерений: малый объём выборки или задачи с переопределённым жизненным циклом. Месяц помечен на графике и исключён из средних значений.</aside>`;
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
