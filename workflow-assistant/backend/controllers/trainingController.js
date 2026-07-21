const training  = require('../mock-data/training.json');
const employees = require('../mock-data/employees.json');

exports.getByEmployee = (req, res) => {
  const data = training[req.params.employeeId] || [];
  const stats = {
    total: data.length,
    completed: data.filter(c => c.status === 'completed').length,
    overdue: data.filter(c => c.status === 'overdue').length,
    inProgress: data.filter(c => c.status === 'in-progress').length,
    notStarted: data.filter(c => c.status === 'not-started').length,
    mandatoryOverdue: data.filter(c => c.mandatory && c.status === 'overdue').length
  };
  res.json({ success: true, data, stats });
};

exports.getAllOverdue = (req, res) => {
  const overdue = [];
  Object.entries(training).forEach(([empId, courses]) => {
    const emp = employees.find(e => e.id === empId);
    courses.filter(c => c.status === 'overdue' && c.mandatory).forEach(course => {
      if (emp) {
        overdue.push({ employeeId: empId, employeeName: emp.name, role: emp.role, course: course.title, dueDate: course.dueDate, progress: course.progress, daysOverdue: Math.floor((new Date() - new Date(course.dueDate)) / 86400000) });
      }
    });
  });
  overdue.sort((a, b) => b.daysOverdue - a.daysOverdue);
  res.json({ success: true, data: overdue, count: overdue.length });
};

exports.updateProgress = (req, res) => {
  const { employeeId, courseId } = req.params;
  const { progress } = req.body;
  res.json({ success: true, message: 'Progress updated', data: { employeeId, courseId, progress, updatedAt: new Date().toISOString() } });
};
