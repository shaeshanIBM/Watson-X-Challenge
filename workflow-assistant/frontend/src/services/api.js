import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const api = axios.create({ baseURL: BASE, timeout: 8000 });

// ---- Employees ----
export const getEmployees       = ()     => api.get('/employees').then(r => r.data);
export const getEmployee        = (id)   => api.get(`/employees/${id}`).then(r => r.data);
export const getTeamByManager   = (mgr)  => api.get(`/employees/manager/${mgr}`).then(r => r.data);

// ---- Timesheets ----
export const getTimesheets      = (id)   => api.get(`/timesheets/${id}`).then(r => r.data);
export const getMissingTimesheets = ()   => api.get('/timesheets/missing').then(r => r.data);
export const submitTimesheet    = (id, body) => api.post(`/timesheets/${id}/submit`, body).then(r => r.data);
export const addHolidayEntry    = (id, body) => api.post(`/timesheets/${id}/holiday`, body).then(r => r.data);
export const getTimesheetForecast = (id) => api.get(`/timesheets/forecast/${id}`).then(r => r.data);

// ---- Training ----
export const getTraining        = (id)   => api.get(`/training/${id}`).then(r => r.data);
export const getAllOverdueTraining = ()  => api.get('/training/overdue/all').then(r => r.data);
export const updateCourseProgress = (empId, courseId, progress) =>
  api.patch(`/training/${empId}/${courseId}/progress`, { progress }).then(r => r.data);

// ---- Utilization ----
export const getUtilization     = (id)   => api.get(`/utilization/${id}`).then(r => r.data);
export const getTeamUtilization = (mgr)  => api.get(`/utilization/team/${mgr}`).then(r => r.data);
export const getUtilizationForecast = (id) => api.get(`/utilization/forecast/${id}`).then(r => r.data);

// ---- Notifications ----
export const getNotifications   = (id)   => api.get(`/notifications/${id}`).then(r => r.data);
export const markNotificationRead = (id) => api.patch(`/notifications/${id}/read`).then(r => r.data);
export const markAllNotificationsRead = (empId) => api.patch(`/notifications/read-all/${empId}`).then(r => r.data);

// ---- Chat ----
export const sendChatMessage    = (message, employeeId, role) =>
  api.post('/chat', { message, employeeId, role }).then(r => r.data);

// ---- Reports ----
export const getWeeklyManagerReport    = (mgr) => api.get(`/reports/manager/${mgr}/weekly`).then(r => r.data);
export const getUpcomingVacations      = (mgr) => api.get(`/reports/manager/${mgr}/vacations`).then(r => r.data);
export const getTrainingCompliance     = (mgr) => api.get(`/reports/manager/${mgr}/training-compliance`).then(r => r.data);

export default api;
