import React from "react";

// Helper to convert array of objects to CSV string
function arrayToCsv(data, columns) {
  const header = columns.map((col) => col.label).join(",");
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const value =
          typeof col.render === "function" ? col.render(row) : row[col.key];
        // Remove HTML tags if present (for status column)
        return String(value)
          .replace(/<[^>]+>/g, "")
          .replace(/,/g, " ");
      })
      .join(",")
  );
  return [header, ...rows].join("\n");
}

export default function ExportSubsButton({
  data,
  columns,
  filename = "subskrypcje.csv",
}) {
  const handleExport = () => {
    const csv = arrayToCsv(data, columns);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return (
    <button
      onClick={handleExport}
      className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded shadow mb-4"
    >
      Eksportuj subskrypcje do CSV
    </button>
  );
}
