import React from 'react';
import { notifications } from '../../data/mockData';

const PRIORITY = {
  high:   { dot: 'bg-red-500',    bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-800',    badge: 'bg-red-100 text-red-800',    left: 'border-l-red-500'    },
  medium: { dot: 'bg-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', badge: 'bg-yellow-100 text-yellow-800', left: 'border-l-yellow-500' },
  low:    { dot: 'bg-green-500',  bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-800',  badge: 'bg-green-100 text-green-800',  left: 'border-l-green-500'  },
  info:   { dot: 'bg-blue-500',   bg: 'bg-white',     border: 'border-gray-200',   text: 'text-gray-700',   badge: 'bg-blue-100 text-blue-800',    left: 'border-l-blue-400'   },
};

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const SOURCE_ICON = { 'Time@IBM': '⏱', 'MyLearning': '🎓', 'SuccessFactors': '📄', 'MySA': '📊' };

export default function NotificationsPanel() {
  const unread = notifications.filter(n => !n.read);
  const read   = notifications.filter(n => n.read);

  const renderItem = (n) => {
    const s = PRIORITY[n.priority] || PRIORITY.info;
    return (
      <div key={n.id} className={`bg-white border ${s.border} ${!n.read ? `border-l-4 ${s.left}` : ''} rounded-lg px-4 py-3 flex gap-3 items-start cursor-pointer hover:shadow-sm transition-shadow mb-2`}>
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${s.dot}`} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-800 mb-0.5">{n.title}</p>
          <p className="text-xs text-gray-500 leading-relaxed">{n.description}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-gray-400">{SOURCE_ICON[n.source] || '🔔'} {n.source}</span>
            <span className="text-gray-300">·</span>
            <span className="text-xs text-gray-400">{formatTime(n.createdAt)}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.badge}`}>
            {n.priority.charAt(0).toUpperCase() + n.priority.slice(1)}
          </span>
          {n.actionLabel && (
            <button className="text-xs text-blue-600 hover:underline">{n.actionLabel} →</button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="text-base font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-200 flex items-center justify-between">
        Notifications Center
        <span className="text-sm font-normal text-gray-500">{unread.length} unread</span>
      </div>

      {unread.length > 0 && (
        <>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Today — Tuesday, Jul 21</div>
          {unread.map(renderItem)}
        </>
      )}

      {read.length > 0 && (
        <>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-4 mb-2">Earlier</div>
          {read.map(renderItem)}
        </>
      )}
    </div>
  );
}
