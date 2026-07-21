# WorkFlow Assistant — IBM Enterprise AI Prototype

A full-stack enterprise AI assistant prototype simulating integration with **Time@IBM**, **MyLearning**, **SuccessFactors**, and **MySA**.

---

## 🗂 Project Structure

```
workflow-assistant/
├── backend/                  # Node.js + Express API
│   ├── server.js
│   ├── package.json
│   ├── routes/
│   │   ├── employees.js
│   │   ├── timesheets.js
│   │   ├── training.js
│   │   ├── utilization.js
│   │   ├── notifications.js
│   │   ├── chat.js
│   │   └── reports.js
│   ├── controllers/
│   │   ├── employeeController.js
│   │   ├── timesheetController.js
│   │   ├── trainingController.js
│   │   ├── utilizationController.js
│   │   ├── notificationController.js
│   │   ├── chatController.js
│   │   └── reportController.js
│   ├── services/
│   │   ├── forecastService.js
│   │   ├── notificationEngine.js
│   │   ├── utilizationService.js
│   │   ├── learningService.js
│   │   └── reportService.js
│   └── mock-data/
│       ├── employees.json
│       ├── timesheets.json
│       ├── training.json
│       ├── utilization.json
│       ├── vacations.json
│       └── notifications.json
└── frontend/                 # React + Tailwind CSS
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js
        ├── index.js
        ├── services/
        │   └── api.js
        ├── data/
        │   └── mockData.js
        ├── components/
        │   ├── Sidebar.js
        │   ├── TopBar.js
        │   ├── chat/
        │   │   ├── ChatPanel.js
        │   │   ├── ChatMessage.js
        │   │   └── chatEngine.js
        │   ├── dashboard/
        │   │   ├── ManagerDashboard.js
        │   │   ├── MetricCard.js
        │   │   ├── AlertList.js
        │   │   └── TeamTable.js
        │   ├── notifications/
        │   │   └── NotificationsPanel.js
        │   ├── learning/
        │   │   └── LearningPanel.js
        │   ├── utilization/
        │   │   ├── UtilizationPanel.js
        │   │   └── UtilizationChart.js
        │   └── availability/
        │       └── AvailabilityPanel.js
        ├── pages/
        │   └── MainLayout.js
        └── styles/
            └── index.css
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### 1. Clone / navigate to the project
```bash
cd workflow-assistant
```

### 2. Start the Backend
```bash
cd backend
npm install
npm start
# API server runs on http://localhost:4000
```

### 3. Start the Frontend (new terminal)
```bash
cd frontend
npm install
npm start
# React dev server runs on http://localhost:3000
```

---

## 🔑 Demo Credentials

| Role     | Name            | Employee ID | Notes                              |
|----------|-----------------|-------------|------------------------------------|
| Employee | Sarah Johnson   | EMP001      | Missing timesheet, overdue courses |
| Employee | David Kim       | EMP002      | On target, upcoming PTO Jul 7      |
| Employee | Marcus Chen     | EMP003      | 2 weeks missing, low utilization   |
| Employee | Priya Patel     | EMP004      | 1 week missing, 1 overdue course   |
| Employee | James O'Brien   | EMP005      | Missing CV, low utilization        |
| Manager  | Alex Rivera     | MGR001      | Team: Cloud Solutions (10 members) |
| Manager  | Diana Walsh     | MGR002      | Team: Data & AI (8 members)        |

> Switch roles using the **"Switch"** button in the sidebar.

---

## 📡 Mock API Endpoints

### Employees
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/employees` | All employees |
| GET | `/api/employees/:id` | Single employee |
| GET | `/api/employees/manager/:managerId` | Team by manager |

### Timesheets
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/timesheets/:employeeId` | Employee timesheets |
| POST | `/api/timesheets/:employeeId/submit` | Submit timesheet |
| GET | `/api/timesheets/missing` | All missing timesheets |
| GET | `/api/timesheets/forecast/:employeeId` | Forecast next week |

### Training
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/training/:employeeId` | Employee courses |
| GET | `/api/training/overdue/all` | All overdue courses |
| PATCH | `/api/training/:employeeId/:courseId/progress` | Update progress |

### Utilization
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/utilization/:employeeId` | Employee utilization |
| GET | `/api/utilization/team/:managerId` | Team utilization |
| GET | `/api/utilization/forecast/:employeeId` | Utilization forecast |

### Notifications
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/notifications/:employeeId` | Employee notifications |
| PATCH | `/api/notifications/:id/read` | Mark as read |

### Chat
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/chat` | Send message, get AI response |

### Reports
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/reports/manager/:managerId/weekly` | Weekly manager report |
| GET | `/api/reports/manager/:managerId/vacations` | Upcoming vacations |

---

## 🎭 Demo Flow

1. **Employee opens chat** → Bot greets with priority alerts
2. **Ask:** *"Did I submit my hours this week?"* → Shows timesheet gap
3. **Ask:** *"Forecast my hours for next week"* → 3-week average forecast
4. **Ask:** *"Add Independence Day to my timesheet"* → Draft holiday entry
5. **Ask:** *"Am I behind on training?"* → Overdue course list
6. **Switch to Manager** → Dashboard loads with team metrics
7. **Ask:** *"Who didn't submit time?"* → Missing timesheet report
8. **Ask:** *"Show team utilization"* → Full team breakdown
9. **Open Notifications** → Prioritised High/Med/Low alerts
10. **Open Availability** → 4-week team forecast

---

## ⚙️ Architecture

```
React Frontend  ──HTTP──▶  Express Backend  ──reads──▶  Mock JSON Data
     │                           │
     │                     Services Layer
     │                  (forecast, utilization,
     │                   notifications, learning)
     │
  Chat Engine (client-side intent matching + API enrichment)
```

---

## 🏗 Integrations Simulated

| System | Integration Type | Data |
|--------|-----------------|------|
| Time@IBM | Mock REST API | Timesheets, holiday entries |
| MyLearning | Mock REST API | Courses, progress, compliance |
| SuccessFactors | Mock REST API | Employee profiles, CVs |
| MySA | Mock REST API | Utilization, forecasting |
