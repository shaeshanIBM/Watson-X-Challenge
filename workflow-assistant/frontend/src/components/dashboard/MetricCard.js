import React from 'react';

export default function MetricCard({ title, value, sub, accent, onClick }) {
  const accentMap = { green: 'text-green-700', red: 'text-red-600', yellow: 'text-yellow-600', blue: 'text-blue-600', default: 'text-gray-800' };
  const color = accentMap[accent] || accentMap.default;
  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl p-4 ${onClick ? 'cursor-pointer hover:border-blue-400 hover:shadow-sm transition-all' : ''}`}
      onClick={onClick}
    >
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{title}</div>
      <div className={`text-3xl font-bold leading-none ${color}`}>{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1.5">{sub}</div>}
      {onClick && <div className="text-xs text-blue-400 mt-2">View details →</div>}
    </div>
  );
}
