const timesheets  = require('../mock-data/timesheets.json');
const training    = require('../mock-data/training.json');
const employees   = require('../mock-data/employees.json');
const forecastService = require('../services/forecastService');

/**
 * NLP-style intent resolver.
 * Matches user message to an intent and returns a structured response.
 */
exports.processMessage = (req, res) => {
  const { message, employeeId, role } = req.body;
  if (!message) return res.status(400).json({ error: 'message is required' });

  const m = message.toLowerCase();
  const empId = employeeId || 'EMP001';
  const emp = employees.find(e => e.id === empId) || employees[0];

  // -- TIMESHEET STATUS --
  if (m.match(/submit.*hour|fill.*hour|timesheet.*week|hours.*week|did i.*hours|my hours/)) {
    const sheets = timesheets[empId] || [];
    const thisWeek = sheets.find(s => s.weekOf === '2025-06-23');
    const submitted = thisWeek?.submitted ?? false;
    return res.json({
      intent: 'timesheet_status',
      success: true,
      data: { submitted, currentWeek: '2025-06-23', hours: thisWeek?.hours ?? 0, recentHistory: sheets.slice(0, 4) },
      message: submitted
        ? `✅ Your timesheet for the week of Jun 23 is submitted (${thisWeek.hours} hours, status: ${thisWeek.status}).`
        : `⚠️ You have NOT submitted your timesheet for the week of Jun 23. Today is Friday — please submit by end of business.`
    });
  }

  // -- FORECAST --
  if (m.match(/forecast|next week.*hours|predict.*hours|hours.*next week/)) {
    const sheets = timesheets[empId] || [];
    const forecast = forecastService.forecastHours(sheets);
    return res.json({ intent: 'forecast', success: true, data: forecast, message: `🔮 Based on your last 3 weeks, I forecast approximately ${forecast.forecastedHours}h for next week (confidence: ${forecast.confidence}).` });
  }

  // -- HOLIDAY ENTRY --
  if (m.match(/holiday|labor day|independence|thanksgiving|add.*holiday/)) {
    const holidayName = m.includes('labor') ? 'Labor Day' : m.includes('independence') ? 'Independence Day' : 'Next Public Holiday';
    const holidayDate = m.includes('labor') ? '2025-09-01' : m.includes('independence') ? '2025-07-04' : '2025-07-04';
    return res.json({ intent: 'add_holiday', success: true, data: { holidayName, date: holidayDate, hours: 8, status: 'draft' }, message: `📅 Draft holiday entry created for ${holidayName}. Review and submit in Time@IBM.` });
  }

  // -- UTILIZATION --
  if (m.match(/utilization|utilisation|how many.*hours.*month|hours.*month/)) {
    return res.json({ intent: 'utilization', success: true, data: { thisWeek: { billed: 34, target: 40, pct: 85 }, thisMonth: { billed: 136, target: 160, pct: 85 }, forecast: { billed: 174, target: 160, pct: 109 } }, message: `📈 This week: 34h / 40h (85%). Month-to-date: 136h / 160h (85%). You're on track to meet your monthly target.` });
  }

  // -- TRAINING --
  if (m.match(/training|learning|course|overdue.*train|mandatory.*learn|learn.*progress|behind.*train/)) {
    const courses = training[empId] || [];
    const overdue = courses.filter(c => c.mandatory && c.status === 'overdue');
    const inProg = courses.filter(c => c.status === 'in-progress');
    return res.json({ intent: 'training_status', success: true, data: { overdue, inProgress: inProg, completed: courses.filter(c => c.status === 'completed'), total: courses.length }, message: overdue.length > 0 ? `🚨 You have ${overdue.length} overdue mandatory course(s): ${overdue.map(c => c.title).join(', ')}. Please complete these immediately.` : `✅ No overdue training. You have ${inProg.length} course(s) in progress.` });
  }

  // -- CV STATUS --
  if (m.match(/cv|resume|curriculum vitae|profile.*upload|upload.*cv/)) {
    return res.json({ intent: 'cv_status', success: true, data: { uploaded: emp.cvUploaded, lastUpdated: emp.cvLastUpdated }, message: emp.cvUploaded ? `✅ Your CV is uploaded in SuccessFactors (last updated: ${emp.cvLastUpdated}).` : `⚠️ No CV found in SuccessFactors. Upload your CV to ensure managers can assign you to new projects.` });
  }

  // -- MANAGER: missing timesheets --
  if (m.match(/who.*didn.*submit|missing.*timesheet|no.*timesheet|team.*timesheet/)) {
    const managerId = empId.startsWith('MGR') ? empId : 'MGR001';
    const team = employees.filter(e => e.managerId === managerId);
    const missing = team.filter(e => { const s = timesheets[e.id] || []; const w = s.find(x => x.weekOf === '2025-06-23'); return w && !w.submitted; });
    return res.json({ intent: 'manager_missing_timesheets', success: true, data: missing.map(e => ({ id: e.id, name: e.name, role: e.role })), message: `⏱ ${missing.length} team member(s) have not submitted timesheets this week: ${missing.map(e => e.name).join(', ')}.` });
  }

  // -- MANAGER: team utilization --
  if (m.match(/team.*util|show.*util|utilization.*team|who.*under|underutil/)) {
    const managerId = empId.startsWith('MGR') ? empId : 'MGR001';
    const team = employees.filter(e => e.managerId === managerId);
    const util = team.map(e => { const s = timesheets[e.id] || []; const w = s.find(x => x.weekOf === '2025-06-23'); const h = w?.hours ?? 0; return { name: e.name, hours: h, pct: Math.round(h / e.targetHoursPerWeek * 100) }; });
    const avg = Math.round(util.reduce((s, e) => s + e.pct, 0) / util.length);
    return res.json({ intent: 'team_utilization', success: true, data: util, teamAverage: avg, message: `📊 Team utilization this week: average ${avg}%. ${util.filter(e => e.pct < 75).length} member(s) underutilized.` });
  }

  // -- MANAGER: overdue training --
  if (m.match(/overdue.*training|mandatory.*training|who.*training|training.*overdue/)) {
    const managerId = empId.startsWith('MGR') ? empId : 'MGR001';
    const team = employees.filter(e => e.managerId === managerId);
    const overdue = [];
    team.forEach(e => { const courses = training[e.id] || []; courses.filter(c => c.mandatory && c.status === 'overdue').forEach(c => overdue.push({ name: e.name, course: c.title, dueDate: c.dueDate })); });
    return res.json({ intent: 'manager_training', success: true, data: overdue, message: `🎓 ${overdue.length} overdue mandatory training item(s) across your team. Employees: ${[...new Set(overdue.map(e => e.name))].join(', ')}.` });
  }

  // -- MANAGER: vacations --
  if (m.match(/vacation|pto|leave|upcoming.*availab|availab.*upcoming|show.*vacation/)) {
    const vacations = require('../mock-data/vacations.json');
    const managerId = empId.startsWith('MGR') ? empId : 'MGR001';
    const team = employees.filter(e => e.managerId === managerId);
    const upcoming = vacations.filter(v => team.some(e => e.id === v.employeeId));
    return res.json({ intent: 'upcoming_vacations', success: true, data: upcoming, message: `🏖 ${upcoming.length} upcoming PTO event(s) for your team in the next 90 days.` });
  }

  // -- FALLBACK --
  return res.json({
    intent: 'unknown',
    success: true,
    message: `I can help with: timesheet status, forecasting, training compliance, utilization, CV status, team reports, and vacation schedules. Try: "Did I submit my hours?" or "Who has overdue training?"`
  });
};
