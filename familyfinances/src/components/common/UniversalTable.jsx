import React from "react";

function UniversalTable({
  columns,
  data,
  emptyText = "Brak danych",
  rowsCount,
  onRowClick,
  getRowKey,
  footer,
  onSort,
  sortKey,
  sortOrder,
}) {
  // Helper for row key
  const getKey = (row, idx) =>
    getRowKey ? getRowKey(row, idx) : row?.id ?? idx;

  // Build rows
  const rows = [];
  for (let i = 0; i < rowsCount; i++) {
    if (data[i]) {
      const row = data[i];
      rows.push(
        <tr
          key={getKey(row, i)}
          className={
            "border-b border-orange-200" +
            (onRowClick ? " cursor-pointer hover:bg-orange-50 transition" : "")
          }
          onClick={onRowClick ? () => onRowClick(row) : undefined}
          title={onRowClick ? "Kliknij, aby zobaczyć szczegóły" : undefined}
        >
          <td className="px-4 py-2 h-10 text-center align-middle font-semibold text-gray-500">
            {i + 1}
          </td>
          {columns.map((col) => (
            <td
              key={col.key}
              className={
                "px-4 py-2 h-10 whitespace-nowrap align-middle text-right " +
                (col.className || "")
              }
            >
              {col.render ? col.render(row) : row[col.key]}
            </td>
          ))}
        </tr>
      );
    } else {
      rows.push(
        <tr key={`empty-${i}`} className="border-b border-orange-100">
          <td className="px-4 py-2 h-10 text-center align-middle font-semibold text-gray-300">
            {i + 1}
          </td>
          {columns.map((col, cidx) => (
            <td
              key={col.key}
              className={
                "px-4 py-2 h-10 whitespace-nowrap align-middle text-right " +
                (col.className || "")
              }
            >
              {cidx === 0 ? (
                <span className="text-gray-400 italic">{emptyText}</span>
              ) : null}
            </td>
          ))}
        </tr>
      );
    }
  }

  return (
    <div className="border border-orange-300 rounded-lg shadow-md bg-white">
      <table className="w-full table-fixed text-xs">
        <thead className="bg-orange-200 text-orange-900 font-semibold">
          <tr>
            <th className="px-4 py-2 border-b border-orange-300 text-center w-8">
              #
            </th>
            {columns.map((col) => (
              <th
                key={col.key}
                className={
                  "px-4 py-2 border-b border-orange-300 text-right " +
                  (col.className || "") +
                  (col.sortable ? " cursor-pointer select-none" : "")
                }
                onClick={
                  col.sortable && onSort
                    ? () => onSort(col.key)
                    : undefined
                }
              >
                {col.label}
                {col.sortable && sortKey === col.key && (
                  <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
        {footer && (
          <tfoot className="bg-orange-100 font-semibold">{footer}</tfoot>
        )}
      </table>
    </div>
  );
}

export default UniversalTable;
