export function calculateFlowEfficiency(cycleDays, leadDays) {
  if (!Number.isFinite(cycleDays) || !Number.isFinite(leadDays) || leadDays <= 0) {
    throw new Error('Flow Efficiency requires finite cycleDays and leadDays > 0');
  }

  return (cycleDays / leadDays) * 100;
}

export function sortPointsByMonth(points) {
  return [...points].sort((a, b) => a.month.localeCompare(b.month));
}

export function formatPercent(value) {
  return `${value.toFixed(1)}%`;
}
