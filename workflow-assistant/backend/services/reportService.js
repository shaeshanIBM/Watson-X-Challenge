/**
 * ReportService
 * Builds structured manager reports from raw data.
 */

exports.buildWeeklyManagerReport = ({ team, timesheets, training, vacations }) => {
  const today = new Date();

  const missingTimesheets = team
    .filter(emp => {
      const sheets = timesheets[emp.id] || [];
      const thisWeek = sheets.find(s => s.weekOf === '2025-06-23');
      return thisWeek && !thisWeek.submitted;
    })
    .map(emp => {
      const sheets = timesheets[emp.id] || [];
      const weeksOut = sheets.filter(s => !s.submitted).length;
      const lastSubmitted = sheets.find(s => s.submitted)?.weekOf || 'Never';
      return { ...emp, weeksOutstanding: weeksOut, lastSubmitted, priority: weeksOut > 1 ? 'high' : 'medium' };
    });

  const overdueTraining = [];
  team.forEach(emp => {
    const courses = training[emp.id] || [];
    courses
      .filter(c => c.mandatory && c.status === 'overdue')
      .forEach(course => {
        const daysOverdue = Math.floor((today - new Date(course.dueDate)) / 86400000);
        overdueTraining.push({ employee: emp, course, daysOverdue, priority: daysOverdue > 20 ? 'high' : 'medium' });
      });
  });

  const utilizationSummary = team.map(emp => {
    const sheets = timesheets[emp.id] || [];
    const thisWeek = sheets.find(s => s.weekOf === '2025-06-23');
    const hours = thisWeek?.hours ?? 0;
    const pct = Math.round((hours / emp.targetHoursPerWeek) * 100);
    return { ...emp, currentWeekHours: hours, utilizationPct: pct, utilizationStatus: pct >= 110 ? 'over' : pct >= 85 ? 'on-target' : pct >= 70 ? 'low' : 'under' };
  });

  const missingCV = team.filter(e => !e.cvUploaded);

  const in60Days = new Date(today.getTime() + 60 * 86400000);
  const upcomingPTO = vacations.filter(v => {
    const start = new Date(v.startDate);
    return team.some(e => e.id === v.employeeId) && start >= today && start <= in60Days;
  });

  return { missingTimesheets, overdueTraining, utilizationSummary, missingCV, upcomingPTO };
};
