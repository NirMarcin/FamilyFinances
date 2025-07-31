import React, { useState, useEffect } from "react";
import CategorySelector from "./InvoiceCatSelector";
import Button from "../buttons/Button";
import AmountInput from "../fields/AmountInput";
import DescriptionInput from "../fields/DescriptionInput";

export default function InvoiceForm({
  categories,
  addCategory,
  removeCategory,
  onSubmit,
  initialData = null,
  onCancel,
}) {
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().slice(0, 10)
  );
  const [category, setCategory] = useState(() => {
    if (initialData?.category) return initialData.category;
    if (categories.length === 0) return "";
    return typeof categories[0] === "string"
      ? categories[0]
      : categories[0].name;
  });
  const [amount, setAmount] = useState(initialData?.amount?.toString() || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );

  const isEditing = initialData !== null;

  useEffect(() => {
    if (categories.length === 0) return;
    const exists = categories.some((c) =>
      typeof c === "string" ? c === category : c.name === category
    );
    if (!exists) {
      setCategory(
        typeof categories[0] === "string" ? categories[0] : categories[0].name
      );
    }
  }, [categories, category]);

  function isAmountValid() {
    return amount !== "" && !isNaN(amount) && Number(amount) > 0;
  }

  function resetForm() {
    setDate(new Date().toISOString().slice(0, 10));
    setCategory(
      categories.length > 0
        ? typeof categories[0] === "string"
          ? categories[0]
          : categories[0].name
        : ""
    );
    setAmount("");
    setDescription("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!isAmountValid()) {
      alert("Podaj poprawną wartość kwoty!");
      return;
    }
    if (!category) {
      alert("Wybierz kategorię!");
      return;
    }

    onSubmit({
      id: initialData?.id || null,
      date,
      category,
      amount:-Math.abs(Number(amount)),
      description,
    });

    if (!isEditing) {
      resetForm();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 mb-10 p-5 border border-gray-300 rounded-lg bg-orange-50 shadow-inner"
    >
      {/* Data */}
      <div>
        <label
          htmlFor="date"
          className="block mb-1 font-semibold text-orange-700"
        >
          Data
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          required
        />
      </div>

      {/* Kategoria */}
      <CategorySelector
        categories={categories}
        category={category}
        setCategory={setCategory}
        addCategory={addCategory}
        removeCategory={removeCategory}
      />

      {/* Kwota */}
      <AmountInput amount={amount} setAmount={setAmount} />

      {/* Opis */}
      <DescriptionInput
        description={description}
        setDescription={setDescription}
      />

      {/* Przycisk */}
      <div className="flex gap-3">
        <Button
          variant="primary"
          type="submit"
          className="bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold py-2 px-8 rounded-md shadow-md"
        >
          {isEditing ? "Zapisz" : "Dodaj"}
        </Button>
        {isEditing && (
          <Button
            variant="primary"
            type="button"
            onClick={onCancel}
            className="bg-gray-400 hover:bg-gray-500 transition-colors text-white font-semibold py-2 px-8 rounded-md shadow-md"
          >
            Anuluj
          </Button>
        )}
      </div>
    </form>
  );
}
