import { useState } from 'react';
import { Table } from '@/lib/types';

interface DataTableProps {
  tables: Table[];
}

export default function DataTable({ tables }: DataTableProps) {
  const [activeTableIndex, setActiveTableIndex] = useState(0);

  if (!tables || tables.length === 0) {
    return null;
  }

  const activeTable = tables[activeTableIndex];

  const formatValue = (value: string | number): string => {
    if (typeof value === 'number') {
      // Format numbers with thousand separators
      if (value >= 1000) {
        return value.toLocaleString();
      }
      // Format percentages and decimals
      if (value < 1 && value > 0) {
        return value.toFixed(2);
      }
      return value.toString();
    }
    return value;
  };

  const formatColumnName = (column: string): string => {
    return column
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="mb-4">
      {/* Table tabs (only show if multiple tables) */}
      {tables.length > 1 && (
        <div className="mb-3">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-6">
              {tables.map((table, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTableIndex(index)}
                  className={`py-1.5 px-1 border-b-2 font-medium text-xs transition-colors duration-200 ${
                    index === activeTableIndex
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {table.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Table content */}
      <div className="bg-white border border-gray-200 rounded-lg swo-shadow overflow-hidden">
        <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-semibold text-black">{activeTable.name}</h3>
          <p className="text-xs text-gray-600">
            {activeTable.rows.length} rows • {activeTable.columns.length} columns
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {activeTable.columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {formatColumnName(column)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeTable.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50 transition-colors duration-150">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`px-3 py-2 whitespace-nowrap text-xs ${
                        typeof cell === 'number' 
                          ? 'text-right font-medium text-gray-900' 
                          : 'text-gray-900'
                      }`}
                    >
                      {formatValue(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table footer with summary */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Showing all {activeTable.rows.length} results
            {tables.length > 1 && (
              <span className="ml-2">
                • Table {activeTableIndex + 1} of {tables.length}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
