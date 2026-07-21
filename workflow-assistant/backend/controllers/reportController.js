const timesheets  = require('../mock-data/timesheets.json');
const training    = require('../mock-data/training.json');
const vacations   = require('../mock-data/vacations.json');
const employees   = require('../mock-data/employees.json');
const utilData    = require('../mock-data/utilization.json');
const forecastService    = require('../services/forecastService');
const utilizationService = require('../services/utilizationService');

exports.getWeeklyReport = (req, res) => {
  const { managerId } = req.params;
  const team = employees.filter(e => e.managerId === managerId);

  // Missing timesheets
  const missingTimesheets = team.filter(emp => {
    const sheets = timesheets[emp.id] || [];
    const thisWeek = sheets.find(s => s.weekOf === '2025-06-23');
    return thisWeek && !thisWeek.submitted;
  }).map(emp => {
    const sheets = timesheets[emp.id] || [];
    const weeksOut = sheets.filter(s => !s.submitted).length;
    return { id: emp.id, name: emp.name, role: emp.role, weeksOutstanding: weeksOut };
  });

  // Overdue training
  const overdueTraining = [];
  team.forEach(emp => {
    const courses = training[emp.id] || [];
    courses.filter(c => c.mandatory && c.status === 'overdue').forEach(c => {
      overdueTraining.push({ employeeId: emp.id, name: emp.name, course: c.title, dueDate: c.dueDate, daysOverdue: Math.floor((new Date() - new Date(c.dueDate)) / 86400000) });
    });
  });

  // Utilization summary
  const utilizationSummary = team.map(emp => {
    const sheets = timesheets[emp.id] || [];
    const thisWeek = sheets.find(s => s.weekOf === '2025-06-23');
    const hours = thisWeek?.hours ?? 0;
    const pct = Math.round((hours / emp.targetHoursPerWeek) * 100);
    return { id: emp.id, name: emp.name, hours, pct, status: pct >= 90 ? 'over' : pct >= 75 ? 'on-target' : 'under' };
  });

  // CV compliance
  const missingCV = team.filter(emp => !emp.cvUploaded).map(emp => ({ id: emp.id, name: emp.name, role: emp.role }));

  // Upcoming vacations (next 45 days)
  const today = new Date();
  const in45Days = new Date(today.getTime() + 45 * 86400000);
  const upcomingPTO = vacations.filter(v => {
    const start = new Date(v.startDate);
    const isTeamMember = team.some(e => e.id === v.employeeId);
    return isTeamMember && start >= today && start <= in45Days;
  });

  res.json({
    success: true,
    weekOf: '2025-06-23',
    teamSize: team.length,
    data: { missingTimesheets, overdueTraining, utilizationSummary, missingCV, upcomingPTO },
    summary: {
      missingTimesheetCount: missingTimesheets.length,
      overdueTrainingCount: overdueTraining.length,
      missingCVCount: missingCV.length,
      upcomingPTOCount: upcomingPTO.length,
      teamAvgUtilization: Math.round(utilizationSummary.reduce((s, e) => s + e.pct, 0) / utilizationSummary.length)
    }
  });
};

exports.getUpcomingVacations = (req, res) => {
  const { managerId } = req.params;
  const team = employees.filter(e => e.managerId === managerId);
  const today = new Date();
  const in90Days = new Date(today.getTime() + 90 * 86400000);
  const data = vacations.filter(v => {
    const start = new Date(v.startDate);
    return team.some(e => e.id === v.employeeId) && start >= today && start <= in90Days;
  });
  res.json({ success: true, data, count: data.length });
};

exports.getTrainingCompliance = (req, res) => {
  const { managerId } = req.params;
  const team = employees.filter(e => e.managerId === managerId);
  const compliance = team.map(emp => {
    const courses = training[emp.id] || [];
    const mandatory = courses.filter(c => c.mandatory);
    const completed = mandatory.filter(c => c.status === 'completed');
    const overdue = mandatory.filter(c => c.status === 'overdue');
    return { id: emp.id, name: emp.name, role: emp.role, mandatoryTotal: mandatory.length, mandatoryCompleted: completed.length, mandatoryOverdue: overdue.length, compliancePct: mandatory.length ? Math.round((completed.length / mandatory.length) * 100) : 100 };
  });
  const avgCompliance = Math.round(compliance.reduce((s, e) => s + e.compliancePct, 0) / compliance.length);
  res.json({ success: true, data: compliance, teamAvgCompliance: avgCompliance });
};
