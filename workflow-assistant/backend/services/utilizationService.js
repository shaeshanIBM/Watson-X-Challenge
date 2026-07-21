/**
 * UtilizationService
 * Computes utilization statistics for an employee.
 */

exports.computeStats = (utilizationData) => {
  const { weeklyHours, monthlyHours } = utilizationData;

  const thisWeek = weeklyHours[weeklyHours.length - 1];
  const thisMonth = monthlyHours.find(m => m.partial) || monthlyHours[monthlyHours.length - 1];

  const weeklyAvg = Math.round(
    weeklyHours.reduce((s, w) => s + w.billed, 0) / weeklyHours.length
  );

  const weeklyTrend = weeklyHours.map(w => ({
    ...w,
    pct: Math.round((w.billed / w.target) * 100),
    status: w.billed >= w.target * 0.9 ? 'on-target' : w.billed >= w.target * 1.1 ? 'over' : 'under'
  }));

  return {
    thisWeek: { billed: thisWeek.billed, target: thisWeek.target, pct: Math.round((thisWeek.billed / thisWeek.target) * 100) },
    thisMonth: { billed: thisMonth.billed, target: thisMonth.target, pct: Math.round((thisMonth.billed / thisMonth.target) * 100) },
    weeklyAverage: weeklyAvg,
    weeklyTrend
  };
};

exports.getTeamSummary = (teamUtilArray) => {
  const avg = Math.round(teamUtilArray.reduce((s, e) => s + e.pct, 0) / teamUtilArray.length);
  const over       = teamUtilArray.filter(e => e.pct > 100);
  const underUtil  = teamUtilArray.filter(e => e.pct < 75);
  const onTarget   = teamUtilArray.filter(e => e.pct >= 75 && e.pct <= 100);
  return { avg, over: over.length, under: underUtil.length, onTarget: onTarget.length };
};
