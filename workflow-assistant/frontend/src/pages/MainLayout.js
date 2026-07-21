import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import ChatPanel from '../components/chat/ChatPanel';
import ManagerDashboard from '../components/dashboard/ManagerDashboard';
import NotificationsPanel from '../components/notifications/NotificationsPanel';
import LearningPanel from '../components/learning/LearningPanel';
import UtilizationPanel from '../components/utilization/UtilizationPanel';
import AvailabilityPanel from '../components/availability/AvailabilityPanel';

const VIEWS = {
  chat:         ChatPanel,
  dashboard:    ManagerDashboard,
  notifications:NotificationsPanel,
  learning:     LearningPanel,
  utilization:  UtilizationPanel,
  availability: AvailabilityPanel,
};

export default function MainLayout({ currentUser, activeView, setActiveView, toggleRole }) {
  const ActiveComponent = VIEWS[activeView] || ChatPanel;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        currentUser={currentUser}
        activeView={activeView}
        setActiveView={setActiveView}
        toggleRole={toggleRole}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar activeView={activeView} currentUser={currentUser} />
        <div className="flex-1 overflow-hidden bg-gray-50">
          <ActiveComponent currentUser={currentUser} setActiveView={setActiveView} />
        </div>
      </div>
    </div>
  );
}
