import React, { useContext, useMemo, useState } from "react";
import ReceiptsContext from "../../contexts/ReceiptsContext";
import ModalDetails from "../modals/ModalDetails";
import calcProducts from "../../utils/calcProducts";
import UniversalTable from "../common/UniversalTable";
import LimitStatus from "../budgetLimitManager/LimitStatus";

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

  // SUMA wszystkich widocznych paragonów
  const totalSum = useMemo(
    () => visibleReceipts.reduce((sum, r) => sum + calcProducts(r.products), 0),
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
            key: "store",
            className: "text-orange-700 font-medium",
            render: (row) =>
              row.store === "Inny" ? row.customStoreName : row.store || "-",
          },
          {
            label: <span className="text-orange-900">Kwota</span>,
            key: "products",
            className: "text-red-600 font-semibold",
            render: (row) =>
              `${(-Math.abs(calcProducts(row.products))).toFixed(2)} zł`,
          },
        ]}
        data={visibleReceipts}
        emptyText="Brak paragonu"
        rowsCount={10}
        onRowClick={setSelectedReceipt}
        footer={
          <tr>
            <td colSpan={3} className="px-4 py-2 text-right">
              Suma ostatnich 10 paragonów:
            </td>
            <td className="px-4 py-2 text-right text-red-600 font-semibold">
              {(-Math.abs(totalSum)).toFixed(2)} zł
            </td>
          </tr>
        }
      />
      <LimitStatus type="receipts" label="Paragony" />
      {selectedReceipt && (
        <ModalDetails
          title={`Paragon: ${
            selectedReceipt.storeName || selectedReceipt.store || "-"
          }`}
          onClose={() => setSelectedReceipt(null)}
        >
          <div className="mb-4 text-gray-700">
            <div>
              <span className="font-semibold">Sklep: </span>
              {selectedReceipt.storeName ||
                (selectedReceipt.store === "Inny"
                  ? selectedReceipt.customStoreName
                  : selectedReceipt.store) ||
                "-"}
            </div>
            <div>
              <span className="font-semibold">Data: </span>
              {selectedReceipt.date
                ? new Date(selectedReceipt.date).toLocaleDateString("pl-PL")
                : "-"}
            </div>
          </div>
          <table className="w-full mb-4">
            <thead>
              <tr>
                <th className="border border-orange-300 p-3 text-left">
                  Produkt
                </th>
                <th className="border border-orange-300 p-3 text-left">
                  Kategoria
                </th>
                <th className="border border-orange-300 p-3 text-right">
                  Ilość
                </th>
                <th className="border border-orange-300 p-3 text-right">
                  Cena jednostkowa (zł)
                </th>
                <th className="border border-orange-300 p-3 text-right">
                  Suma produktu (zł)
                </th>
              </tr>
            </thead>
            <tbody>
              {(selectedReceipt.products || []).map((p, idx) => (
                <tr
                  key={p.id ?? idx}
                  className={idx % 2 === 1 ? "bg-orange-100" : ""}
                >
                  <td className="border border-orange-300 p-3">{p.name}</td>
                  <td className="border border-orange-300 p-3">{p.category}</td>
                  <td className="border border-orange-300 p-3 text-right">
                    {p.quantity}
                  </td>
                  <td className="border border-orange-300 p-3 text-right">
                    {p.unitPrice !== undefined && p.unitPrice !== null
                      ? Number(p.unitPrice).toFixed(2)
                      : "-"}
                  </td>
                  <td className="border border-orange-300 p-3 text-right">
                    {p.total !== undefined && p.total !== null
                      ? Number(p.total).toFixed(2)
                      : p.quantity && p.unitPrice
                      ? (Number(p.quantity) * Number(p.unitPrice)).toFixed(2)
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right font-bold text-orange-700 mb-2">
            Suma całkowita rachunku:{" "}
            {(selectedReceipt.products || [])
              .reduce(
                (sum, p) =>
                  sum +
                  (p.total !== undefined && p.total !== null
                    ? p.total
                    : (p.quantity ?? 0) * (p.unitPrice ?? 0)),
                0
              )
              .toFixed(2)}{" "}
            zł
          </div>
        </ModalDetails>
      )}
    </div>
  );
}

export default ReceiptsTable;
