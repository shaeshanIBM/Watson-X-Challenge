import React from 'react';

const VIEW_TITLES = {
  chat:         'Assistant Chat',
  notifications:'Notifications Center',
  learning:     'My Learning',
  dashboard:    'Manager Dashboard',
  utilization:  'Utilization Analytics',
  availability: 'Team Availability Forecast',
};

const VIEW_SUB = 'Time@IBM · MyLearning · SuccessFactors · MySA';

export default function TopBar({ activeView, currentUser }) {
  return (
    <div className="h-13 bg-white border-b border-gray-200 px-6 flex items-center gap-3 flex-shrink-0" style={{ height: '52px' }}>
      <h1 className="text-base font-semibold text-gray-800">{VIEW_TITLES[activeView] || 'WorkFlow Assistant'}</h1>
      <span className="text-xs text-gray-400">— {VIEW_SUB}</span>
      <div className="ml-auto flex items-center gap-2">
        <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 font-medium">
          ● Connected
        </span>
        <span className="text-xs px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-500">
          Week of Jun 23, 2025
        </span>
      </div>
    </div>
  );
}
