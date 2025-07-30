import React from "react";
import Button from "./Buttons/Button";

export default function ModalConfirm({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg max-w-sm w-full p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-orange-700">{title}</h2>
        <p className="mb-6 text-gray-700">{message}</p>
        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            onClick={onCancel}
            className="px-4 py-2 rounded bg-orange-200 text-orange-800 hover:bg-orange-300 transition"
          >
            Nie
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-orange-600 text-white hover:bg-orange-700 transition"
          >
            Tak
          </Button>
        </div>
      </div>
    </div>
  );
}
