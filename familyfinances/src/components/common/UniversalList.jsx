import React, { useState } from "react";
import Button from "../buttons/Button";
import ModalConfirm from "../modals/ModalConfirm";
import ModalEdit from "../modals/ModalEdit";

export default function UniversalList({
  data = [],
  columns = [],
  onEdit,
  onDelete,
  editForm: EditForm, // przekaz komponent formularza do edycji
  deleteConfirmTitle = "Potwierdź usunięcie",
  deleteConfirmMessage = "Czy na pewno chcesz usunąć ten element?",
  emptyText = "Brak danych.",
  actions = ["edit", "delete"], // ["edit", "delete"] lub []
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [toEdit, setToEdit] = useState(null);

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

  const handleEditClick = (item) => {
    setToEdit(item);
    setEditModalOpen(true);
  };

  const handleEditConfirm = (editedData) => {
    if (editedData && onEdit) onEdit(editedData);
    setEditModalOpen(false);
    setToEdit(null);
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
    setToEdit(null);
  };

  if (!data.length) {
    return <p className="text-gray-600 italic text-center">{emptyText}</p>;
  }

  return (
    <div className="border border-orange-300 rounded-lg shadow-md bg-white overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-orange-200 text-orange-900 font-semibold">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`border border-orange-300 p-2 ${
                  col.align || "text-left"
                }`}
              >
                {col.label}
              </th>
            ))}
            {actions.length > 0 && (
              <th className="border border-orange-300 p-2 text-center">
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
                  className={`border border-orange-300 p-2 ${
                    col.align || "text-left"
                  }`}
                >
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
              {actions.length > 0 && (
                <td className="border border-orange-300 p-2 text-center">
                  <div className="flex gap-1 justify-center">
                    {actions.includes("edit") && EditForm && (
                      <Button
                        variant="secondary"
                        onClick={() => handleEditClick(item)}
                        className="hover:bg-orange-500 hover:text-white px-2 py-1 rounded transition text-xs"
                        aria-label="Edytuj"
                      >
                        Edytuj
                      </Button>
                    )}
                    {actions.includes("delete") && onDelete && (
                      <Button
                        variant="deleted"
                        onClick={() => handleDeleteClick(item)}
                        className="px-2 py-1 text-xs"
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
      {EditForm && (
        <ModalEdit
          isOpen={editModalOpen}
          title="Edytuj dane"
          onConfirm={() => {}}
          onCancel={handleEditCancel}
          confirmLabel="Zapisz"
          cancelLabel="Anuluj"
          disabled={false}
        >
          <EditForm
            initialData={toEdit}
            onSubmit={handleEditConfirm}
            onCancel={handleEditCancel}
          />
        </ModalEdit>
      )}
    </div>
  );
}
