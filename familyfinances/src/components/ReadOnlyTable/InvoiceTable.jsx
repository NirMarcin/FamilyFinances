import React, { useContext, useMemo } from "react";
import InvoiceContext from "../../contexts/InvoiceContext";

function InvoiceTable() {
  const { transactions, categories } = useContext(InvoiceContext);

  // Bieżący miesiąc i rok
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filtrowanie: tylko bieżący miesiąc i rok, sortowanie malejąco po dacie, max 10
  const visibleTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions
      .filter((tx) => {
        const dt = new Date(tx.date);
        return (
          dt.getMonth() === currentMonth && dt.getFullYear() === currentYear
        );
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  }, [transactions, currentMonth, currentYear]);

  const totalAmount = useMemo(
    () => visibleTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0),
    [visibleTransactions]
  );

  const monthName = now.toLocaleString("pl-PL", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="overflow-auto p-2">
      <h2 className="text-xl font-bold mb-2 text-center text-orange-700">
        Rachunki – {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
      </h2>
      <div className="border border-orange-300 rounded-lg shadow-md bg-white overflow-x-auto">
        <table className="w-full">
          <thead className="bg-orange-200 text-orange-900 font-semibold">
            <tr>
              <th className="px-4 py-2 border-b border-orange-300 text-left">
                Data
              </th>
              <th className="px-4 py-2 border-b border-orange-300 text-left">
                Kategoria
              </th>
              <th className="px-4 py-2 border-b border-orange-300 text-right">
                Kwota
              </th>
              <th className="px-4 py-2 border-b border-orange-300 text-left">
                Opis
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleTransactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  Brak transakcji w tym miesiącu.
                </td>
              </tr>
            ) : (
              visibleTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-orange-200">
                  <td className="px-4 py-2 whitespace-nowrap text-left align-middle">
                    {new Date(tx.date).toLocaleDateString("pl-PL")}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-left text-orange-700 font-medium align-middle">
                    {tx.category}
                  </td>
                  <td className="px-4 py-2 text-right whitespace-nowrap text-green-700 font-semibold align-middle">
                    {Number(tx.amount).toFixed(2)} zł
                  </td>
                  <td className="px-4 py-2 text-left align-middle">
                    {tx.description || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot className="bg-orange-100 font-semibold">
            <tr>
              <td colSpan={2} className="px-4 py-2 text-right">
                Razem:
              </td>
              <td className="px-4 py-2 text-right">
                {totalAmount.toFixed(2)} zł
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default InvoiceTable;
