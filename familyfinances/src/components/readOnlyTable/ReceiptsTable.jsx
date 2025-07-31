import React, { useContext, useMemo, useState } from "react";
import ReceiptsContext from "../../contexts/ReceiptsContext";
import ModalDetails from "../modals/ModalDetails";
import calcTotal from "../../utils/calcTotal";
import UniversalTable from "./UniversalTable";

function ReceiptsTable() {
  const { receipts } = useContext(ReceiptsContext);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Bieżący miesiąc i rok
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filtrowanie: tylko bieżący miesiąc i rok, sortowanie malejąco po dacie, max 10
  const visibleReceipts = useMemo(() => {
    return (receipts || [])
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
    <div className="p-2">
      <h2 className="text-xl font-bold mb-2 text-center text-orange-700">
        Paragony - {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
      </h2>
      <UniversalTable
        columns={[
          {
            label: <span className="text-orange-900">Data</span>,
            key: "date",
            render: (row) =>
              row.date ? new Date(row.date).toLocaleDateString("pl-PL") : "-",
          },
          {
            label: <span className="text-orange-900">Sklep</span>,
            key: "storeName",
            className: "text-orange-700 font-medium",
          },
          {
            label: <span className="text-orange-900">Kwota</span>,
            key: "products",
            className: "text-red-600 font-semibold",
            render: (row) => `${(-Math.abs(calcTotal(row.products))).toFixed(2)} zł`,
          },
        ]}
        data={visibleReceipts}
        emptyText="Brak paragonu"
        rowsCount={10}
        onRowClick={setSelectedReceipt}
        footer={
          <tr>
            <td colSpan={3} className="px-4 py-2 text-right">
              Razem:
            </td>
            <td className="px-4 py-2 text-right text-red-600 font-semibold">
              {(-Math.abs(totalSum)).toFixed(2)} zł
            </td>
          </tr>
        }
      />
      <ModalDetails
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        calcTotal={calcTotal}
        forceNegativeTotal={true} // lub false, jeśli nie chcesz wymuszać minusa
      />
    </div>
  );
}

export default ReceiptsTable;
