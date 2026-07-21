import React from 'react';

const PRIORITY_STYLE = {
  high:   { bar: 'bg-red-500',    bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-800',    badge: 'bg-red-100 text-red-800'   },
  medium: { bar: 'bg-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', badge: 'bg-yellow-100 text-yellow-800' },
  low:    { bar: 'bg-green-500',  bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-800',  badge: 'bg-green-100 text-green-800' },
};

export default function AlertList({ alerts }) {
  if (!alerts || !alerts.length) return <p className="text-sm text-gray-400">No active alerts.</p>;
  return (
    <div className="flex flex-col gap-2">
      {alerts.map((alert, i) => {
        const s = PRIORITY_STYLE[alert.priority] || PRIORITY_STYLE.low;
        return (
          <div key={i} className={`flex gap-3 items-start px-3 py-2.5 rounded-lg border ${s.bg} ${s.border}`}>
            <span className="text-base mt-0.5">{alert.icon || '🔔'}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold leading-tight ${s.text}`}>{alert.title}</p>
              <p className={`text-xs mt-0.5 opacity-80 ${s.text}`}>{alert.desc}</p>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${s.badge}`}>
              {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
