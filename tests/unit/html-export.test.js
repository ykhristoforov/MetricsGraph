import { describe, expect, it } from 'vitest';
import { buildChartDefinition } from '../../src/rendering/flow-efficiency-chart.js';
import { buildExportHtml, EXPORT_STYLES, hasRemoteReferences } from '../../src/export/html-export.js';

const points = [
  {
    month: '2024-01-01',
    label: 'янв. 2024 г.',
    leadDays: 10,
    cycleDays: 5,
    flowEfficiencyPercent: 50
  }
];

describe('html export', () => {
  it('embeds Plotly runtime, data, config, and styles', () => {
    const html = buildExportHtml({
      title: 'Flow Efficiency',
      points,
      chartDefinition: buildChartDefinition(points),
      styles: EXPORT_STYLES
    });
    expect(html).toContain('Plotly.newPlot');
    expect(html).toContain('2024-01-01');
    expect(html).toContain('Flow Efficiency');
    expect(html).toContain('<style>');
  });

  it('does not contain remote runtime references', () => {
    const html = buildExportHtml({
      title: 'Flow Efficiency',
      points,
      chartDefinition: buildChartDefinition(points),
      styles: EXPORT_STYLES
    });
    expect(hasRemoteReferences(html)).toBe(false);
    expect(html).not.toContain('.xlsx');
  });
});
