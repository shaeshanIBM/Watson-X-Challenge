import React from 'react';
import MetricCard from './MetricCard';
import AlertList from './AlertList';
import TeamTable from './TeamTable';
import { teamUtilization, employees, timesheets, training, vacations } from '../../data/mockData';

const WEEK = '2026-07-20';

const missingTimesheets = employees.filter(e => {
  const s = timesheets[e.id] || [];
  const w = s.find(x => x.weekOf === WEEK);
  return w && !w.submitted;
});

const overdueTraining = [];
employees.forEach(emp => {
  const courses = training[emp.id] || [];
  courses.filter(c => c.mandatory && c.status === 'overdue').forEach(c => {
    overdueTraining.push({ name: emp.name, course: c.title, dueDate: c.dueDate });
  });
});

const missingCV = employees.filter(e => !e.cvUploaded);

// Unique employees with at least one overdue mandatory course
const overdueEmployeeCount = new Set(overdueTraining.map(o => o.name)).size;
// % of employees with NO overdue mandatory courses
const trainingCompliancePct = Math.round(((employees.length - overdueEmployeeCount) / employees.length) * 100);

const alerts = [
  { priority: 'high',   icon: '🚨', title: `${overdueTraining.length} Critical Training Items Overdue`, desc: overdueTraining.slice(0, 2).map(o => o.name).join(', ') + ' — action required' },
  { priority: 'high',   icon: '⏱',  title: `${missingTimesheets.length} Employees Missing Timesheets`,   desc: missingTimesheets.map(e => e.name).join(', ') },
  { priority: 'medium', icon: '📄', title: `${missingCV.length} CVs Missing in SuccessFactors`,          desc: missingCV.map(e => e.name).join(', ') },
  { priority: 'medium', icon: '📉', title: '2 Employees Underutilized',                                   desc: 'Marcus Chen (62%), James O\'Brien (65%)' },
  { priority: 'low',    icon: '🏖', title: '4 Team Members on PTO in August',                            desc: 'David Kim, Lisa Torres, Priya Patel, Carlos Mendez' },
];

const missingCols = [
  { key: 'name',  label: 'Employee' },
  { key: 'weeks', label: 'Weeks Outstanding', render: v => <span className={`text-xs font-semibold px-2 py-0.5 rounded ${v > 1 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{v} week{v > 1 ? 's' : ''}</span> },
];

const missingRows = missingTimesheets.map(e => {
  const s = timesheets[e.id] || [];
  return { name: e.name, weeks: s.filter(x => !x.submitted).length };
});

const trainingCols = [
  { key: 'name',    label: 'Employee' },
  { key: 'course',  label: 'Course' },
  { key: 'dueDate', label: 'Due', render: v => <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded">{v}</span> },
];

export default function ManagerDashboard({ setActiveView }) {
  const avgUtil = Math.round(teamUtilization.reduce((s, e) => s + e.pct, 0) / teamUtilization.length);

  const trainingDropdown = (
    <div className="space-y-2">
      {overdueTraining.length === 0 ? (
        <p className="text-xs text-green-600 font-medium">No overdue training ✓</p>
      ) : (
        overdueTraining.map((row, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-gray-700 w-28 flex-shrink-0">{row.name}</span>
            <span className="text-xs text-gray-600 flex-1 truncate">{row.course}</span>
            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0">{row.dueDate}</span>
          </div>
        ))
      )}
    </div>
  );

  const timesheetDropdown = (
    <div className="space-y-2">
      {missingRows.length === 0 ? (
        <p className="text-xs text-green-600 font-medium">All timesheets submitted ✓</p>
      ) : (
        missingRows.map((row, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{row.name}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${row.weeks > 1 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {row.weeks} week{row.weeks > 1 ? 's' : ''} missing
            </span>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="p-6">
      <div className="text-base font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-200 flex items-center justify-between">
        Manager Dashboard
        <span className="text-sm font-normal text-gray-500">Team: Cloud Solutions · Week of Jul 20, 2026</span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <MetricCard title="⏱ Timesheets Submitted" value={`${employees.length - missingTimesheets.length} / ${employees.length}`} sub={`${missingTimesheets.length} employees missing`} accent="default" dropdown={timesheetDropdown} />
        <MetricCard title="📈 Avg Team Utilization" value={`${avgUtil}%`} sub="Target: 85% · 2 underutilized" accent={avgUtil >= 85 ? 'green' : 'yellow'} onClick={() => setActiveView('utilization')} />
        <MetricCard title="🎓 Training Compliance" value={`${trainingCompliancePct}%`} sub={`${overdueEmployeeCount} employee${overdueEmployeeCount !== 1 ? 's' : ''} with overdue courses`} accent={trainingCompliancePct >= 80 ? 'yellow' : 'red'} dropdown={trainingDropdown} />
        <MetricCard title="📄 CV Compliance" value={`${Math.round(((employees.length - missingCV.length) / employees.length) * 100)}%`} sub={`${missingCV.length} team members missing CV`} accent="yellow" />
        <MetricCard title="🏖 Upcoming PTO (30d)" value="4" sub="Employees on leave next month" accent="blue" onClick={() => setActiveView('availability')} />
        <MetricCard title="📋 Open Capacity" value="18h" sub="Available bandwidth this week" accent="default" />
      </div>

      {/* Utilization bars + Alerts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">📊 Weekly Utilization by Employee</div>
          <div className="space-y-2">
            {teamUtilization.map(emp => {
              const barColor = emp.pct >= 90 ? 'bg-green-500' : emp.pct >= 75 ? 'bg-yellow-500' : 'bg-red-500';
              const textColor = emp.pct >= 90 ? 'text-green-700' : emp.pct >= 75 ? 'text-yellow-600' : 'text-red-600';
              return (
                <div key={emp.id} className="flex items-center gap-2">
                  <span className="w-28 text-xs text-gray-700 font-medium truncate">{emp.name.split(' ')[0]}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(emp.pct, 120)}%` }} />
                  </div>
                  <span className={`w-12 text-right text-xs font-semibold ${textColor}`}>{emp.hours}h</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">🔔 Priority Alerts</div>
          <AlertList alerts={alerts} />
        </div>
      </div>
    </div>
  );
}
