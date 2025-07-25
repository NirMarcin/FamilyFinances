import React from "react";
import { useExpenses } from "../contexts/ExpensesContext";

export default function ReadOnlyTable({ columns = [] }) {
  const { expenses, error } = useExpenses();

  if (error) {
    return (
      <p className="text-red-600 text-center py-4">
        Błąd ładowania wydatków: {error}
      </p>
    );
  }

  // Obliczenie sumy dla kolumny "amount"
  const sumAmount = expenses.reduce((sum, expense) => {
    const val = Number(expense.amount);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  return (
    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-orange-50 border-b border-orange-300">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="border-gray-300 px-5 py-3 text-left font-semibold text-orange-700 uppercase tracking-wide select-none whitespace-normal
                sm:px-3 sm:py-2 sm:text-sm"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {expenses.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center p-6 text-gray-400 italic select-none whitespace-normal"
              >
                Brak danych do wyświetlenia
              </td>
            </tr>
          ) : (
            <>
              {expenses.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className="even:bg-orange-50 hover:bg-orange-100 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.accessor}
                      className="border-b border-gray-100 px-5 py-4 text-gray-700 whitespace-normal
                    sm:px-3 sm:py-2 sm:text-sm"
                    >
                      {row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Wiersz sumujący */}
              <tr className="bg-orange-200 text-orange-900 font-semibold border-t-2 border-orange-400">
                {columns.map((col, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === columns.length - 1;

                  // Wspólne klasy dla komórek
                  let baseClasses =
                    "border-t border-orange-300 px-5 py-4 whitespace-normal sm:px-3 sm:py-2 sm:text-sm";

                  // Zaokrąglone rogi
                  if (isFirst) baseClasses += " rounded-l-lg";
                  if (isLast) baseClasses += " rounded-r-lg";

                  if (col.accessor === "amount") {
                    return (
                      <td
                        key={col.accessor}
                        className={baseClasses + " text-right"}
                      >
                        {sumAmount.toFixed(2)} zł
                      </td>
                    );
                  }

                  if (isFirst) {
                    return <td key={col.accessor} className={baseClasses}></td>;
                  }

                  // W wszystkich pozostałych komórkach pomiędzy pierwszą i ostatnią wypisujemy "Suma wszystkich wydatków:"
                  return (
                    <td key={col.accessor} className={baseClasses}>
                      Suma wszystkich wydatków:
                    </td>
                  );
                })}
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
