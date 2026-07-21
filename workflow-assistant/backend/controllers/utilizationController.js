const utilData  = require('../mock-data/utilization.json');
const employees = require('../mock-data/employees.json');
const timesheets = require('../mock-data/timesheets.json');
const utilizationService = require('../services/utilizationService');
const forecastService    = require('../services/forecastService');

exports.getByEmployee = (req, res) => {
  const { employeeId } = req.params;
  const data = utilData[employeeId];
  if (!data) return res.status(404).json({ error: 'Utilization data not found' });
  const stats = utilizationService.computeStats(data);
  res.json({ success: true, data, stats });
};

exports.getTeam = (req, res) => {
  const team = employees.filter(e => e.managerId === req.params.managerId);
  const teamUtil = team.map(emp => {
    const sheets = timesheets[emp.id] || [];
    const thisWeek = sheets.find(s => s.weekOf === '2025-06-23');
    const util = utilData[emp.id];
    const weeklyHours = thisWeek?.hours ?? (util?.weeklyHours?.[util.weeklyHours.length - 1]?.billed ?? 0);
    const pct = Math.round((weeklyHours / emp.targetHoursPerWeek) * 100);
    return { employeeId: emp.id, name: emp.name, role: emp.role, initials: emp.initials, avatarColor: emp.avatarColor, weeklyHours, targetHours: emp.targetHoursPerWeek, utilizationPct: pct, status: pct >= 90 ? 'over' : pct >= 75 ? 'on-target' : 'under' };
  });
  const avg = Math.round(teamUtil.reduce((s, e) => s + e.utilizationPct, 0) / teamUtil.length);
  res.json({ success: true, data: teamUtil, teamAverage: avg });
};

exports.getForecast = (req, res) => {
  const { employeeId } = req.params;
  const empSheets = timesheets[employeeId] || [];
  const forecast = forecastService.forecastHours(empSheets);
  res.json({ success: true, data: forecast });
};
