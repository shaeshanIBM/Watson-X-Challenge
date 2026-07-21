import React from 'react';
import { training as allTraining } from '../../data/mockData';

const STATUS_STYLE = {
  overdue:     { bg: 'bg-red-50',    icon: '🚨', barColor: 'bg-red-500',    textColor: 'text-red-600'    },
  'in-progress':{ bg: 'bg-blue-50',   icon: '📖', barColor: 'bg-blue-500',   textColor: 'text-blue-600'   },
  completed:   { bg: 'bg-green-50',  icon: '✅', barColor: 'bg-green-500',  textColor: 'text-green-700'  },
  'not-started':{ bg: 'bg-gray-50',   icon: '📋', barColor: 'bg-gray-400',   textColor: 'text-gray-500'   },
};

export default function LearningPanel({ employeeId = 'EMP001' }) {
  const courses = allTraining[employeeId] || allTraining['EMP001'] || [];
  const mandatory = courses.filter(c => c.mandatory);
  const completed = mandatory.filter(c => c.status === 'completed').length;
  const overdue   = mandatory.filter(c => c.status === 'overdue').length;
  const compPct   = mandatory.length ? Math.round((completed / mandatory.length) * 100) : 100;

  return (
    <div className="overflow-y-auto p-6">
      <div className="text-base font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-200 flex items-center justify-between">
        My Learning — MyLearning Integration
        <span className="text-sm font-normal text-gray-500">{overdue} overdue · {mandatory.length - completed} outstanding</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: '📚 Total Assigned', val: courses.length, color: 'text-gray-800' },
          { label: '✅ Completed',       val: completed,       color: 'text-green-700' },
          { label: '⚠️ Overdue',         val: overdue,         color: 'text-red-600'   },
          { label: '📊 Compliance',      val: `${compPct}%`,  color: compPct >= 80 ? 'text-green-700' : 'text-red-600' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Course list */}
      <div className="flex flex-col gap-3">
        {courses.map(course => {
          const s = STATUS_STYLE[course.status] || STATUS_STYLE['not-started'];
          const badge = course.status === 'overdue'
            ? <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded">Overdue</span>
            : course.status === 'completed'
            ? <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded">Done ✓</span>
            : course.status === 'in-progress'
            ? <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">In Progress</span>
            : <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded">Not Started</span>;

          return (
            <div key={course.id} className={`${s.bg} border border-gray-200 rounded-xl px-4 py-3 flex gap-3 items-center`}>
              <div className="text-2xl flex-shrink-0">{s.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                  {course.title}
                  {course.mandatory && <span className="bg-gray-200 text-gray-600 text-xs px-1.5 py-0.5 rounded">Mandatory</span>}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{course.provider} · Due: {course.dueDate}</div>
                {course.status !== 'completed' && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div className={`h-full rounded-full ${s.barColor} progress-fill`} style={{ width: `${course.progress}%` }} />
                    </div>
                    <span className={`text-xs font-semibold ${s.textColor}`}>{course.progress}%</span>
                  </div>
                )}
              </div>
              <div className="flex-shrink-0 text-right">
                {badge}
                {course.completedDate && <div className="text-xs text-gray-400 mt-1">{course.completedDate}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
