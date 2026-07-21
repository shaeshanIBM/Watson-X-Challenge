const employees = require('../mock-data/employees.json');

exports.getAll = (req, res) => {
  res.json({ success: true, data: employees, count: employees.length });
};

exports.getById = (req, res) => {
  const emp = employees.find(e => e.id === req.params.id);
  if (!emp) return res.status(404).json({ error: 'Employee not found' });
  res.json({ success: true, data: emp });
};

exports.getByManager = (req, res) => {
  const team = employees.filter(e => e.managerId === req.params.managerId);
  res.json({ success: true, data: team, count: team.length });
};
