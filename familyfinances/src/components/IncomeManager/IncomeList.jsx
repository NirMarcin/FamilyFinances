import React, { useState } from "react";

export default function IncomeList({ incomes, onEditIncome, onDeleteIncome }) {
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  function startEdit(inc) {
    setEditId(inc.id);
    setEditForm({ ...inc });
  }

  function handleEditChange(e) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }

  function saveEdit() {
    onEditIncome({ ...editForm, amount: Number(editForm.amount) });
    setEditId(null);
  }

  return (
    <section className="mt-10 p-5 border border-gray-300 rounded-lg bg-orange-50 shadow-inner">
      <h2 className="text-2xl font-extrabold mb-6 text-orange-700 text-center">
        Ostatnie przychody
      </h2>
      {incomes.length === 0 ? (
        <p className="text-center text-gray-500">Brak przychodów.</p>
      ) : (
        <ul className="space-y-4">
          {incomes
            .slice(-10)
            .reverse()
            .map((inc) =>
              editId === inc.id ? (
                <li
                  key={inc.id}
                  className="border border-orange-300 rounded-lg p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0 bg-white shadow"
                >
                  <input
                    type="date"
                    name="date"
                    value={editForm.date}
                    onChange={handleEditChange}
                    className="border px-2 py-1 rounded"
                  />
                  <input
                    type="text"
                    name="category"
                    value={editForm.category}
                    onChange={handleEditChange}
                    className="border px-2 py-1 rounded"
                  />
                  <input
                    type="number"
                    name="amount"
                    value={editForm.amount}
                    onChange={handleEditChange}
                    className="border px-2 py-1 rounded"
                  />
                  <input
                    type="text"
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    className="border px-2 py-1 rounded"
                  />
                  <button
                    onClick={saveEdit}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Zapisz
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded"
                  >
                    Anuluj
                  </button>
                </li>
              ) : (
                <li
                  key={inc.id}
                  className="border border-orange-300 rounded-lg p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0 bg-white shadow hover:bg-orange-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 flex-grow">
                    <span className="font-semibold text-orange-800">
                      {inc.date}
                    </span>
                    <span className="text-orange-700 font-medium">
                      {inc.category}
                    </span>
                    <span className="text-green-700 font-semibold">
                      {inc.amount.toFixed(2)} zł
                    </span>
                    <span className="italic text-gray-600">
                      {inc.description || "-"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(inc)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edytuj
                    </button>
                    <button
                      onClick={() => onDeleteIncome(inc.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Usuń
                    </button>
                  </div>
                </li>
              )
            )}
        </ul>
      )}
    </section>
  );
}
