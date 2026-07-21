// src/data/mockData.js
// Client-side mirror of backend mock data for offline/fallback use

export const employees = [
  { id: 'EMP001', name: 'Sarah Johnson', initials: 'SJ', role: 'Senior Consultant',  dept: 'Cloud Solutions', managerId: 'MGR001', cvUploaded: false, targetHours: 40, avatarColor: '#0f62fe' },
  { id: 'EMP002', name: 'David Kim',     initials: 'DK', role: 'Lead Engineer',       dept: 'Cloud Solutions', managerId: 'MGR001', cvUploaded: true,  targetHours: 40, avatarColor: '#6e40c9' },
  { id: 'EMP003', name: 'Marcus Chen',   initials: 'MC', role: 'Consultant',           dept: 'Cloud Solutions', managerId: 'MGR001', cvUploaded: true,  targetHours: 40, avatarColor: '#d97706' },
  { id: 'EMP004', name: 'Priya Patel',   initials: 'PP', role: 'Data Analyst',         dept: 'Cloud Solutions', managerId: 'MGR001', cvUploaded: true,  targetHours: 40, avatarColor: '#1a7f37' },
  { id: 'EMP005', name: "James O'Brien", initials: 'JO', role: 'Architect',            dept: 'Cloud Solutions', managerId: 'MGR001', cvUploaded: false, targetHours: 40, avatarColor: '#cf222e' },
  { id: 'EMP006', name: 'Lisa Torres',   initials: 'LT', role: 'Project Manager',      dept: 'Cloud Solutions', managerId: 'MGR001', cvUploaded: true,  targetHours: 40, avatarColor: '#0d6efd' },
  { id: 'EMP007', name: 'Aisha Williams',initials: 'AW', role: 'UX Designer',          dept: 'Cloud Solutions', managerId: 'MGR001', cvUploaded: false, targetHours: 40, avatarColor: '#0891b2' },
  { id: 'EMP008', name: 'Tom Nguyen',    initials: 'TN', role: 'DevOps Engineer',      dept: 'Cloud Solutions', managerId: 'MGR001', cvUploaded: true,  targetHours: 40, avatarColor: '#7c3aed' },
  { id: 'EMP009', name: 'Elena Russo',   initials: 'ER', role: 'Business Analyst',     dept: 'Cloud Solutions', managerId: 'MGR001', cvUploaded: true,  targetHours: 40, avatarColor: '#059669' },
  { id: 'EMP010', name: 'Carlos Mendez', initials: 'CM', role: 'Security Analyst',     dept: 'Cloud Solutions', managerId: 'MGR001', cvUploaded: true,  targetHours: 40, avatarColor: '#dc2626' },
];

export const timesheets = {
  EMP001: [
    { weekOf: '2026-07-20', submitted: false, hours: 0,  status: 'missing',  project: 'CloudOps Migration' },
    { weekOf: '2026-07-13', submitted: true,  hours: 40, status: 'approved', project: 'CloudOps Migration' },
    { weekOf: '2026-07-06', submitted: true,  hours: 38, status: 'approved', project: 'CloudOps Migration' },
    { weekOf: '2026-06-29', submitted: true,  hours: 36, status: 'approved', project: 'CloudOps Migration' },
  ],
  EMP002: [
    { weekOf: '2026-07-20', submitted: true,  hours: 40, status: 'pending',  project: 'Platform Modernisation' },
    { weekOf: '2026-07-13', submitted: true,  hours: 40, status: 'approved', project: 'Platform Modernisation' },
    { weekOf: '2026-07-06', submitted: true,  hours: 42, status: 'approved', project: 'Platform Modernisation' },
  ],
  EMP003: [
    { weekOf: '2026-07-20', submitted: false, hours: 0,  status: 'missing',  project: 'CloudOps Migration' },
    { weekOf: '2026-07-13', submitted: false, hours: 0,  status: 'missing',  project: 'CloudOps Migration' },
    { weekOf: '2026-07-06', submitted: true,  hours: 25, status: 'approved', project: 'CloudOps Migration' },
  ],
  EMP004: [
    { weekOf: '2026-07-20', submitted: false, hours: 0,  status: 'missing',  project: 'Data Analytics Platform' },
    { weekOf: '2026-07-13', submitted: true,  hours: 36, status: 'approved', project: 'Data Analytics Platform' },
    { weekOf: '2026-07-06', submitted: true,  hours: 38, status: 'approved', project: 'Data Analytics Platform' },
  ],
  EMP005: [
    { weekOf: '2026-07-20', submitted: false, hours: 0,  status: 'missing',  project: 'Enterprise Architecture' },
    { weekOf: '2026-07-13', submitted: true,  hours: 26, status: 'approved', project: 'Enterprise Architecture' },
    { weekOf: '2026-07-06', submitted: true,  hours: 28, status: 'approved', project: 'Enterprise Architecture' },
  ],
  EMP006: [
    { weekOf: '2026-07-20', submitted: true,  hours: 38, status: 'pending',  project: 'CloudOps Migration' },
    { weekOf: '2026-07-13', submitted: true,  hours: 40, status: 'approved', project: 'CloudOps Migration' },
  ],
  EMP007: [
    { weekOf: '2026-07-20', submitted: true,  hours: 32, status: 'pending',  project: 'UX Redesign' },
    { weekOf: '2026-07-13', submitted: true,  hours: 34, status: 'approved', project: 'UX Redesign' },
  ],
  EMP008: [
    { weekOf: '2026-07-20', submitted: true,  hours: 48, status: 'pending',  project: 'Infrastructure Automation' },
    { weekOf: '2026-07-13', submitted: true,  hours: 46, status: 'approved', project: 'Infrastructure Automation' },
  ],
  EMP009: [
    { weekOf: '2026-07-20', submitted: true,  hours: 35, status: 'pending',  project: 'Business Process Analysis' },
    { weekOf: '2026-07-13', submitted: true,  hours: 38, status: 'approved', project: 'Business Process Analysis' },
  ],
  EMP010: [
    { weekOf: '2026-07-20', submitted: true,  hours: 30, status: 'pending',  project: 'Security Assessment' },
    { weekOf: '2026-07-13', submitted: true,  hours: 32, status: 'approved', project: 'Security Assessment' },
  ],
};

export const training = {
  EMP001: [
    { id: 'C001', title: 'Data Privacy Essentials',          mandatory: true,  dueDate: '2026-06-30', progress: 20,  status: 'overdue',     provider: 'IBM Security' },
    { id: 'C002', title: 'Security Awareness 2026',          mandatory: true,  dueDate: '2026-07-01', progress: 0,   status: 'overdue',     provider: 'IBM Security' },
    { id: 'C003', title: 'Code of Conduct & Business Ethics',mandatory: true,  dueDate: '2026-07-31', progress: 60,  status: 'in-progress', provider: 'IBM Legal' },
    { id: 'C004', title: 'AI Ethics Fundamentals',           mandatory: true,  dueDate: '2026-08-15', progress: 45,  status: 'in-progress', provider: 'IBM AI Academy' },
    { id: 'C005', title: 'IBM Values & Culture',             mandatory: true,  dueDate: '2026-04-30', progress: 100, status: 'completed',   provider: 'IBM HR', completedDate: '2026-04-10' },
    { id: 'C006', title: 'Cybersecurity Basics',             mandatory: true,  dueDate: '2026-05-31', progress: 100, status: 'completed',   provider: 'IBM Security', completedDate: '2026-05-02' },
    { id: 'C007', title: 'Cloud Fundamentals',               mandatory: false, dueDate: '2026-10-31', progress: 100, status: 'completed',   provider: 'IBM Training', completedDate: '2026-03-14' },
    { id: 'C008', title: 'Agile Delivery Practices',         mandatory: false, dueDate: '2027-01-31', progress: 10,  status: 'not-started', provider: 'IBM iX' },
  ],
};

export const utilization = {
  EMP001: {
    weeklyHours: [
      { weekOf: '2026-06-29', billed: 36, target: 40 },
      { weekOf: '2026-07-06', billed: 38, target: 40 },
      { weekOf: '2026-07-13', billed: 40, target: 40 },
      { weekOf: '2026-07-20', billed: 34, target: 40 },
    ],
    monthlyHours: [
      { month: '2026-04', billed: 162, target: 160 },
      { month: '2026-05', billed: 158, target: 160 },
      { month: '2026-06', billed: 155, target: 160 },
      { month: '2026-07', billed: 136, target: 160, partial: true },
    ],
  },
};

export const teamUtilization = [
  { id: 'EMP001', name: 'Sarah Johnson', initials: 'SJ', avatarColor: '#0f62fe', hours: 34, target: 40, pct: 85  },
  { id: 'EMP002', name: 'David Kim',     initials: 'DK', avatarColor: '#6e40c9', hours: 40, target: 40, pct: 100 },
  { id: 'EMP003', name: 'Marcus Chen',   initials: 'MC', avatarColor: '#d97706', hours: 25, target: 40, pct: 62  },
  { id: 'EMP004', name: 'Priya Patel',   initials: 'PP', avatarColor: '#1a7f37', hours: 36, target: 40, pct: 90  },
  { id: 'EMP005', name: "James O'Brien", initials: 'JO', avatarColor: '#cf222e', hours: 26, target: 40, pct: 65  },
  { id: 'EMP006', name: 'Lisa Torres',   initials: 'LT', avatarColor: '#0d6efd', hours: 38, target: 40, pct: 95  },
  { id: 'EMP007', name: 'Aisha Williams',initials: 'AW', avatarColor: '#0891b2', hours: 32, target: 40, pct: 80  },
  { id: 'EMP008', name: 'Tom Nguyen',    initials: 'TN', avatarColor: '#7c3aed', hours: 48, target: 40, pct: 120 },
  { id: 'EMP009', name: 'Elena Russo',   initials: 'ER', avatarColor: '#059669', hours: 35, target: 40, pct: 88  },
  { id: 'EMP010', name: 'Carlos Mendez', initials: 'CM', avatarColor: '#dc2626', hours: 30, target: 40, pct: 75  },
];

export const vacations = [
  { employeeId: 'EMP002', name: 'David Kim',    type: 'PTO',     startDate: '2026-08-03', endDate: '2026-08-14', days: 10, status: 'approved' },
  { employeeId: 'EMP006', name: 'Lisa Torres',  type: 'PTO',     startDate: '2026-08-03', endDate: '2026-08-14', days: 10, status: 'approved' },
  { employeeId: 'EMP004', name: 'Priya Patel',  type: 'PTO',     startDate: '2026-08-17', endDate: '2026-08-21', days: 5,  status: 'approved' },
  { employeeId: 'EMP010', name: 'Carlos Mendez',type: 'PTO',     startDate: '2026-08-24', endDate: '2026-08-28', days: 5,  status: 'approved' },
  { employeeId: 'EMP001', name: 'Sarah Johnson',type: 'Medical', startDate: '2026-09-08', endDate: '2026-09-10', days: 3,  status: 'pending'  },
];

export const notifications = [
  { id: 'N001', priority: 'high',   title: 'Timesheet Reminder — Submit Today!',        description: 'You have not submitted your hours for the week of Jul 20. Timesheets are due today.', source: 'Time@IBM',       createdAt: '2026-07-21T08:00:00Z', read: false, actionLabel: 'Submit Now'   },
  { id: 'N002', priority: 'high',   title: 'Overdue Training: Data Privacy Essentials', description: 'This mandatory course was due Jun 30 and is now 21 days overdue.',                      source: 'MyLearning',     createdAt: '2026-07-21T08:05:00Z', read: false, actionLabel: 'Start Course' },
  { id: 'N003', priority: 'medium', title: 'CV Not Found in SuccessFactors',             description: 'Your CV has not been uploaded. Managers cannot assign you to new projects.',            source: 'SuccessFactors', createdAt: '2026-07-21T08:10:00Z', read: false, actionLabel: 'Upload CV'    },
  { id: 'N004', priority: 'medium', title: 'Upcoming Holiday: Civic Day',                description: 'Civic Day (Aug 3) is approaching. A draft timesheet entry has been prepared.',          source: 'Time@IBM',       createdAt: '2026-07-20T09:00:00Z', read: false, actionLabel: 'Review Draft' },
  { id: 'N005', priority: 'low',    title: 'Utilization Below Target This Week',         description: 'You billed 34h this week against a 40h target (85%). Review MySA assignments.',        source: 'MySA',           createdAt: '2026-07-20T17:00:00Z', read: false, actionLabel: null           },
  { id: 'N006', priority: 'info',   title: 'Timesheet Approved — Week of Jul 13',        description: 'Your timesheet for the week of Jul 13 (40 hours) has been approved.',                  source: 'Time@IBM',       createdAt: '2026-07-18T10:32:00Z', read: true,  actionLabel: null           },
];
