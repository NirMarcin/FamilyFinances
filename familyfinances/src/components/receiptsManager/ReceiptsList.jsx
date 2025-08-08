import { useContext, useState } from "react";
import UniversalList from "../common/UniversalList";
import ReceiptsContext from "../../contexts/ReceiptsContext";
import ReceiptsEditForm from "./ReceiptsEditForm";
import ModalDetails from "../modals/ModalDetails";
import { capitalizeWords } from "../../utils/stringUtils";

export default function ReceiptsList({ onEdit }) {
  const { receipts, shops, receiptsCategories, editReceipt, deleteReceipt } =
    useContext(ReceiptsContext);

  const [selectedReceipt, setSelectedReceipt] = useState(null);

  return (
    <section className="mt-10 p-5 border border-gray-300 dark:border-gray-800 rounded-lg bg-orange-50 dark:bg-black shadow-inner transition-colors duration-300 dark:text-orange-300">
      <h2 className="text-2xl font-extrabold mb-6 text-orange-700 dark:text-orange-400 text-center">
        Ostatnie paragony
      </h2>
      <UniversalList
        data={[...receipts]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 10)}
        columns={[
          {
            key: "date",
            label: "Data",
            render: (item) =>
              typeof item.date === "string"
                ? item.date
                : item.date instanceof Date
                ? item.date.toISOString().slice(0, 10)
                : "",
          },
          {
            key: "store",
            label: "Sklep",
            render: (item) =>
              capitalizeWords(
                item.store === "Inny" ? item.customStoreName : item.store
              ),
          },
          {
            key: "products",
            label: "Suma paragonu (zł)",
            align: "text-right",
            render: (item) => {
              const sum = (item.products || []).reduce(
                (acc, p) =>
                  acc +
                  (p.total ??
                    (p.quantity && p.unitPrice ? p.quantity * p.unitPrice : 0)),
                0
              );
              return (
                <span className="text-orange-700 dark:text-orange-300 font-semibold">
                  {-Math.abs(sum).toFixed(2)} zł
                </span>
              );
            },
          },
        ]}
        onRowClick={setSelectedReceipt}
        editForm={(props) => (
          <ReceiptsEditForm
            {...props}
            shops={shops}
            categories={receiptsCategories}
            onSubmit={editReceipt}
            onCancel={props.onCancel}
          />
        )}
        onEdit={onEdit}
        onDelete={(item) => deleteReceipt(item.id)}
        deleteConfirmTitle="Potwierdź usunięcie"
        deleteConfirmMessage="Czy na pewno chcesz usunąć ten paragon?"
      />
      {selectedReceipt && (
        <ModalDetails
          title={`Paragon: ${
            selectedReceipt.store === "Inny"
              ? selectedReceipt.customStoreName
              : selectedReceipt.store || "-"
          }`}
          onClose={() => setSelectedReceipt(null)}
        >
          <div className="mb-4 text-gray-700 dark:text-orange-300">
            <div>
              <span className="font-semibold">Sklep: </span>
              {selectedReceipt.store === "Inny"
                ? selectedReceipt.customStoreName
                : selectedReceipt.store || "-"}
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
                <th className="border border-orange-300 dark:border-gray-800 p-3 text-left bg-orange-100 dark:bg-gray-900 text-orange-700 dark:text-orange-400">
                  Produkt
                </th>
                <th className="border border-orange-300 dark:border-gray-800 p-3 text-left bg-orange-100 dark:bg-gray-900 text-orange-700 dark:text-orange-400">
                  Kategoria
                </th>
                <th className="border border-orange-300 dark:border-gray-800 p-3 text-right bg-orange-100 dark:bg-gray-900 text-orange-700 dark:text-orange-400">
                  Ilość
                </th>
                <th className="border border-orange-300 dark:border-gray-800 p-3 text-right bg-orange-100 dark:bg-gray-900 text-orange-700 dark:text-orange-400">
                  Cena jednostkowa (zł)
                </th>
                <th className="border border-orange-300 dark:border-gray-800 p-3 text-right bg-orange-100 dark:bg-gray-900 text-orange-700 dark:text-orange-400">
                  Suma produktu (zł)
                </th>
              </tr>
            </thead>
            <tbody>
              {(selectedReceipt.products || []).map((p, idx) => (
                <tr
                  key={p.id ?? idx}
                  className={idx % 2 === 1 ? "bg-orange-100 dark:bg-gray-900" : ""}
                >
                  <td className="border border-orange-300 dark:border-gray-800 p-3 text-gray-900 dark:text-orange-300">{p.name}</td>
                  <td className="border border-orange-300 dark:border-gray-800 p-3 text-gray-900 dark:text-orange-300">{p.category}</td>
                  <td className="border border-orange-300 dark:border-gray-800 p-3 text-right text-gray-900 dark:text-orange-300">
                    {p.quantity}
                  </td>
                  <td className="border border-orange-300 dark:border-gray-800 p-3 text-right text-gray-900 dark:text-orange-300">
                    {p.unitPrice !== undefined && p.unitPrice !== null
                      ? Number(p.unitPrice).toFixed(2)
                      : "-"}
                  </td>
                  <td className="border border-orange-300 dark:border-gray-800 p-3 text-right text-gray-900 dark:text-orange-300">
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
          <div className="text-right font-bold text-orange-700 dark:text-orange-400 mb-2">
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
          <button
            className="bg-orange-300 hover:bg-orange-400 text-orange-900 dark:bg-orange-700 dark:hover:bg-orange-800 dark:text-orange-200 font-bold py-2 px-6 rounded shadow transition-colors duration-300"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedReceipt(null);
            }}
          >
            Zamknij
          </button>
        </ModalDetails>
      )}
    </section>
  );
}
