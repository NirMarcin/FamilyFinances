import React, { useContext, useMemo, useState } from "react";
import ReceiptsContext from "../../contexts/ReceiptsContext";
import ReceiptsModal from "../ReciptManager/ReceiptsModal";
import Button from "../Buttons/Button";
import calcTotal from "../../utils/calcTotal";

function ReceiptsTable() {
  const { receipts } = useContext(ReceiptsContext);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Bieżący miesiąc i rok
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filtrowanie: tylko bieżący miesiąc i rok, sortowanie malejąco po dacie, max 10
  const visibleReceipts = useMemo(() => {
    return receipts
      .filter((r) => {
        if (!r.date) return false;
        const dt = new Date(r.date);
        return (
          dt.getMonth() === currentMonth && dt.getFullYear() === currentYear
        );
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  }, [receipts, currentMonth, currentYear]);

  const totalSum = useMemo(
    () => visibleReceipts.reduce((sum, r) => sum + calcTotal(r.products), 0),
    [visibleReceipts]
  );

  const monthName = now.toLocaleString("pl-PL", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="overflow-auto p-2">
      <h2 className="text-xl font-bold mb-2 text-center text-orange-700">
        Paragony – {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
      </h2>
      <div className="border border-orange-300 rounded-lg shadow-md bg-white overflow-x-auto">
        <table className="w-full">
          <thead className="bg-orange-200 text-orange-900 font-semibold">
            <tr>
              <th className="px-4 py-2 border-b border-orange-300 text-left">
                Data
              </th>
              <th className="px-4 py-2 border-b border-orange-300 text-left">
                Sklep
              </th>
              <th className="px-4 py-2 border-b border-orange-300 text-right">
                Suma (zł)
              </th>
              <th className="px-4 py-2 border-b border-orange-300 text-left">
                Produkty
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleReceipts.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  Brak paragonów w tym miesiącu.
                </td>
              </tr>
            ) : (
              visibleReceipts.map((receipt) => (
                <tr
                  key={receipt.id}
                  className="border-b border-orange-200 align-top"
                >
                  <td className="px-4 py-2 whitespace-nowrap text-left align-middle">
                    {receipt.date
                      ? new Date(receipt.date).toLocaleDateString("pl-PL")
                      : ""}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-left text-orange-700 font-medium align-middle">
                    {receipt.storeName}
                  </td>
                  <td className="px-4 py-2 text-right whitespace-nowrap text-green-700 font-semibold align-middle">
                    {calcTotal(receipt.products).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center align-middle">
                    <Button
                      variant="secondary"
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                      onClick={() => setSelectedReceipt(receipt)}
                    >
                      Pokaż paragon
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot className="bg-orange-100 font-semibold">
            <tr>
              <td colSpan={2} className="text-right px-4 py-2">
                Razem:
              </td>
              <td className="text-right px-4 py-2">{totalSum.toFixed(2)} zł</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <ReceiptsModal
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        calcTotal={calcTotal}
      />
    </div>
  );
}

export default ReceiptsTable;
