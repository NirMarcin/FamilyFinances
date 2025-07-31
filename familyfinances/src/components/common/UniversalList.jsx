import React, { useState } from "react";
import Button from "../buttons/Button";
import ModalConfirm from "../modals/ModalConfirm";

export default function UniversalList({
  data = [],
  columns = [],
  onEdit,
  onDelete,
  deleteConfirmTitle = "Potwierdź usunięcie",
  deleteConfirmMessage = "Czy na pewno chcesz usunąć ten element?",
  emptyText = "Brak danych.",
  actions = ["edit", "delete"], // ["edit", "delete"] lub []
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const handleDeleteClick = (item) => {
    setToDelete(item);
    setModalOpen(true);
  };

  const handleConfirm = () => {
    if (toDelete && onDelete) onDelete(toDelete);
    setModalOpen(false);
    setToDelete(null);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setToDelete(null);
  };

  if (!data.length) {
    return <p className="text-gray-600 italic text-center">{emptyText}</p>;
  }

  return (
    <div className="border border-orange-300 rounded-lg shadow-md bg-white overflow-x-auto">
      <table className="w-full">
        <thead className="bg-orange-200 text-orange-900 font-semibold">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`border border-orange-300 p-3 ${
                  col.align || "text-left"
                }`}
              >
                {col.label}
              </th>
            ))}
            {actions.length > 0 && (
              <th className="border border-orange-300 p-3 text-center">
                Akcje
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr
              key={item.id || idx}
              className="hover:bg-orange-100 transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`border border-orange-300 p-3 ${
                    col.align || "text-left"
                  }`}
                >
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
              {actions.length > 0 && (
                <td className="border border-orange-300 p-3 text-center">
                  <div className="flex gap-2 justify-center">
                    {actions.includes("edit") && onEdit && (
                      <Button
                        variant="primary"
                        onClick={() => onEdit(item)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition"
                        aria-label="Edytuj"
                      >
                        Edytuj
                      </Button>
                    )}
                    {actions.includes("delete") && onDelete && (
                      <Button
                        variant="secondary"
                        onClick={() => handleDeleteClick(item)}
                        className="hover:bg-red-600 rounded px-3 py-1 transition text-red-500"
                        aria-label="Usuń"
                      >
                        Usuń
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <ModalConfirm
        isOpen={modalOpen}
        title={deleteConfirmTitle}
        message={deleteConfirmMessage}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
