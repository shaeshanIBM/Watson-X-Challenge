import React from 'react';
import { vacations, employees } from '../../data/mockData';

const AVAILABILITY = {
  EMP001: [{ label: 'Jul 20', type: 'full' }, { label: 'Jul 27', type: 'partial', hours: 30 }, { label: 'Aug 3', type: 'full' }, { label: 'Aug 10', type: 'full' }],
  EMP002: [{ label: 'Jul 20', type: 'full' }, { label: 'Jul 27', type: 'full' }, { label: 'Aug 3', type: 'pto' }, { label: 'Aug 10', type: 'pto' }],
  EMP003: [{ label: 'Jul 20', type: 'avail', hours: 15 }, { label: 'Jul 27', type: 'avail', hours: 20 }, { label: 'Aug 3', type: 'partial', hours: 30 }, { label: 'Aug 10', type: 'full' }],
  EMP004: [{ label: 'Jul 20', type: 'full' }, { label: 'Jul 27', type: 'full' }, { label: 'Aug 3', type: 'full' }, { label: 'Aug 10', type: 'full' }],
  EMP005: [{ label: 'Jul 20', type: 'avail', hours: 14 }, { label: 'Jul 27', type: 'partial', hours: 25 }, { label: 'Aug 3', type: 'full' }, { label: 'Aug 10', type: 'full' }],
  EMP006: [{ label: 'Jul 20', type: 'full' }, { label: 'Jul 27', type: 'full' }, { label: 'Aug 3', type: 'pto' }, { label: 'Aug 10', type: 'pto' }],
};

const TYPE_STYLE = {
  full:    { bg: 'bg-green-100 border-green-300 text-green-800', label: (w) => `${w.label} — Full` },
  partial: { bg: 'bg-yellow-100 border-yellow-300 text-yellow-800', label: (w) => `${w.label} — ${w.hours}h` },
  pto:     { bg: 'bg-red-100 border-red-200 text-red-700', label: (w) => `${w.label} — PTO` },
  avail:   { bg: 'bg-blue-100 border-blue-200 text-blue-700', label: (w) => `${w.label} — ${w.hours}h open` },
};

// ─── Employee view ────────────────────────────────────────────────────────────
function EmployeeAvailability({ currentUser }) {
  const emp = employees.find(e => e.id === currentUser.id) || employees[0];
  const weeks = AVAILABILITY[emp.id] || [];
  const myPTO = vacations.filter(v => v.employeeId === emp.id);

  const ptoWeeks   = weeks.filter(w => w.type === 'pto').length;
  const openHours  = weeks.filter(w => w.type === 'avail' || w.type === 'partial').reduce((s, w) => s + (w.hours || 0), 0);
  const fullWeeks  = weeks.filter(w => w.type === 'full').length;

  return (
    <div className="p-6">
      <div className="text-base font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-200 flex items-center justify-between">
        My Availability — Next 4 Weeks
        <span className="text-sm font-normal text-gray-500">{emp.role} · {emp.dept}</span>
      </div>

      {/* Personal summary metrics */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Fully Available', val: String(fullWeeks),  sub: 'weeks fully booked',      accent: 'text-green-700' },
          { label: 'PTO / Leave',     val: String(ptoWeeks),   sub: 'weeks on leave next 4wks', accent: ptoWeeks > 0 ? 'text-red-600' : 'text-gray-500' },
          { label: 'Open Hours',      val: openHours > 0 ? `${openHours}h` : '—', sub: 'available across partial weeks', accent: 'text-blue-600' },
        ].map(c => (
          <div key={c.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">{c.label}</div>
            <div className={`text-3xl font-bold ${c.accent}`}>{c.val}</div>
            <div className="text-xs text-gray-400 mt-1">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { type: 'full',    label: 'Fully Booked' },
          { type: 'avail',   label: 'Available'    },
          { type: 'partial', label: 'Partial'       },
          { type: 'pto',     label: 'PTO'           },
        ].map(l => (
          <span key={l.type} className={`text-xs font-semibold px-3 py-1 rounded-full border ${TYPE_STYLE[l.type].bg}`}>
            ■ {l.label}
          </span>
        ))}
      </div>

      {/* My forecast card */}
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex gap-3 items-start mb-5">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{ backgroundColor: emp.avatarColor }}
        >
          {emp.initials}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm text-gray-800">{emp.name}</div>
          <div className="text-xs text-gray-500 mb-2">{emp.role}</div>
          <div className="flex flex-wrap gap-1.5">
            {weeks.map((w, i) => {
              const s = TYPE_STYLE[w.type] || TYPE_STYLE.full;
              return (
                <span key={i} className={`text-xs font-semibold px-2 py-1 rounded border ${s.bg}`}>
                  {s.label(w)}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* My upcoming PTO */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">🏖 My Confirmed PTO — Next 90 Days</div>
        {myPTO.length === 0 ? (
          <p className="text-sm text-gray-400">No upcoming PTO on record.</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Type', 'From', 'To', 'Days', 'Status'].map(h => (
                  <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myPTO.map((v, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-3 py-2">{v.type}</td>
                  <td className="px-3 py-2">{v.startDate}</td>
                  <td className="px-3 py-2">{v.endDate}</td>
                  <td className="px-3 py-2">{v.days}d</td>
                  <td className="px-3 py-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${v.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── Manager view ─────────────────────────────────────────────────────────────
function ManagerAvailability() {
  const displayEmployees = employees.slice(0, 6);

  return (
    <div className="p-6">
      <div className="text-base font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-200 flex items-center justify-between">
        Team Availability Forecast — Next 4 Weeks
        <span className="text-sm font-normal text-gray-500">Cloud Solutions · 10 members</span>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Available Capacity', val: '6',  sub: 'Fully available next 2 weeks', accent: 'text-green-700' },
          { label: 'On PTO / Leave',     val: '4',  sub: 'Employees in August',           accent: 'text-red-600'   },
          { label: 'Open Hours (Team)',   val: '62h',sub: 'Available to assign next week', accent: 'text-blue-600'  },
        ].map(c => (
          <div key={c.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">{c.label}</div>
            <div className={`text-3xl font-bold ${c.accent}`}>{c.val}</div>
            <div className="text-xs text-gray-400 mt-1">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { type: 'full',    label: 'Fully Booked' },
          { type: 'avail',   label: 'Available'    },
          { type: 'partial', label: 'Partial'       },
          { type: 'pto',     label: 'PTO'           },
        ].map(l => (
          <span key={l.type} className={`text-xs font-semibold px-3 py-1 rounded-full border ${TYPE_STYLE[l.type].bg}`}>
            ■ {l.label}
          </span>
        ))}
      </div>

      {/* Team forecast cards */}
      <div className="flex flex-col gap-3">
        {displayEmployees.map(emp => {
          const weeks = AVAILABILITY[emp.id] || [];
          return (
            <div key={emp.id} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex gap-3 items-start">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: emp.avatarColor }}
              >
                {emp.initials}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-gray-800">{emp.name}</div>
                <div className="text-xs text-gray-500 mb-2">{emp.role}</div>
                <div className="flex flex-wrap gap-1.5">
                  {weeks.map((w, i) => {
                    const s = TYPE_STYLE[w.type] || TYPE_STYLE.full;
                    return (
                      <span key={i} className={`text-xs font-semibold px-2 py-1 rounded border ${s.bg}`}>
                        {s.label(w)}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming PTO table */}
      <div className="mt-5 bg-white border border-gray-200 rounded-xl p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">🏖 Confirmed PTO — Next 90 Days</div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              {['Employee', 'Type', 'From', 'To', 'Days', 'Status'].map(h => (
                <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vacations.map((v, i) => (
              <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">{v.name}</td>
                <td className="px-3 py-2">{v.type}</td>
                <td className="px-3 py-2">{v.startDate}</td>
                <td className="px-3 py-2">{v.endDate}</td>
                <td className="px-3 py-2">{v.days}d</td>
                <td className="px-3 py-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${v.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {v.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Entry point ──────────────────────────────────────────────────────────────
export default function AvailabilityPanel({ currentUser }) {
  if (currentUser && !currentUser.isManager) {
    return <EmployeeAvailability currentUser={currentUser} />;
  }
  return <ManagerAvailability />;
}
