import React, { useState } from "react";
import Button from "../buttons/Button";
import ModalConfirm from "../modals/ModalConfirm";
import ModalEdit from "../modals/ModalEdit";

export default function UniversalList({
  data = [],
  columns = [],
  onEdit,
  onDelete,
  editForm: EditForm,
  deleteConfirmTitle = "Potwierdź usunięcie",
  deleteConfirmMessage = "Czy na pewno chcesz usunąć ten element?",
  emptyText = "Brak danych.",
  actions = ["edit", "delete"],
  onRowClick,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [toEdit, setToEdit] = useState(null);

  // Sortowanie
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (aValue === undefined || bValue === undefined) return 0;
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
      // Dla stringów i dat
      return sortOrder === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [data, sortKey, sortOrder]);

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

  const shouldScroll = sortedData.length > 10;

  if (!sortedData.length) {
    return (
      <p className="text-gray-600 dark:text-orange-300 italic text-center transition-colors duration-300">
        {emptyText}
      </p>
    );
  }

  return (
    <div
      className={`border border-orange-300 dark:border-gray-800 rounded-lg shadow-md bg-white dark:bg-gray-900 transition-colors duration-300 ${
        shouldScroll ? "max-h-[600px] overflow-y-auto" : ""
      }`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[400px] md:min-w-0">
          <thead className="bg-orange-200 dark:bg-black text-orange-900 dark:text-orange-400 font-semibold transition-colors duration-300">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`border border-orange-300 dark:border-gray-800 p-2 cursor-pointer select-none ${
                    col.align || "text-left"
                  } whitespace-nowrap text-xs md:text-sm`}
                  onClick={() => handleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key && (
                      <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                    )}
                  </span>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="border border-orange-300 dark:border-gray-800 p-2 text-center whitespace-nowrap text-xs md:text-sm">
                  Akcje
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick && onRowClick(row)}
                className="hover:bg-orange-100 dark:hover:bg-gray-800 transition-colors"
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={col.key + "_" + row.id + "_" + colIdx}
                    className={`border border-orange-300 dark:border-gray-800 p-2 ${
                      col.align || "text-left"
                    } whitespace-nowrap text-xs md:text-sm ${
                      col.cellClass || ""
                    }`}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td
                    key={"actions_" + row.id}
                    className="border border-orange-300 dark:border-gray-800 p-2 text-center whitespace-nowrap text-xs md:text-sm"
                  >
                    <div className="flex gap-1 justify-center flex-wrap">
                      {actions.includes("edit") && EditForm && (
                        <Button
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(row);
                          }}
                          className="hover:bg-orange-500 hover:text-white dark:hover:bg-orange-700 dark:hover:text-orange-200 px-2 py-1 rounded transition text-xs"
                          aria-label="Edytuj"
                        >
                          Edytuj
                        </Button>
                      )}
                      {actions.includes("delete") && onDelete && (
                        <Button
                          variant="deleted"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(row);
                          }}
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
      </div>
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
