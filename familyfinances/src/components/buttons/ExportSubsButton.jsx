import React from "react";

// Helper to convert array of objects to CSV string
function arrayToCsv(data, columns) {
  const header = columns.map((col) => col.label).join(",");
  const rows = data.map((row) =>
    columns.map((col) => {
      let value;
      if (typeof col.render === "function") {
        const rendered = col.render(row);
        if (typeof rendered === "string" || typeof rendered === "number") {
          value = rendered;
        } else if (
          rendered &&
          typeof rendered === "object" &&
          rendered.props &&
          rendered.props.children
        ) {
          // Pobierz tekst z children, nawet jeśli to tablica
          if (typeof rendered.props.children === "string") {
            value = rendered.props.children;
          } else if (Array.isArray(rendered.props.children)) {
            value = rendered.props.children
              .map((child) =>
                typeof child === "string"
                  ? child
                  : child && child.props && child.props.children
                  ? child.props.children
                  : ""
              )
              .join(" ");
          } else {
            value = "";
          }
        } else {
          value = row[col.key];
        }
      } else {
        value = row[col.key];
      }
      // Usuń przecinki, nowe linie i HTML, jeśli są
      return String(value)
        .replace(/<[^>]+>/g, "")
        .replace(/,/g, " ")
        .replace(/\r?\n|\r/g, " ")
        .trim();
    }).join(",")
  );
  return [header, ...rows].join("\n");
}

export default function ExportSubsButton({
  data,
  columns,
  filename = "",
  buttonLabel = "",
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
      className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800 text-white dark:text-orange-200 font-semibold py-2 px-4 rounded shadow mb-4 transition-colors duration-300"
    >
      {buttonLabel}
    </button>
  );
}
