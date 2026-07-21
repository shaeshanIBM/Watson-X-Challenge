import React from 'react';
import { teamUtilization, utilization } from '../../data/mockData';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, Cell
} from 'recharts';

const weeklyTrend = [
  { week: 'Jun 2',    billed: 36, target: 40 },
  { week: 'Jun 9',    billed: 38, target: 40 },
  { week: 'Jun 16',   billed: 40, target: 40 },
  { week: 'Jun 23',   billed: 34, target: 40 },
  { week: 'Jun 30 F', billed: 38, target: 40 },
];

// ─── Employee view ────────────────────────────────────────────────────────────
function EmployeeUtilization({ currentUser }) {
  const myData = utilization[currentUser.id] || utilization['EMP001'];
  const chartData = myData.weeklyHours.map(w => ({
    week: w.weekOf.slice(5),   // "MM-DD"
    billed: w.billed,
    target: w.target,
  }));
  const latest = myData.weeklyHours[myData.weeklyHours.length - 1];
  const mtd     = myData.monthlyHours[myData.monthlyHours.length - 1];
  const prevThree = myData.weeklyHours.slice(-3);
  const forecast  = Math.round(prevThree.reduce((s, w) => s + w.billed, 0) / prevThree.length);

  return (
    <div className="p-6">
      <div className="text-base font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-200 flex items-center justify-between">
        My Utilization — MySA Integration
        <span className="text-sm font-normal text-gray-500">Target: 40h/week · 85%</span>
      </div>

      {/* Personal summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'This Week',         val: `${latest.billed}h`, sub: `${Math.round((latest.billed / latest.target) * 100)}% of ${latest.target}h target`, accent: latest.billed >= 38 ? 'text-green-700' : 'text-yellow-600' },
          { label: 'This Month (MTD)',   val: `${mtd.billed}h`,   sub: `${Math.round((mtd.billed / mtd.target) * 100)}% · Target: ${mtd.target}h`,           accent: mtd.billed >= mtd.target * 0.85 ? 'text-green-700' : 'text-yellow-600' },
          { label: 'Forecast Next Week', val: `${forecast}h`,     sub: 'Avg of last 3 weeks',                                                                   accent: 'text-blue-600' },
        ].map(c => (
          <div key={c.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">{c.label}</div>
            <div className={`text-3xl font-bold ${c.accent}`}>{c.val}</div>
            <div className="text-xs text-gray-400 mt-1">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* My weekly trend chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">📅 My Weekly Trend — July 2026</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#6b7280' }} />
            <YAxis domain={[0, 50]} tick={{ fontSize: 11, fill: '#6b7280' }} />
            <Tooltip formatter={(v, n) => [`${v}h`, n === 'billed' ? 'Hours Billed' : 'Target']} />
            <ReferenceLine y={40} stroke="#d97706" strokeDasharray="4 4" label={{ value: 'Target', position: 'insideTopRight', fontSize: 10, fill: '#d97706' }} />
            <Bar dataKey="billed" radius={[3, 3, 0, 0]} name="billed">
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.week.includes('F') ? '#79b8ff' : entry.billed >= 38 ? '#22c55e' : '#f59e0b'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {/* Chart legend */}
        <div className="flex items-center gap-4 mt-3 pt-2 border-t border-gray-100 flex-wrap">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide mr-1">Bar colour:</span>
          <span className="flex items-center gap-1.5 text-xs text-gray-600"><span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#22c55e' }}></span>On target (≥38h)</span>
          <span className="flex items-center gap-1.5 text-xs text-gray-600"><span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#f59e0b' }}></span>Below target (&lt;38h)</span>
          <span className="flex items-center gap-1.5 text-xs text-gray-600"><span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#79b8ff' }}></span>Forecast (not yet billed)</span>
          <span className="flex items-center gap-1.5 text-xs text-gray-600"><span className="inline-block w-3 h-3 rounded-sm border" style={{ backgroundColor: 'transparent', borderColor: '#d97706', borderStyle: 'dashed' }}></span>Weekly target (40h)</span>
        </div>
      </div>

      {/* Monthly breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">📊 Monthly Breakdown</div>
        <div className="space-y-2.5">
          {myData.monthlyHours.map((m, i) => {
            const pct = Math.round((m.billed / m.target) * 100);
            const barColor = pct >= 100 ? 'bg-green-500' : pct >= 85 ? 'bg-yellow-500' : 'bg-red-500';
            const textColor = pct >= 100 ? 'text-green-700' : pct >= 85 ? 'text-yellow-600' : 'text-red-600';
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="w-20 text-xs text-gray-700 font-medium">{m.month}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(pct, 120)}%` }} />
                </div>
                <span className={`w-10 text-right text-xs font-bold ${textColor}`}>{m.billed}h</span>
                <span className={`w-12 text-xs ${textColor}`}>{pct}%{m.partial ? ' *' : ''}</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-2">* Partial month (in progress)</p>
      </div>
    </div>
  );
}

// ─── Manager view ─────────────────────────────────────────────────────────────
function ManagerUtilization() {
  const sorted = [...teamUtilization].sort((a, b) => b.pct - a.pct);
  const avg = Math.round(sorted.reduce((s, e) => s + e.pct, 0) / sorted.length);

  return (
    <div className="p-6">
      <div className="text-base font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-200 flex items-center justify-between">
        Utilization Analytics — MySA Integration
        <span className="text-sm font-normal text-gray-500">Target: 40h/week · 85%</span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'This Week',          val: '34h', sub: '85% of 40h target',  accent: 'text-yellow-600' },
          { label: 'This Month (MTD)',    val: '136h',sub: '85% · Target: 160h', accent: 'text-yellow-600' },
          { label: 'Forecast Next Week',  val: '38h', sub: 'Avg of last 3 weeks', accent: 'text-blue-600'   },
        ].map(c => (
          <div key={c.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">{c.label}</div>
            <div className={`text-3xl font-bold ${c.accent}`}>{c.val}</div>
            <div className="text-xs text-gray-400 mt-1">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Weekly trend chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">📅 Weekly Trend — July 2026</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weeklyTrend} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#6b7280' }} />
            <YAxis domain={[0, 50]} tick={{ fontSize: 11, fill: '#6b7280' }} />
            <Tooltip formatter={(v, n) => [`${v}h`, n === 'billed' ? 'Hours Billed' : 'Target']} />
            <ReferenceLine y={40} stroke="#d97706" strokeDasharray="4 4" label={{ value: 'Target', position: 'insideTopRight', fontSize: 10, fill: '#d97706' }} />
            <Bar dataKey="billed" radius={[3, 3, 0, 0]} name="billed">
              {weeklyTrend.map((entry, i) => (
                <Cell key={i} fill={entry.week.includes('F') ? '#79b8ff' : entry.billed >= 38 ? '#22c55e' : '#f59e0b'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {/* Chart legend */}
        <div className="flex items-center gap-4 mt-3 pt-2 border-t border-gray-100 flex-wrap">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide mr-1">Bar colour:</span>
          <span className="flex items-center gap-1.5 text-xs text-gray-600"><span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#22c55e' }}></span>On target (≥38h)</span>
          <span className="flex items-center gap-1.5 text-xs text-gray-600"><span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#f59e0b' }}></span>Below target (&lt;38h)</span>
          <span className="flex items-center gap-1.5 text-xs text-gray-600"><span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#79b8ff' }}></span>Forecast (not yet billed)</span>
          <span className="flex items-center gap-1.5 text-xs text-gray-600"><span className="inline-block w-3 h-3 rounded-sm border" style={{ backgroundColor: 'transparent', borderColor: '#d97706', borderStyle: 'dashed' }}></span>Weekly target (40h)</span>
        </div>
      </div>

      {/* Team utilization bars */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">📊 Team Utilization — Week of Jul 20</div>
        {/* Team bars legend */}
        <div className="flex items-center gap-4 mb-3 pb-2 border-b border-gray-100 flex-wrap">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide mr-1">Bar colour:</span>
          <span className="flex items-center gap-1.5 text-xs text-gray-600"><span className="inline-block w-3 h-3 rounded-full bg-orange-500"></span>Overutilized (&gt;110%)</span>
          <span className="flex items-center gap-1.5 text-xs text-gray-600"><span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>On target (≥85%)</span>
          <span className="flex items-center gap-1.5 text-xs text-gray-600"><span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>Slightly low (70–84%)</span>
          <span className="flex items-center gap-1.5 text-xs text-gray-600"><span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>Underutilized (&lt;70%)</span>
        </div>
        <div className="space-y-2.5">
          {sorted.map(emp => {
            const barColor = emp.pct > 110 ? 'bg-orange-500' : emp.pct >= 85 ? 'bg-green-500' : emp.pct >= 70 ? 'bg-yellow-500' : 'bg-red-500';
            const textColor = emp.pct > 110 ? 'text-orange-600' : emp.pct >= 85 ? 'text-green-700' : emp.pct >= 70 ? 'text-yellow-600' : 'text-red-600';
            const statusLabel = emp.pct > 110 ? '↑↑' : emp.pct >= 85 ? '✓' : emp.pct >= 70 ? '~' : '↓';
            return (
              <div key={emp.id} className="flex items-center gap-3">
                <span className="w-28 text-xs text-gray-700 font-medium truncate">{emp.name.split(' ')[0]} {emp.name.split(' ')[1]?.charAt(0)}.</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(emp.pct, 120)}%` }} />
                </div>
                <span className={`w-10 text-right text-xs font-bold ${textColor}`}>{emp.hours}h</span>
                <span className={`w-14 text-xs ${textColor}`}>{emp.pct}% {statusLabel}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 text-right">
          Team average: <strong>{avg}%</strong> · Target: 85%
        </div>
      </div>
    </div>
  );
}

// ─── Entry point ──────────────────────────────────────────────────────────────
export default function UtilizationPanel({ currentUser }) {
  if (currentUser && !currentUser.isManager) {
    return <EmployeeUtilization currentUser={currentUser} />;
  }
  return <ManagerUtilization />;
}
