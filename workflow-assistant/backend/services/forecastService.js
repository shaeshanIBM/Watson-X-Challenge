/**
 * ForecastService
 * Uses a weighted 3-week rolling average to forecast next week's hours.
 */

exports.forecastHours = (timesheetHistory) => {
  // Get the 3 most recent submitted weeks
  const recent = timesheetHistory
    .filter(w => w.submitted && w.hours > 0)
    .sort((a, b) => new Date(b.weekOf) - new Date(a.weekOf))
    .slice(0, 3);

  if (recent.length === 0) {
    return { forecastedHours: 40, basis: 'default', confidence: 'Low', weeksUsed: 0 };
  }

  // Weighted average: most recent week = 50%, second = 30%, third = 20%
  const weights = [0.5, 0.3, 0.2];
  let weightedSum = 0;
  let totalWeight = 0;
  recent.forEach((week, i) => {
    const w = weights[i] || 0.1;
    weightedSum += week.hours * w;
    totalWeight += w;
  });

  const forecastedHours = Math.round(weightedSum / totalWeight);
  const variance = recent.length > 1
    ? Math.sqrt(recent.reduce((sum, w) => sum + Math.pow(w.hours - forecastedHours, 2), 0) / recent.length)
    : 0;

  const confidence = variance < 3 ? 'High' : variance < 6 ? 'Medium' : 'Low';

  return {
    forecastedHours,
    basis: `Weighted average of last ${recent.length} week(s)`,
    weeksUsed: recent.length,
    recentWeeks: recent.map(w => ({ weekOf: w.weekOf, hours: w.hours })),
    simpleAverage: Math.round(recent.reduce((s, w) => s + w.hours, 0) / recent.length),
    variance: Math.round(variance * 10) / 10,
    confidence,
    forecastWeekOf: getNextWeekDate()
  };
};

function getNextWeekDate() {
  const d = new Date('2025-06-23');
  d.setDate(d.getDate() + 7);
  return d.toISOString().split('T')[0];
}
