import React from 'react';

const NAV = [
  { id: 'chat',         icon: '💬', label: 'Assistant Chat',    section: 'employee' },
  { id: 'notifications',icon: '🔔', label: 'Notifications',     section: 'employee', badge: 5 },
  { id: 'learning',     icon: '🎓', label: 'My Learning',       section: 'employee' },
  { id: 'dashboard',    icon: '📊', label: 'Team Dashboard',    section: 'manager'  },
  { id: 'utilization',  icon: '📈', label: 'Utilization',       section: 'manager'  },
  { id: 'availability', icon: '📅', label: 'Availability',      section: 'manager'  },
];

export default function Sidebar({ currentUser, activeView, setActiveView, toggleRole }) {
  return (
    <div className="w-56 min-w-56 bg-gray-900 text-gray-300 flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-700">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
          WA
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-100 leading-tight">WorkFlow Assistant</div>
          <div className="text-xs text-gray-500">IBM Enterprise AI</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2">
        {['employee', 'manager'].map(section => {
          // Hide manager section entirely when logged in as employee
          if (section === 'manager' && !currentUser.isManager) return null;
          const items = NAV.filter(n => n.section === section);
          return (
            <div key={section}>
              <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                {section}
              </div>
              {items.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${
                    activeView === item.id
                      ? 'bg-blue-600/20 text-blue-300 border-l-2 border-blue-400'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200 border-l-2 border-transparent'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-semibold">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-3 border-t border-gray-700 flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ backgroundColor: currentUser.isManager ? '#0f62fe' : '#6e40c9' }}
        >
          {currentUser.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-gray-200 truncate">{currentUser.name}</div>
          <div className="text-xs text-gray-500">{currentUser.isManager ? 'Manager' : 'Employee'}</div>
        </div>
        <button
          onClick={toggleRole}
          className="text-xs bg-gray-700 hover:bg-gray-600 text-blue-300 rounded px-2 py-1 flex-shrink-0 transition-colors"
        >
          Switch
        </button>
      </div>
    </div>
  );
}
