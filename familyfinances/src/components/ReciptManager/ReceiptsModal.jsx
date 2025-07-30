import React from "react";

export default function ReceiptsModal({ receipt, onClose, calcTotal }) {
  if (!receipt) return null;

  return (
    <div
      className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-2xl p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-3xl font-bold leading-none focus:outline-none"
          aria-label="Zamknij modal"
        >
          &times;
        </button>
        <h3
          id="modal-title"
          className="text-2xl font-bold mb-6 text-orange-700"
        >
          Paragon ze sklepu: {receipt.storeName}
        </h3>
        <p className="mb-6 text-gray-700">
          Data: {receipt.date.toLocaleDateString()}{" "}
          {receipt.date.toLocaleTimeString()}
        </p>

        <table className="w-full border border-orange-300 rounded-lg shadow">
          <thead className="bg-orange-200 text-orange-900 font-semibold">
            <tr>
              <th className="border border-orange-300 p-3 text-left">
                Produkt
              </th>
              <th className="border border-orange-300 p-3 text-left">
                Kategoria
              </th>
              <th className="border border-orange-300 p-3 text-right">
                Cena (zł)
              </th>
            </tr>
          </thead>
          <tbody>
            {receipt.products.map(({ name, category, price }, i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-orange-100 " : ""}>
                <td className="border border-orange-300 p-3">{name}</td>
                <td className="border border-orange-300 p-3">{category}</td>
                <td className="border border-orange-300 p-3 text-right">
                  {price.toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className="font-semibold bg-orange-300 text-orange-900">
              <td
                colSpan={2}
                className="border border-orange-300 p-3 text-right"
              >
                Suma:
              </td>
              <td className="border border-orange-300 p-3 text-right">
                {calcTotal(receipt.products)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
