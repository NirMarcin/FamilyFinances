import React, { useContext } from "react";
import UniversalForm from "../common/UniversalForm";
import IncomeContext from "../../contexts/IncomeContext";

export default function IncomeForm({ initialData, onCancel }) {
  const { categories, addCategory, removeCategory, addIncome } =
    useContext(IncomeContext);

  const fields = [
    {
      name: "date",
      label: "Data",
      type: "date",
      required: true,
    },
    {
      name: "category",
      label: "Kategoria",
      type: "select",
      options: categories,
      required: true,
    },
    {
      name: "amount",
      label: "Kwota",
      type: "number",
      min: 0,
      step: 0.01,
      required: true,
    },
    {
      name: "description",
      label: "Opis",
      type: "text",
      placeholder: "np. premia, prezent, zwrot podatku",
    },
  ];

  function validate(form) {
    const errors = {};
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      errors.amount = "Podaj poprawną kwotę!";
    }
    return errors;
  }

  const initialValues = initialData || {
    date: new Date().toISOString().slice(0, 10),
    category: categories[0],
    amount: "",
    description: "",
  };

  return (
    <UniversalForm
      fields={fields}
      initialValues={initialValues}
      onSubmit={(data) => addIncome({ ...data, amount: Number(data.amount) })}
      submitLabel={initialData ? "Edytuj przychód" : "Dodaj przychód"}
      validate={validate}
      options={categories}
      onAddOption={addCategory}
      onRemoveOption={removeCategory}
      optionFieldName="category"
      optionInputPlaceholder="Dodaj kategorię"
      extraContent={
        onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-8 rounded shadow ml-4"
          >
            Anuluj
          </button>
        )
      }
    />
  );
}
