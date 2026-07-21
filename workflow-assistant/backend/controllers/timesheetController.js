const timesheets = require('../mock-data/timesheets.json');
const employees  = require('../mock-data/employees.json');
const forecastService = require('../services/forecastService');

exports.getByEmployee = (req, res) => {
  const data = timesheets[req.params.employeeId] || [];
  res.json({ success: true, data });
};

exports.getMissing = (req, res) => {
  const currentWeek = '2025-06-23';
  const missing = [];
  Object.entries(timesheets).forEach(([empId, weeks]) => {
    const thisWeek = weeks.find(w => w.weekOf === currentWeek);
    if (thisWeek && !thisWeek.submitted) {
      const emp = employees.find(e => e.id === empId);
      const weeksOut = weeks.filter(w => !w.submitted).length;
      if (emp) missing.push({ employeeId: empId, name: emp.name, role: emp.role, weeksOutstanding: weeksOut, lastSubmitted: weeks.find(w => w.submitted)?.weekOf || 'Never' });
    }
  });
  res.json({ success: true, data: missing, count: missing.length });
};

exports.submit = (req, res) => {
  const { employeeId } = req.params;
  const { hours, project, weekOf } = req.body;
  // Simulate submission
  res.json({ success: true, message: `Timesheet submitted for ${employeeId}`, data: { employeeId, hours: hours || 40, project: project || 'Default', weekOf: weekOf || '2025-06-23', status: 'pending', submittedAt: new Date().toISOString() } });
};

exports.addHoliday = (req, res) => {
  const { employeeId } = req.params;
  const { holidayName, date, hours } = req.body;
  res.json({ success: true, message: 'Holiday draft entry created', data: { employeeId, holidayName, date, hours: hours || 8, category: 'IBM US Holiday', status: 'draft', createdAt: new Date().toISOString() } });
};

exports.getForecast = (req, res) => {
  const { employeeId } = req.params;
  const empTimesheets = timesheets[employeeId] || [];
  const forecast = forecastService.forecastHours(empTimesheets);
  res.json({ success: true, data: forecast });
};
