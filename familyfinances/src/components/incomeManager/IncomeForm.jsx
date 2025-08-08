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
      inputClassName:
        "bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 border border-orange-200 dark:border-gray-700 ",
      labelClassName: "text-orange-700 dark:text-orange-300",
    },
    {
      name: "category",
      label: "Kategoria",
      type: "select",
      options: categories,
      required: true,
      inputClassName:
        "bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 border border-orange-200 dark:border-gray-700",
      labelClassName: "text-orange-700 dark:text-orange-300",
    },
    {
      name: "amount",
      label: "Kwota",
      type: "number",
      min: 0,
      step: 0.01,
      required: true,
      inputClassName:
        "bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 border border-orange-200 dark:border-gray-700",
      labelClassName: "text-orange-700 dark:text-orange-300",
    },
    {
      name: "description",
      label: "Opis",
      type: "text",
      placeholder: "np. premia, prezent, zwrot podatku",
      inputClassName:
        "bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 border border-orange-200 dark:border-gray-700",
      labelClassName: "text-orange-700 dark:text-orange-300",
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
      options={{ category: categories }}
      onAddOption={{ category: addCategory }}
      onRemoveOption={{ category: removeCategory }}
      optionFieldName={{ category: "category" }}
      optionInputPlaceholder={{ category: "Dodaj kategorię" }}
      extraContent={
        onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-orange-300 font-bold py-2 px-8 rounded shadow ml-4 transition-colors duration-300"
          >
            Anuluj
          </button>
        )
      }
    />
  );
}
