// src/components/chat/chatEngine.js
// Client-side NLP intent engine — matches natural language to structured responses.
// Mirrors the backend chatController for instant responses (no network latency).

import { timesheets, training, employees, teamUtilization, vacations } from '../../data/mockData';

const CURRENT_WEEK = '2025-06-23';

function forecastHours(empId) {
  const sheets = (timesheets[empId] || []).filter(s => s.submitted && s.hours > 0);
  if (!sheets.length) return { hours: 40, basis: 'default' };
  const recent = sheets.slice(0, 3);
  const weights = [0.5, 0.3, 0.2];
  let weighted = 0, totalW = 0;
  recent.forEach((s, i) => { const w = weights[i] || 0.1; weighted += s.hours * w; totalW += w; });
  return { hours: Math.round(weighted / totalW), basis: `${recent.length}-week weighted avg`, weeks: recent };
}

export function processIntent(message, currentUser) {
  const m = message.toLowerCase();
  const empId = currentUser.id;
  const emp = employees.find(e => e.id === empId) || employees[0];
  const isManager = currentUser.isManager;

  // ── TIMESHEET STATUS ──
  if (/submit.*hour|fill.*hour|timesheet.*week|did i.*hours|my hours|hours.*week/.test(m)) {
    const sheets = timesheets[empId] || [];
    const thisWeek = sheets.find(s => s.weekOf === CURRENT_WEEK);
    const submitted = thisWeek?.submitted ?? false;
    const rows = sheets.map(s => `
      <tr>
        <td class="px-3 py-2">${s.weekOf}</td>
        <td class="px-3 py-2">${s.submitted ? '✅ Submitted' : '❌ Missing'}</td>
        <td class="px-3 py-2">${s.hours ? `${s.hours}h` : '—'}</td>
        <td class="px-3 py-2">${s.status}</td>
      </tr>`).join('');
    return {
      intent: 'timesheet_status',
      html: `
        <p class="font-semibold mb-2">📋 Timesheet Status — Week of Jun 23, 2025</p>
        ${!submitted ? `<div class="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3 text-red-800 text-sm">⚠️ <strong>Not submitted.</strong> Today is Friday — timesheets are due by end of business.</div>` : `<div class="bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-3 text-green-800 text-sm">✅ Submitted for this week (${thisWeek.hours}h — ${thisWeek.status})</div>`}
        <table class="w-full text-sm border-collapse mt-2">
          <thead><tr class="bg-gray-50"><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Week Of</th><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Status</th><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Hours</th><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Approval</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>`
    };
  }

  // ── FORECAST ──
  if (/forecast|next week.*hours|predict.*hours|hours.*next week/.test(m)) {
    const fc = forecastHours(empId);
    const weekRows = (fc.weeks || []).map(w => `<tr><td class="px-3 py-2">${w.weekOf}</td><td class="px-3 py-2">${w.hours}h</td></tr>`).join('');
    return {
      intent: 'forecast',
      html: `
        <p class="font-semibold mb-2">🔮 Hour Forecast — Week of Jun 30, 2025</p>
        <table class="w-full text-sm border-collapse mb-3">
          <thead><tr class="bg-gray-50"><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Basis</th><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Value</th></tr></thead>
          <tbody>
            <tr><td class="px-3 py-2">${fc.basis}</td><td class="px-3 py-2 font-bold">${fc.hours}h</td></tr>
            ${weekRows}
          </tbody>
        </table>
        <div class="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-blue-800 text-sm">💡 Pre-fill a draft timesheet for <strong>${fc.hours}h</strong> on CloudOps Project?</div>`
    };
  }

  // ── HOLIDAY ──
  if (/holiday|labor day|independence|thanksgiving|add.*holiday/.test(m)) {
    const isLabor = m.includes('labor');
    const isIndep = m.includes('independence');
    const name = isLabor ? 'Labor Day' : isIndep ? 'Independence Day' : 'Next Public Holiday';
    const date = isLabor ? 'Sep 1, 2025' : 'Jul 4, 2025';
    return {
      intent: 'add_holiday',
      html: `
        <p class="font-semibold mb-2">📅 Holiday Timesheet Entry</p>
        <table class="w-full text-sm border-collapse mb-3">
          <thead><tr class="bg-gray-50"><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Field</th><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Value</th></tr></thead>
          <tbody>
            <tr><td class="px-3 py-2">Holiday</td><td class="px-3 py-2 font-semibold">${name}</td></tr>
            <tr><td class="px-3 py-2">Date</td><td class="px-3 py-2">${date}</td></tr>
            <tr><td class="px-3 py-2">Hours</td><td class="px-3 py-2">8h</td></tr>
            <tr><td class="px-3 py-2">Category</td><td class="px-3 py-2">IBM US Holiday</td></tr>
            <tr><td class="px-3 py-2">Status</td><td class="px-3 py-2"><span class="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded">Draft</span></td></tr>
          </tbody>
        </table>
        <div class="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-green-800 text-sm">✅ Draft entry created in Time@IBM. Review and submit when ready.</div>`
    };
  }

  // ── UTILIZATION ──
  if (/utilization|utilisation|hours.*month|month.*hours/.test(m)) {
    return {
      intent: 'utilization',
      html: `
        <p class="font-semibold mb-2">📈 Your Utilization — June 2025</p>
        <table class="w-full text-sm border-collapse mb-3">
          <thead><tr class="bg-gray-50"><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Period</th><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Billed</th><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Target</th><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Rate</th></tr></thead>
          <tbody>
            <tr><td class="px-3 py-2">This week (Jun 23)</td><td class="px-3 py-2">34h</td><td class="px-3 py-2">40h</td><td class="px-3 py-2 text-yellow-600 font-semibold">85%</td></tr>
            <tr><td class="px-3 py-2">June MTD</td><td class="px-3 py-2">136h</td><td class="px-3 py-2">160h</td><td class="px-3 py-2 text-yellow-600 font-semibold">85%</td></tr>
            <tr><td class="px-3 py-2">Forecast Jun 30</td><td class="px-3 py-2">~174h</td><td class="px-3 py-2">160h</td><td class="px-3 py-2 text-green-700 font-semibold">109%</td></tr>
          </tbody>
        </table>
        <div class="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-blue-800 text-sm">📊 On track to meet June target. Weekly average: 37h (93%).</div>`
    };
  }

  // ── TRAINING ──
  if (/training|learning|course|overdue|mandatory.*learn|behind.*train/.test(m)) {
    const courses = training[empId] || training['EMP001'];
    const overdue = courses.filter(c => c.mandatory && c.status === 'overdue');
    const rows = courses.map(c => {
      const badge = c.status === 'completed'   ? `<span class="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded">✓ Done</span>`
                  : c.status === 'overdue'     ? `<span class="bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded">Overdue</span>`
                  : c.status === 'in-progress' ? `<span class="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded">${c.progress}%</span>`
                  : `<span class="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded">Not Started</span>`;
      return `<tr><td class="px-3 py-2">${c.title}</td><td class="px-3 py-2">${c.mandatory ? '✓' : ''}</td><td class="px-3 py-2">${c.dueDate}</td><td class="px-3 py-2">${badge}</td></tr>`;
    }).join('');
    return {
      intent: 'training_status',
      html: `
        <p class="font-semibold mb-2">🎓 Your Learning Status — MyLearning</p>
        ${overdue.length > 0 ? `<div class="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3 text-red-800 text-sm">🚨 <strong>${overdue.length} mandatory course(s) overdue:</strong> ${overdue.map(c => c.title).join(', ')}. Complete immediately.</div>` : ''}
        <table class="w-full text-sm border-collapse">
          <thead><tr class="bg-gray-50"><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Course</th><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Mandatory</th><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Due</th><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Status</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>`
    };
  }

  // ── CV STATUS ──
  if (/cv|resume|curriculum vitae|profile.*upload|upload.*cv/.test(m)) {
    const uploaded = emp?.cvUploaded ?? false;
    return {
      intent: 'cv_status',
      html: `
        <p class="font-semibold mb-2">📄 CV Status — SuccessFactors</p>
        ${uploaded
          ? `<div class="bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-3 text-green-800 text-sm">✅ CV uploaded in SuccessFactors (last updated: ${emp.cvLastUpdated || 'Recently'}).</div>`
          : `<div class="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3 text-red-800 text-sm">⚠️ <strong>No CV found</strong> in your SuccessFactors profile.</div>
             <p class="text-sm mb-2">Missing a CV means:</p>
             <ul class="text-sm list-disc list-inside space-y-1 mb-3">
               <li>Staffing teams cannot match you to new projects</li>
               <li>Your profile appears incomplete to managers</li>
               <li>Proposal teams cannot use your credentials</li>
             </ul>`
        }
        <div class="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-blue-800 text-sm">💡 Go to SuccessFactors → My Profile → Documents to upload your CV.</div>`
    };
  }

  // ── MANAGER: missing timesheets ──
  if (/who.*didn.*submit|missing.*timesheet|no.*timesheet|team.*timesheet/.test(m)) {
    const missing = employees.filter(e => { const s = timesheets[e.id] || []; const w = s.find(x => x.weekOf === CURRENT_WEEK); return w && !w.submitted; });
    const rows = missing.map(e => {
      const s = timesheets[e.id] || [];
      const weeks = s.filter(x => !x.submitted).length;
      const badge = weeks > 1 ? `<span class="bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded">Missing ${weeks}wks</span>` : `<span class="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded">Missing 1wk</span>`;
      return `<tr><td class="px-3 py-2">${e.name}</td><td class="px-3 py-2">${e.role}</td><td class="px-3 py-2">${badge}</td></tr>`;
    }).join('');
    return {
      intent: 'manager_missing_timesheets',
      html: `
        <p class="font-semibold mb-2">⏱ Missing Timesheet Report — Week of Jun 23</p>
        <table class="w-full text-sm border-collapse mb-3">
          <thead><tr class="bg-gray-50"><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Employee</th><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Role</th><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Status</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-yellow-800 text-sm">📧 Send automated reminders to ${missing.length} employee(s)?</div>`
    };
  }

  // ── MANAGER: team utilization ──
  if (/team.*util|show.*util|utilization.*team|who.*under|underutil/.test(m)) {
    const sorted = [...teamUtilization].sort((a, b) => b.pct - a.pct);
    const avg = Math.round(sorted.reduce((s, e) => s + e.pct, 0) / sorted.length);
    const rows = sorted.map(e => {
      const color = e.pct >= 90 ? 'text-green-700' : e.pct >= 75 ? 'text-yellow-600' : 'text-red-600';
      return `<tr><td class="px-3 py-2">${e.name}</td><td class="px-3 py-2">${e.hours}h</td><td class="px-3 py-2 font-semibold ${color}">${e.pct}%</td></tr>`;
    }).join('');
    return {
      intent: 'team_utilization',
      html: `
        <p class="font-semibold mb-2">📊 Team Utilization — Week of Jun 23</p>
        <table class="w-full text-sm border-collapse mb-3">
          <thead><tr class="bg-gray-50"><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Employee</th><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Hours</th><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Rate</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <p class="text-sm text-gray-500">Team average: <strong>${avg}%</strong> · Target: 85%</p>`
    };
  }

  // ── MANAGER: overdue training ──
  if (/overdue.*training|mandatory.*training|who.*training|training.*overdue/.test(m)) {
    const overdue = [];
    employees.forEach(e => { const courses = training[e.id] || []; courses.filter(c => c.mandatory && c.status === 'overdue').forEach(c => overdue.push({ name: e.name, course: c.title, dueDate: c.dueDate })); });
    const rows = overdue.map(o => `<tr><td class="px-3 py-2">${o.name}</td><td class="px-3 py-2">${o.course}</td><td class="px-3 py-2"><span class="bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded">${o.dueDate}</span></td></tr>`).join('');
    return {
      intent: 'manager_training',
      html: `
        <p class="font-semibold mb-2">🎓 Team Training Compliance — Overdue Mandatory</p>
        <table class="w-full text-sm border-collapse mb-3">
          <thead><tr class="bg-gray-50"><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Employee</th><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Course</th><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Due Date</th></tr></thead>
          <tbody>${rows || '<tr><td colspan="3" class="px-3 py-2 text-gray-400">No overdue training found.</td></tr>'}</tbody>
        </table>
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-yellow-800 text-sm">📧 Send compliance reminders to all ${[...new Set(overdue.map(o => o.name))].length} affected employee(s)?</div>`
    };
  }

  // ── MANAGER: vacations ──
  if (/vacation|pto|leave|upcoming.*availab|show.*vacation/.test(m)) {
    const rows = vacations.map(v => `<tr><td class="px-3 py-2">${v.name}</td><td class="px-3 py-2">${v.type}</td><td class="px-3 py-2">${v.startDate} → ${v.endDate}</td><td class="px-3 py-2">${v.days}d</td><td class="px-3 py-2"><span class="${v.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} text-xs font-semibold px-2 py-0.5 rounded">${v.status}</span></td></tr>`).join('');
    return {
      intent: 'upcoming_vacations',
      html: `
        <p class="font-semibold mb-2">🏖 Upcoming Team Vacations</p>
        <table class="w-full text-sm border-collapse mb-3">
          <thead><tr class="bg-gray-50"><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Employee</th><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Type</th><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Dates</th><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Days</th><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">Status</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-blue-800 text-sm">📋 David Kim and Lisa Torres are both out Jul 7–18. Review project milestones for that period.</div>`
    };
  }

  // ── FALLBACK ──
  return {
    intent: 'help',
    html: `
      <p class="font-semibold mb-3">I can help you with:</p>
      <ul class="space-y-2 text-sm">
        <li>⏱ <strong>Time@IBM</strong> — Submit hours, forecast next week, add holidays, check utilization</li>
        <li>🎓 <strong>MyLearning</strong> — Outstanding training, compliance status, progress</li>
        <li>📄 <strong>SuccessFactors</strong> — CV status, profile updates</li>
        <li>📊 <strong>MySA</strong> — Utilization tracking and forecasting</li>
        <li>👥 <strong>Team Reports</strong> — Missing timesheets, training compliance, vacations</li>
      </ul>
      <p class="text-sm text-gray-500 mt-3">Try: <em>"Did I submit my hours?"</em> or <em>"Who has overdue training?"</em></p>`
  };
}
