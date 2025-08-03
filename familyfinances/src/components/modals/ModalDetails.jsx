import React from "react";

export default function ModalDetails({ title, children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-xl max-w-3xl w-full max-h-screen overflow-y-auto shadow-2xl p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-3xl font-bold leading-none focus:outline-none"
          aria-label="Zamknij modal"
        >
          &times;
        </button>
        {title && (
          <h3
            id="modal-title"
            className="text-2xl font-bold mb-6 text-orange-700"
          >
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
}
