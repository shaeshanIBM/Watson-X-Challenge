const notifications = require('../mock-data/notifications.json');

// In-memory state for read tracking during a session
const readState = {};

exports.getByEmployee = (req, res) => {
  const { employeeId } = req.params;
  const data = notifications
    .filter(n => n.employeeId === employeeId)
    .map(n => ({ ...n, read: readState[n.id] !== undefined ? readState[n.id] : n.read }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const unread = data.filter(n => !n.read).length;
  res.json({ success: true, data, unreadCount: unread });
};

exports.markRead = (req, res) => {
  readState[req.params.id] = true;
  res.json({ success: true, message: 'Notification marked as read' });
};

exports.markAllRead = (req, res) => {
  const { employeeId } = req.params;
  notifications.filter(n => n.employeeId === employeeId).forEach(n => { readState[n.id] = true; });
  res.json({ success: true, message: 'All notifications marked as read' });
};
