import React, { useState } from 'react';
import MainLayout from './pages/MainLayout';

const USERS = {
  employee: { id: 'EMP001', name: 'Sarah Johnson', initials: 'SJ', role: 'Senior Consultant', dept: 'Cloud Solutions', isManager: false },
  manager:  { id: 'MGR001', name: 'Alex Rivera',   initials: 'AR', role: 'Delivery Manager',  dept: 'Cloud Solutions', isManager: true  },
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(USERS.employee);
  const [activeView, setActiveView]   = useState('chat');

  const toggleRole = () => {
    if (currentUser.isManager) {
      setCurrentUser(USERS.employee);
      setActiveView('chat');
    } else {
      setCurrentUser(USERS.manager);
      setActiveView('dashboard');
    }
  };

  return (
    <MainLayout
      currentUser={currentUser}
      activeView={activeView}
      setActiveView={setActiveView}
      toggleRole={toggleRole}
    />
  );
}
