import React from "react";
import Button from "../buttons/Button";

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
          <Button variant="secondary" onClick={onCancel}>
            Nie
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Tak
          </Button>
        </div>
      </div>
    </div>
  );
}
