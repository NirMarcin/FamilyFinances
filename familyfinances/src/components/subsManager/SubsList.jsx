import React, { useState } from "react";
import Button from "../buttons/Button";
import ModalConfirm from "../modals/ModalConfirm";

export default function SubsList({ subs, onDelete }) {
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

  if (!subs.length) return null;
  return (
    <div className="border border-orange-300 rounded-lg shadow-md bg-white overflow-x-auto">
      <table className="w-full">
        <thead className="bg-orange-200 text-orange-900 font-semibold">
          <tr>
            <th className="border border-orange-300 p-3 text-left">Data</th>
            <th className="border border-orange-300 p-3 text-left">Nazwa</th>
            <th className="border border-orange-300 p-3 text-left">
              Kategoria
            </th>
            <th className="border border-orange-300 p-3 text-right">
              Kwota (zł)
            </th>
            <th className="border border-orange-300 p-3 text-center">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {subs
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((p, idx) => (
              <tr
                key={p.id || idx}
                className="hover:bg-orange-100 transition-colors"
              >
                <td className="border border-orange-300 p-3">{p.date}</td>
                <td className="border border-orange-300 p-3">{p.name}</td>
                <td className="border border-orange-300 p-3">{p.category}</td>
                <td className="border border-orange-300 p-3 text-right">
                  {Number(p.amount).toFixed(2)}
                </td>
                <td className="border border-orange-300 p-3 text-center">
                  <Button
                    variant="secondary"
                    onClick={() => handleDeleteClick(p.id)}
                    className="ml-2 text-red-500 hover:underline"
                  >
                    Usuń
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <ModalConfirm
        isOpen={modalOpen}
        title="Potwierdź usunięcie"
        message="Czy na pewno chcesz usunąć tę płatność subskrypcyjną?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
