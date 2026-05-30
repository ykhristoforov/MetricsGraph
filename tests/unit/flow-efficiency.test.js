import { describe, expect, it } from 'vitest';
import { calculateFlowEfficiency, sortPointsByMonth } from '../../src/lib/flow-efficiency.js';

describe('flow efficiency helpers', () => {
  it('calculates CycleTime / LeadTime * 100', () => {
    expect(calculateFlowEfficiency(5, 10)).toBe(50);
  });

  it('allows values above 100%', () => {
    expect(calculateFlowEfficiency(15, 10)).toBe(150);
  });

  it('sorts points chronologically by month', () => {
    const sorted = sortPointsByMonth([
      { month: '2024-03-01' },
      { month: '2024-01-01' },
      { month: '2024-02-01' }
    ]);
    expect(sorted.map((point) => point.month)).toEqual(['2024-01-01', '2024-02-01', '2024-03-01']);
  });
});
