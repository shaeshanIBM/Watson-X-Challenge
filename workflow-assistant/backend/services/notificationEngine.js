/**
 * NotificationEngine
 * Generates proactive notifications based on current data state.
 */
const timesheets    = require('../mock-data/timesheets.json');
const training      = require('../mock-data/training.json');
const employees     = require('../mock-data/employees.json');
const vacations     = require('../mock-data/vacations.json');

exports.generateForEmployee = (employeeId) => {
  const alerts = [];
  const emp = employees.find(e => e.id === employeeId);
  if (!emp) return alerts;

  // 1. Missing timesheet (Friday reminder)
  const sheets = timesheets[employeeId] || [];
  const thisWeek = sheets.find(s => s.weekOf === '2025-06-23');
  if (thisWeek && !thisWeek.submitted) {
    const weeksOut = sheets.filter(s => !s.submitted).length;
    alerts.push({ type: 'timesheet_reminder', priority: weeksOut > 1 ? 'high' : 'high', title: `Timesheet Missing — Week of Jun 23`, description: `You have ${weeksOut} week(s) of unsubmitted timesheets. Submit now to avoid escalation.`, source: 'Time@IBM', actionLabel: 'Submit Now' });
  }

  // 2. Overdue training
  const courses = training[employeeId] || [];
  const overdueCourses = courses.filter(c => c.mandatory && c.status === 'overdue');
  overdueCourses.forEach(course => {
    const days = Math.floor((new Date() - new Date(course.dueDate)) / 86400000);
    alerts.push({ type: 'training_overdue', priority: days > 20 ? 'high' : 'medium', title: `Overdue: ${course.title}`, description: `This mandatory course is ${days} days overdue (due: ${course.dueDate}).`, source: 'MyLearning', actionLabel: 'Start Course' });
  });

  // 3. Missing CV
  if (!emp.cvUploaded) {
    alerts.push({ type: 'cv_missing', priority: 'medium', title: 'CV Missing in SuccessFactors', description: 'Your CV has not been uploaded. Upload to enable staffing assignment.', source: 'SuccessFactors', actionLabel: 'Upload CV' });
  }

  // 4. Upcoming holidays
  const nextHoliday = { name: 'Independence Day', date: '2025-07-04' };
  const daysToHoliday = Math.floor((new Date(nextHoliday.date) - new Date()) / 86400000);
  if (daysToHoliday > 0 && daysToHoliday <= 14) {
    alerts.push({ type: 'holiday_suggestion', priority: 'low', title: `Upcoming Holiday: ${nextHoliday.name}`, description: `${nextHoliday.name} is ${daysToHoliday} day(s) away. Add a holiday entry to your timesheet.`, source: 'Time@IBM', actionLabel: 'Add Entry' });
  }

  return alerts.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });
};

exports.generateForManager = (managerId) => {
  const alerts = [];
  const team = employees.filter(e => e.managerId === managerId);

  // Missing timesheets
  const missing = team.filter(emp => { const s = timesheets[emp.id] || []; const w = s.find(x => x.weekOf === '2025-06-23'); return w && !w.submitted; });
  if (missing.length > 0) {
    alerts.push({ type: 'team_timesheet', priority: 'high', title: `${missing.length} Team Member(s) Missing Timesheets`, description: `${missing.map(e => e.name).join(', ')} have not submitted this week.`, source: 'Time@IBM', actionLabel: 'View Report' });
  }

  // Overdue training
  const overdueCount = team.reduce((count, emp) => {
    const courses = training[emp.id] || [];
    return count + courses.filter(c => c.mandatory && c.status === 'overdue').length;
  }, 0);
  if (overdueCount > 0) {
    alerts.push({ type: 'team_training', priority: 'high', title: `${overdueCount} Overdue Training Item(s) in Team`, description: 'Multiple team members have overdue mandatory training requiring immediate action.', source: 'MyLearning', actionLabel: 'View Compliance' });
  }

  // Missing CVs
  const missingCV = team.filter(e => !e.cvUploaded);
  if (missingCV.length > 0) {
    alerts.push({ type: 'cv_missing_team', priority: 'medium', title: `${missingCV.length} Team Member(s) Missing CV`, description: `${missingCV.map(e => e.name).join(', ')} have no CV in SuccessFactors.`, source: 'SuccessFactors', actionLabel: 'View Team' });
  }

  // Upcoming PTO
  const today = new Date();
  const in30Days = new Date(today.getTime() + 30 * 86400000);
  const upcoming = vacations.filter(v => { const start = new Date(v.startDate); return team.some(e => e.id === v.employeeId) && start >= today && start <= in30Days; });
  if (upcoming.length > 0) {
    alerts.push({ type: 'team_pto', priority: 'medium', title: `${upcoming.length} Team Member(s) on PTO Next 30 Days`, description: `${upcoming.map(v => v.employeeName).join(', ')} have upcoming approved leave.`, source: 'SuccessFactors', actionLabel: 'View Schedule' });
  }

  return alerts;
};
