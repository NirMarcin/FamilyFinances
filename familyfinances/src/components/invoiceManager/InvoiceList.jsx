import { useContext } from "react";
import UniversalList from "../common/UniversalList";
import InvoiceEditForm from "./InvoiceEditForm";
import InvoiceContext from "../../contexts/InvoiceContext";

export default function InvoiceList() {
  const { invoices, categories, editInvoice, deleteInvoice } =
    useContext(InvoiceContext);

  if (!invoices.length) {
    return (
      <section className="mt-10 p-5 border border-gray-300 rounded-lg bg-orange-50 shadow-inner">
        <h2 className="text-2xl font-extrabold mb-6 text-orange-700 text-center">
          Ostatnie rachunki
        </h2>
        <p className="text-center text-gray-500">Brak dodanych transakcji.</p>
      </section>
    );
  }

  return (
    <section className="mt-10 p-5 border border-gray-300 rounded-lg bg-orange-50 shadow-inner">
      <h2 className="text-2xl font-extrabold mb-6 text-orange-700 text-center">
        Ostatnie rachunki
      </h2>
      <UniversalList
        data={[...invoices]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 10)}
        columns={[
          { key: "date", label: "Data" },
          { key: "category", label: "Kategoria" },
          {
            key: "amount",
            label: "Kwota (zł)",
            align: "text-right",
            render: (item) => (
              <span className="text-orange-700 font-semibold">
                {Number(item.amount).toFixed(2)} zł
              </span>
            ),
          },
          {
            key: "description",
            label: "Opis",
            render: (item) => (
              <span className="italic text-gray-600">
                {item.description || "-"}
              </span>
            ),
          },
          // temporary disabled!!!
          // {
          //   key: "isRecurring",
          //   label: "Cykliczna?",
          //   align: "text-center",
          //   render: (item) => (
          //     <input
          //       type="checkbox"
          //       checked={!!item.isRecurring}
          //       readOnly
          //       className="accent-orange-500 cursor-default"
          //       aria-label="Cykliczna?"
          //     />
          //   ),
          // },
        ]}
        editForm={(props) => (
          <InvoiceEditForm
            {...props}
            categories={categories.map((cat) =>
              typeof cat === "string" ? cat : cat.name
            )}
            onSubmit={editInvoice}
          />
        )}
        onEdit={editInvoice}
        onDelete={(item) => deleteInvoice(item.id)}
        deleteConfirmTitle="Potwierdź usunięcie"
        deleteConfirmMessage="Czy na pewno chcesz usunąć ten rachunek?"
      />
    </section>
  );
}
