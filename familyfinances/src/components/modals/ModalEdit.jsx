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
        className="bg-white dark:bg-gray-900 rounded-xl max-w-lg w-full p-8 shadow-2xl relative border border-orange-200 dark:border-gray-800 transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 dark:text-orange-300 hover:text-gray-900 dark:hover:text-orange-400 text-3xl font-bold leading-none focus:outline-none"
          aria-label="Zamknij modal"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-orange-700 dark:text-orange-400 text-center">
          {title}
        </h2>
        <div>{children}</div>
      </div>
    </div>
  );
}
