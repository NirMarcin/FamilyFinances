import React, { useState } from "react";
import { capitalizeWords } from "../../utils/stringUtils";
import Button from "../buttons/Button";
import ModalConfirm from "../modals/ModalConfirm";

export function ReceiptsList({
  receipts,
  onOpenModal,
  calcTotal,
  onDelete,
  onEdit,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  const handleDeleteClick = (id) => {
    setToDeleteId(id);
    setModalOpen(true);
  };

  const handleConfirm = () => {
    if (toDeleteId) onDelete(toDeleteId);
    setModalOpen(false);
    setToDeleteId(null);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setToDeleteId(null);
  };

  const handleEditClick = (id) => {
    if (onEdit) onEdit(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (receipts.length === 0) {
    return (
      <p className="text-gray-600 italic text-center">
        Brak zapisanych paragonów
      </p>
    );
  }

  return (
    <>
      <table className="w-full border border-orange-300 rounded-lg shadow-md">
        <thead className="bg-orange-200 text-orange-900 font-semibold">
          <tr>
            <th className="border border-orange-300 p-3 text-left">Data</th>
            <th className="border border-orange-300 p-3 text-left">Sklep</th>
            <th className="border border-orange-300 p-3 text-right">
              Suma (zł)
            </th>
            <th className="border border-orange-300 p-3 text-center">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {receipts.map(({ id, date, storeName, products }) => (
            <tr
              key={id}
              className="cursor-pointer hover:bg-orange-100 transition-colors"
              onClick={() => onOpenModal({ id, date, storeName, products })}
            >
              <td className="border border-orange-300 p-3">
                {date.toLocaleDateString()} {date.toLocaleTimeString()}
              </td>
              <td className="border border-orange-300 p-3">
                {capitalizeWords(storeName)}
              </td>
              <td className="border border-orange-300 p-3 text-right">
                {calcTotal(products)}
              </td>
              <td
                className="border border-orange-300 p-3 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="primary"
                    onClick={() => handleEditClick(id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition"
                    aria-label={`Edytuj paragon z dnia ${date.toLocaleDateString()}`}
                  >
                    Edytuj
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleDeleteClick(id)}
                    className="hover:bg-red-600 rounded px-3 py-1 transition"
                    aria-label={`Usuń paragon z dnia ${date.toLocaleDateString()}`}
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
        message="Czy na pewno chcesz usunąć ten paragon?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}
