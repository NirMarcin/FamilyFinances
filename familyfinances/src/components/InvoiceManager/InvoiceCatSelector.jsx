import React, { useState } from "react";
import ModalConfirm from "../ModalConfirm";
import Button from "../Buttons/Button";
import { capitalizeWords } from "../../utils/stringUtils";
import InputField from "../Fields/InputField";

export default function CategorySelector({
  categories,
  category,
  setCategory,
  addCategory,
  removeCategory,
  disabled = false,
}) {
  const [newCategory, setNewCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingCategoryToRemove, setPendingCategoryToRemove] = useState(null);

  function handleAddCategory() {
    let cat = newCategory.trim();
    // Przed dodaniem kapitalizujemy wszystkie słowa
    const formattedCat = capitalizeWords(cat);
    if (
      formattedCat &&
      !categories.some(
        (c) => (typeof c === "string" ? c : c.name) === formattedCat
      )
    ) {
      addCategory(formattedCat);
      setCategory(formattedCat);
      setNewCategory("");
    }
  }

  // Zastąpienie handleRemoveCategory - zamiast confirm otwieramy modal
  function confirmRemoveCategory() {
    setPendingCategoryToRemove(category);
    setIsModalOpen(true);
  }

  function handleConfirmRemove() {
    if (pendingCategoryToRemove) {
      removeCategory(pendingCategoryToRemove);
      if (category === pendingCategoryToRemove) {
        const remaining = categories.find(
          (c) =>
            (typeof c === "string" ? c : c.name) !== pendingCategoryToRemove
        );
        setCategory(
          remaining
            ? typeof remaining === "string"
              ? remaining
              : remaining.name
            : ""
        );
      }
    }
    setIsModalOpen(false);
    setPendingCategoryToRemove(null);
  }

  function handleCancelRemove() {
    setIsModalOpen(false);
    setPendingCategoryToRemove(null);
  }

  return (
    <div className="mb-6">
      <label className="block mb-1 font-semibold text-orange-700">
        Kategoria
      </label>

      {/* Wybór kategorii + przycisk Usuń w jednej linii */}
      <div className="flex items-center gap-2 mb-2">
        {/* Select kategorii */}
        <select
          className="w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          disabled={disabled}
        >
          {categories.map((cat) => {
            const name = typeof cat === "string" ? cat : cat.name;
            return (
              <option key={name} value={name}>
                {capitalizeWords(name)}
              </option>
            );
          })}
        </select>

        {/* Przycisk "Usuń" */}
        {!disabled && (
          <Button
            variant="deleted"
            type="button"
            onClick={confirmRemoveCategory}
            title="Usuń aktualnie wybraną kategorię"
          >
            Usuń
          </Button>
        )}
      </div>

      {/* Nowa kategoria: pole + przycisk */}
      {!disabled && (
        <div className="flex items-center gap-2">
          <InputField
            className="w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            type="text"
            placeholder="Nowa kategoria"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCategory();
              }
            }}
          />
          <Button
            type="button"
            onClick={handleAddCategory}
            variant="primary"
            className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2 transition"
          >
            Dodaj
          </Button>
        </div>
      )}

      {/* Modal potwierdzenia */}
      <ModalConfirm
        isOpen={isModalOpen}
        title="Potwierdź usunięcie"
        message={`Czy na pewno usunąć kategorię "${pendingCategoryToRemove}"? Trwałe usunięcie.`}
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
      />
    </div>
  );
}
