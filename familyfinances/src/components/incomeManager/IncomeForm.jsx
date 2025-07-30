import React, { useState } from "react";
import IncomeCategorySelect from "./IncomeCategorySelect";

export default function IncomeForm({ categories, onAddCategory, onAddIncome }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    category: categories[0],
    amount: "",
    description: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      alert("Podaj poprawną kwotę!");
      return;
    }
    onAddIncome({ ...form, amount: Number(form.amount) });
    setForm({ ...form, amount: "", description: "" });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 mb-10 p-5 border border-gray-300 rounded-lg bg-orange-50 shadow-inner"
    >
      <div>
        <label className="block font-medium mb-1 text-orange-800">Data</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          required
        />
      </div>
      <IncomeCategorySelect
        categories={categories}
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        onAddCategory={(cat) => {
          if (onAddCategory(cat)) setForm((f) => ({ ...f, category: cat }));
        }}
      />
      <div>
        <label className="block font-medium mb-1 text-orange-800">Kwota</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          min="0"
          step="0.01"
          className="w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1 text-orange-800">Opis</label>
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          placeholder="np. premia, prezent, zwrot podatku"
        />
      </div>
      <button
        type="submit"
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-8 rounded shadow"
      >
        Dodaj przychód
      </button>
    </form>
  );
}
