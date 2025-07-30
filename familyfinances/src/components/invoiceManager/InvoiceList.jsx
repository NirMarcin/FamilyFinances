import React, { useState } from "react";
import Button from "../buttons/Button";
import ModalConfirm from "../modals/ModalConfirm";

export default function InvoiceList({ transactions, onEdit, onDelete }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const handleDeleteClick = (tx) => {
    setToDelete(tx);
    setModalOpen(true);
  };

  const handleConfirm = () => {
    if (toDelete) onDelete(toDelete);
    setModalOpen(false);
    setToDelete(null);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setToDelete(null);
  };

  if (transactions.length === 0) {
    return (
      <p className="text-gray-600 italic text-center">
        Brak dodanych transakcji.
      </p>
    );
  }

  return (
    <>
      <table className="w-full border border-orange-300 rounded-lg shadow-md">
        <thead className="bg-orange-200 text-orange-900 font-semibold">
          <tr>
            <th className="border border-orange-300 p-3 text-left">Data</th>
            <th className="border border-orange-300 p-3 text-left">
              Kategoria
            </th>
            <th className="border border-orange-300 p-3 text-right">
              Kwota (zł)
            </th>
            <th className="border border-orange-300 p-3 text-left">Opis</th>
            <th className="border border-orange-300 p-3 text-center">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr
              key={tx.id ?? index}
              className="hover:bg-orange-100 transition-colors"
            >
              <td className="border border-orange-300 p-3">{tx.date}</td>
              <td className="border border-orange-300 p-3">{tx.category}</td>
              <td className="border border-orange-300 p-3 text-right">
                {Number(tx.amount).toFixed(2)} zł
              </td>
              <td className="border border-orange-300 p-3">
                {tx.description || "-"}
              </td>
              <td className="border border-orange-300 p-3 text-center">
                <div className="flex gap-2 justify-center">
                  <Button
                    type="button"
                    onClick={() => onEdit(tx)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow transition-colors"
                    title="Edytuj rachunek"
                  >
                    Edytuj
                  </Button>
                  <Button
                    variant="deleted"
                    type="button"
                    onClick={() => handleDeleteClick(tx)}
                    title="Usuń rachunek"
                  >
                    Usuń
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ModalConfirm
        isOpen={modalOpen}
        title="Potwierdź usunięcie"
        message="Czy na pewno chcesz usunąć ten rachunek?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}
