import React from "react";

export default function ModalEdit({
  isOpen,
  title = "Edytuj dane",
  children,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50">
      <div
        className="bg-white rounded-xl max-w-lg w-full p-8 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-3xl font-bold leading-none focus:outline-none"
          aria-label="Zamknij modal"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-orange-700 text-center">
          {title}
        </h2>
        <div>{children}</div>
      </div>
    </div>
  );
}
