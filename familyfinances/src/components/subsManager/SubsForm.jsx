import React, { useState } from "react";
import Button from "../buttons/Button";

const categoriesList = ["Streaming", "Telefon", "Internet", "Software", "Inne"];

export default function SubsForm({ onAdd }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categoriesList[0]);
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [interval, setInterval] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !amount || !startDate || !interval) return;
    await onAdd({ name, category, amount, startDate, interval });
    setName("");
    setAmount("");
    setStartDate("");
    setInterval(1);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mb-8 border border-orange-300 p-5 rounded-lg bg-orange-50 shadow-inner"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <input
          type="text"
          placeholder="Nazwa subskrypcji"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-orange-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-orange-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          {categoriesList.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Kwota"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border border-orange-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
          min={0}
        />
        <input
          type="date"
          placeholder="Data pierwszej płatności"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-orange-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />
        <div className="flex items-center">
          <label className="mr-2">Co ile miesięcy:</label>
          <input
            type="number"
            min={1}
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            className="border border-orange-300 rounded-md p-3 w-24 focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
        </div>
      </div>
      <Button
        variant="primary"
        type="submit"
        className="mt-5 hover:bg-orange-700 transition-colors text-white font-semibold py-2 px-6 rounded-md shadow-sm"
      >
        Dodaj subskrypcję
      </Button>
    </form>
  );
}
