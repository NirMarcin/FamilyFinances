import React, { useContext, useMemo, useState } from "react";
import InvoiceContext from "../../contexts/InvoiceContext";
import ModalDetails from "../modals/ModalDetails";
import UniversalTable from "../common/UniversalTable";

function InvoiceTable() {
  const { invoices } = useContext(InvoiceContext);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Bieżący miesiąc i rok
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filtrowanie: tylko bieżący miesiąc i rok, sortowanie malejąco po dacie, max 10
  const visibleInvoices = useMemo(() => {
    if (!invoices) return [];
    return invoices
      .filter((tx) => {
        const dt = new Date(tx.date);
        return (
          dt.getMonth() === currentMonth && dt.getFullYear() === currentYear
        );
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  }, [invoices, currentMonth, currentYear]);

  const totalAmount = useMemo(
    () => visibleInvoices.reduce((sum, tx) => sum + Number(tx.amount), 0),
    [visibleInvoices]
  );

  const monthName = now.toLocaleString("pl-PL", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-2">
      <h2 className="text-xl font-bold mb-2 text-center text-orange-700">
        Rachunki - {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
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
            label: <span className="text-orange-900">Kategoria</span>,
            key: "category",
            className: "text-orange-700 font-medium",
          },
          {
            label: <span className="text-orange-900">Kwota</span>,
            key: "amount",
            className: "text-red-600 font-semibold",
            render: (row) => `${Number(row.amount).toFixed(2)} zł`,
          },
        ]}
        data={visibleInvoices}
        emptyText="Brak wydatku"
        rowsCount={10}
        onRowClick={setSelectedInvoice}
        footer={
          <tr>
            <td colSpan={3} className="px-4 py-2 text-right">
              Suma ostatnich 10 rachunków:
            </td>
            <td className="px-4 py-2 text-right text-red-600 font-semibold">
              {totalAmount.toFixed(2)} zł
            </td>
          </tr>
        }
      />
      {selectedInvoice && (
        <ModalDetails
          title={`Rachunek: ${selectedInvoice.category || "-"}`}
          onClose={() => setSelectedInvoice(null)}
        >
          <div className="mb-4 text-gray-700">
            <div>
              <span className="font-semibold">Kategoria: </span>
              {selectedInvoice.category || "-"}
            </div>
            <div>
              <span className="font-semibold">Data: </span>
              {selectedInvoice.date
                ? new Date(selectedInvoice.date).toLocaleDateString("pl-PL")
                : "-"}
            </div>
            <div>
              <span className="font-semibold">Opis: </span>
              {selectedInvoice.description || "-"}
            </div>
            <div className="text-right font-bold text-red-600 mt-4">
              Kwota:{" "}
              <span className="text-red-600">
                {Number(selectedInvoice.amount).toFixed(2)} zł
              </span>
            </div>
          </div>
        </ModalDetails>
      )}
    </div>
  );
}

export default InvoiceTable;
