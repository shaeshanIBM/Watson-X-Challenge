# WorkFlow Assistant — IBM WatsonX Challenge

> An AI-powered enterprise workforce management tool that gives IBM employees and delivery managers real-time visibility into timesheets, training compliance, utilization, availability, and team health — all in one place.

---

## 🎯 What It Does

WorkFlow Assistant replaces the need to juggle **Time@IBM**, **MyLearning**, **SuccessFactors**, and **MySA** separately. It surfaces the right information to the right person based on their role.

| Role | What They See |
|---|---|
| **Employee** | Their own chat assistant, personal notifications, my learning progress, their own utilization & availability |
| **Manager** | Full team dashboard, team utilization analytics, team availability forecast, clickable metric cards with inline dropdowns |

---

## ✨ Key Features

- **Role-based access** — Employees only see their own data. Manager nav items are hidden on the employee login. Switching roles is instant via the sidebar.
- **AI Chat Assistant** — Answers questions about timesheets, training, utilization, and availability using intent matching.
- **Manager Dashboard** — 6 metric cards with live computed values. Timesheets Submitted and Training Compliance cards expand inline to show exactly who is missing.
- **Clickable metric cards** — Avg Team Utilization navigates directly to the Utilization tab; Upcoming PTO navigates to Availability.
- **Utilization Analytics** — Weekly bar chart with colour-coded legends, team utilization bars, monthly breakdown.
- **Team Availability Forecast** — 4-week per-employee availability grid with PTO table.
- **My Learning** — Course compliance tracker with progress bars, overdue badges, and completion history.
- **Notifications** — Priority-ranked alerts (High / Medium / Low / Info) from all connected systems.

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### 1. Backend
```bash
cd workflow-assistant/backend
npm install
npm start
# API runs on http://localhost:4000
```

### 2. Frontend (new terminal)
```bash
cd workflow-assistant/frontend
npm install
npm start
# App runs on http://localhost:3000
```

---

## 👥 Demo Logins

Switch between roles using the **Switch** button at the bottom of the sidebar.

| Role | Name | ID |
|---|---|---|
| Employee | Sarah Johnson | EMP001 |
| Manager | Alex Rivera | MGR001 |

---

## 🗂 Project Structure

```
workflow-assistant/
├── backend/                  # Node.js + Express mock API
│   ├── server.js
│   ├── routes/               # employees, timesheets, training, utilization, chat, reports
│   ├── controllers/
│   ├── services/             # forecast, utilization, learning, notifications, reports
│   └── mock-data/            # employees, timesheets, training, utilization, vacations, notifications
│
└── frontend/                 # React 18 + Tailwind CSS
    └── src/
        ├── App.js            # Role state, login toggle
        ├── pages/
        │   └── MainLayout.js # Top-level layout, routes setActiveView to all panels
        ├── components/
        │   ├── Sidebar.js            # Role-gated nav
        │   ├── TopBar.js
        │   ├── chat/                 # ChatPanel, ChatMessage, chatEngine
        │   ├── dashboard/            # ManagerDashboard, MetricCard (with dropdown), AlertList, TeamTable
        │   ├── notifications/        # NotificationsPanel
        │   ├── learning/             # LearningPanel
        │   ├── utilization/          # UtilizationPanel (employee + manager views)
        │   └── availability/         # AvailabilityPanel (employee + manager views)
        └── data/
            └── mockData.js           # Single source of truth for all mock data
```

---

## 🏗 Architecture

```
React Frontend ──HTTP──▶ Express Backend ──reads──▶ Mock JSON Data
     │                         │
     │                   Services Layer
     │              (forecast, utilization,
     │               notifications, learning)
     │
  Chat Engine
  (client-side intent matching + API enrichment)
```

---

## 🔗 Simulated IBM System Integrations

| System | Data Provided |
|---|---|
| **Time@IBM** | Timesheets, submission status, holiday entries |
| **MyLearning** | Courses, progress, due dates, compliance score |
| **SuccessFactors** | Employee profiles, CV upload status |
| **MySA** | Utilization hours, billing targets, forecasting |

---

## 📡 API Endpoints (Mock)

| Method | Path | Description |
|---|---|---|
| GET | `/api/employees` | All employees |
| GET | `/api/timesheets/:employeeId` | Employee timesheets |
| GET | `/api/timesheets/missing` | All missing timesheets |
| GET | `/api/training/:employeeId` | Employee courses |
| GET | `/api/training/overdue/all` | All overdue training |
| GET | `/api/utilization/:employeeId` | Employee utilization |
| GET | `/api/utilization/team/:managerId` | Team utilization |
| GET | `/api/notifications/:employeeId` | Employee notifications |
| POST | `/api/chat` | AI chat response |
| GET | `/api/reports/manager/:managerId/weekly` | Weekly team report |

---

*Built for the IBM WatsonX Challenge · July 2026*
