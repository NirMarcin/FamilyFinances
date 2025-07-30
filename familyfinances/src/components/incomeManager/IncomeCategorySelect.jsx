import React from "react";

export default function IncomeCategorySelect({
  categories,
  value,
  onChange,
  onAddCategory,
}) {
  function handleAdd() {
    const newCat = prompt("Podaj nazwę nowej kategorii:");
    if (newCat) onAddCategory(newCat);
  }
  return (
    <div>
      <label className="block font-medium mb-1 text-orange-800">
        Kategoria
      </label>
      <div className="flex gap-2">
        <select
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          required
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2 transition"
        >
          Dodaj kategorię
        </button>
      </div>
    </div>
  );
}
