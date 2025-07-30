import React from "react";

export default function DescriptionInput({ description, setDescription }) {
  return (
    <div>
      <label htmlFor="description" className="block mb-1 font-semibold text-orange-700">
        Krótki opis
      </label>
      <input
        type="text"
        id="description"
        placeholder="np. Zakupy w sklepie"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={
          "w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        }
      />
    </div>
  );
}
