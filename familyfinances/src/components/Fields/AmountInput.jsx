import React from "react";

export default function AmountInput({ amount, setAmount }) {
  return (
    <div>
      <label htmlFor="amount" className="block mb-1 font-semibold text-orange-700">
        Kwota
      </label>
      <input
        type="number"
        step="0.01"
        min="0"
        id="amount"
        placeholder="np. 123.45"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className={
          "w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        }
        required
      />
    </div>
  );
}
