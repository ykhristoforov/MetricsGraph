import { formatPercent } from '../lib/flow-efficiency.js';
import { MOEX_PALETTE } from './moex-palette.js';

const OUTLIER_THRESHOLD = 100;

export function buildChartDefinition(points) {
  const prepared = prepareChartPoints(points);
  const labels = prepared.map((point) => point.label);
  const flowValues = prepared.map((point) => (point.isOutlier ? null : point.flowEfficiencyPercent));
  const leadValues = prepared.map((point) => point.leadDays);
  const cycleValues = prepared.map((point) => point.cycleDays);
  const customdata = prepared.map((point) => [
    point.label,
    point.leadDays,
    point.cycleDays,
    point.flowEfficiencyPercent
  ]);

  const hovertemplate =
    '<b>%{customdata[0]}</b><br>' +
    '<span style="color:#2F66A8">●</span>Lead Time: %{customdata[1]:.1f} дн.<br>' +
    '<span style="color:#8A5A20">●</span>Cycle Time: %{customdata[2]:.1f} дн.<br>' +
    '<span style="color:#EF3124">●</span>Flow Efficiency: %{customdata[3]:.1f}%<extra></extra>';

  return {
    data: [
      {
        type: 'bar',
        name: 'Flow Efficiency, % (левая ось)',
        x: labels,
        y: flowValues,
        customdata,
        text: prepared.map((point) => (point.isOutlier ? '' : `${Math.round(point.flowEfficiencyPercent)}%`)),
        textposition: 'outside',
        textfont: { color: MOEX_PALETTE.ink, size: 14, family: 'Inter, system-ui, sans-serif' },
        cliponaxis: false,
        marker: {
          color: prepared.map((point) => barColor(point.flowEfficiencyPercent, point.isOutlier)),
          line: { color: 'rgba(255,255,255,0)', width: 0 }
        },
        width: 0.52,
        yaxis: 'y',
        hovertemplate
      },
      {
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Lead Time, дн. (правая ось)',
        x: labels,
        y: leadValues,
        customdata,
        yaxis: 'y2',
        line: { color: MOEX_PALETTE.blue, width: 3, shape: 'spline', smoothing: 0.65 },
        marker: {
          color: MOEX_PALETTE.blue,
          size: 9,
          line: { color: MOEX_PALETTE.white, width: 2 }
        },
        hovertemplate
      },
      {
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Cycle Time, дн. (правая ось)',
        x: labels,
        y: cycleValues,
        customdata,
        yaxis: 'y2',
        line: { color: MOEX_PALETTE.brown, width: 3, shape: 'spline', smoothing: 0.65 },
        marker: {
          color: MOEX_PALETTE.brown,
          size: 9,
          line: { color: MOEX_PALETTE.white, width: 2 }
        },
        hovertemplate
      }
    ],
    layout: {
      paper_bgcolor: MOEX_PALETTE.white,
      plot_bgcolor: MOEX_PALETTE.white,
      bargap: 0.46,
      hovermode: 'closest',
      hoverlabel: {
        bgcolor: '#30343A',
        bordercolor: '#30343A',
        font: { color: MOEX_PALETTE.white, size: 14, family: 'Inter, system-ui, sans-serif' }
      },
      margin: { t: 36, r: 86, b: 118, l: 78 },
      xaxis: {
        title: '',
        tickangle: -34,
        tickfont: { color: MOEX_PALETTE.ink, size: 13, family: 'Inter, system-ui, sans-serif' },
        showgrid: false,
        showline: true,
        linecolor: '#DFDFDF',
        zeroline: false
      },
      yaxis: {
        title: { text: 'Flow Efficiency, %', font: { color: MOEX_PALETTE.redDark, size: 13 } },
        range: [0, 100],
        tickmode: 'array',
        tickvals: [0, 20, 40, 60, 80, 100],
        ticktext: ['0%', '20%', '40%', '60%', '80%', '100%'],
        gridcolor: '#EEEEEE',
        zerolinecolor: '#DDDDDD',
        showline: true,
        linecolor: '#DFDFDF',
        tickfont: { color: MOEX_PALETTE.muted, size: 12 }
      },
      yaxis2: {
        title: { text: 'Lead / Cycle Time, дн.', font: { color: MOEX_PALETTE.blue, size: 13 } },
        overlaying: 'y',
        side: 'right',
        range: [0, Math.max(90, Math.ceil(Math.max(...leadValues, ...cycleValues) / 15) * 15)],
        tickmode: 'array',
        tickvals: [0, 15, 30, 45, 60, 75, 90],
        ticktext: ['0 дн.', '15 дн.', '30 дн.', '45 дн.', '60 дн.', '75 дн.', '90 дн.'],
        showgrid: false,
        zeroline: false,
        showline: true,
        linecolor: '#DFDFDF',
        tickfont: { color: MOEX_PALETTE.muted, size: 12 }
      },
      legend: {
        orientation: 'h',
        y: -0.22,
        x: 0.5,
        xanchor: 'center',
        font: { color: MOEX_PALETTE.ink, size: 13 },
        traceorder: 'normal'
      },
      annotations: buildOutlierAnnotations(prepared)
    },
    config: {
      responsive: true,
      displaylogo: false,
      displayModeBar: false,
      modeBarButtonsToRemove: ['select2d', 'lasso2d']
    },
    meta: {
      prepared
    }
  };
}

export async function renderFlowEfficiencyChart(container, points) {
  const { default: Plotly } = await import('plotly.js-dist-min');
  const definition = buildChartDefinition(points);
  container.textContent = '';
  await Plotly.react(container, definition.data, definition.layout, definition.config);
  return definition;
}

export function summarizePoint(point) {
  return `${point.month}: ${formatPercent(point.flowEfficiencyPercent)}`;
}

export function prepareChartPoints(points) {
  return points.map((point) => ({
    ...point,
    label: formatMonthLabel(point.month),
    isOutlier: point.flowEfficiencyPercent > OUTLIER_THRESHOLD || point.cycleDays > point.leadDays
  }));
}

export function calculateDashboardMetrics(points) {
  const prepared = prepareChartPoints(points);
  const regular = prepared.filter((point) => !point.isOutlier);
  const basis = regular.length > 0 ? regular : prepared;
  const flowValues = basis.map((point) => point.flowEfficiencyPercent);
  const min = basis.reduce((best, point) =>
    point.flowEfficiencyPercent < best.flowEfficiencyPercent ? point : best
  );
  const max = basis.reduce((best, point) =>
    point.flowEfficiencyPercent > best.flowEfficiencyPercent ? point : best
  );

  return {
    prepared,
    outliers: prepared.filter((point) => point.isOutlier),
    avgFlow: average(flowValues),
    avgLead: average(basis.map((point) => point.leadDays)),
    avgCycle: average(basis.map((point) => point.cycleDays)),
    min,
    max,
    period: `${prepared[0]?.label ?? ''} — ${prepared.at(-1)?.label ?? ''}`,
    excludedOutlierLabel: prepared.find((point) => point.isOutlier)?.label
  };
}

function buildOutlierAnnotations(points) {
  return points
    .filter((point) => point.isOutlier)
    .map((point) => ({
      x: point.label,
      y: 3,
      yref: 'y',
      text: `${Math.round(point.flowEfficiencyPercent)}%<br>(выброс)`,
      showarrow: false,
      font: { color: MOEX_PALETTE.muted, size: 12 },
      align: 'center'
    }));
}

function barColor(value, isOutlier) {
  if (isOutlier) return 'rgba(0,0,0,0)';
  if (value >= 80) return MOEX_PALETTE.redBright;
  if (value >= 70) return MOEX_PALETTE.redMid;
  return MOEX_PALETTE.redPale;
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatMonthLabel(month) {
  const [year, monthNumber] = month.split('-').map(Number);
  const date = new Date(Date.UTC(year, monthNumber - 1, 1));
  const label = new Intl.DateTimeFormat('ru-RU', { month: 'short', year: 'numeric' }).format(date);
  return label
    .replace('.', '')
    .replace(/\s*г\.?$/u, '')
    .replace(/^./, (char) => char.toUpperCase());
}
