import React, { useState } from 'react';

export default function MetricCard({ title, value, sub, accent, onClick, dropdown }) {
  const [open, setOpen] = useState(false);
  const accentMap = { green: 'text-green-700', red: 'text-red-600', yellow: 'text-yellow-600', blue: 'text-blue-600', default: 'text-gray-800' };
  const color = accentMap[accent] || accentMap.default;
  const isClickable = onClick || dropdown;

  const handleClick = () => {
    if (dropdown) setOpen(o => !o);
    if (onClick) onClick();
  };

  return (
    <div
      className={`bg-white border rounded-xl p-4 transition-all ${isClickable ? 'cursor-pointer hover:shadow-sm' : ''} ${open ? 'border-blue-400' : 'border-gray-200'}`}
      onClick={handleClick}
    >
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{title}</div>
      <div className={`text-3xl font-bold leading-none ${color}`}>{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1.5">{sub}</div>}
      {dropdown && (
        <div className="text-xs text-blue-400 mt-2">{open ? 'Hide details ▲' : 'Show details ▼'}</div>
      )}
      {onClick && !dropdown && <div className="text-xs text-blue-400 mt-2">View details →</div>}

      {/* Inline dropdown */}
      {dropdown && open && (
        <div className="mt-3 pt-3 border-t border-gray-100" onClick={e => e.stopPropagation()}>
          {dropdown}
        </div>
      )}
    </div>
  );
}
