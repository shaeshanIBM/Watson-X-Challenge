import React from 'react';

export default function TeamTable({ columns, rows, emptyText = 'No data.' }) {
  if (!rows || !rows.length) return <p className="text-sm text-gray-400 py-2">{emptyText}</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50">
            {columns.map(col => (
              <th key={col.key} className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 border-b border-gray-100 last:border-0">
              {columns.map(col => (
                <td key={col.key} className="px-3 py-2 text-gray-700">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
