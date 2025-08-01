import React from "react";

export default function ModalEdit({
  isOpen,
  title = "Edytuj dane",
  children,
  onConfirm,
  onCancel,
  confirmLabel = "Zapisz",
  cancelLabel = "Anuluj",
  disabled = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <h2 className="text-xl font-bold text-orange-700 mb-4 text-center">
          {title}
        </h2>
        <div className="mb-6">{children}</div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded shadow transition"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={disabled}
            className={`bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded shadow transition ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
