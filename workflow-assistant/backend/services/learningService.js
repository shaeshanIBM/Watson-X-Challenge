/**
 * LearningService
 * Analyses training data and returns compliance metrics.
 */

exports.getComplianceSummary = (courses) => {
  const mandatory = courses.filter(c => c.mandatory);
  const completed = mandatory.filter(c => c.status === 'completed');
  const overdue   = mandatory.filter(c => c.status === 'overdue');
  const inProg    = mandatory.filter(c => c.status === 'in-progress');
  const notStarted = mandatory.filter(c => c.status === 'not-started');

  const compliancePct = mandatory.length
    ? Math.round((completed.length / mandatory.length) * 100)
    : 100;

  const criticalOverdue = overdue.filter(c => {
    const days = Math.floor((new Date() - new Date(c.dueDate)) / 86400000);
    return days > 14;
  });

  return {
    totalCourses: courses.length,
    mandatoryTotal: mandatory.length,
    completed: completed.length,
    overdue: overdue.length,
    inProgress: inProg.length,
    notStarted: notStarted.length,
    compliancePct,
    criticalOverdue: criticalOverdue.length,
    status: overdue.length > 0 ? 'non-compliant' : inProg.length > 0 ? 'in-progress' : 'compliant'
  };
};

exports.getDueSoon = (courses, daysThreshold = 14) => {
  const today = new Date();
  return courses.filter(c => {
    if (c.status === 'completed') return false;
    const due = new Date(c.dueDate);
    const days = Math.floor((due - today) / 86400000);
    return days >= 0 && days <= daysThreshold;
  }).map(c => ({
    ...c,
    daysUntilDue: Math.floor((new Date(c.dueDate) - today) / 86400000)
  }));
};
