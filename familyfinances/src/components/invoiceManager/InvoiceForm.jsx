import React from "react";
import UniversalForm from "../common/UniversalForm";

const intervalOptions = ["Miesięcznie", "Kwartalnie", "Co pół roku", "Rocznie"];

export default function InvoiceForm({
  categories,
  addCategory,
  removeCategory,
  onSubmit,
  initialData,
  onCancel,
}) {
  const categoryNames = categories.map((cat) =>
    typeof cat === "string" ? cat : cat.name
  );

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
      options: categoryNames,
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
      placeholder: "np. faktura za prąd, czynsz, zakupy",
    },
    {
      name: "isRecurring",
      label: "Płatność cykliczna",
      type: "checkbox",
    },
    {
      name: "recurringInterval",
      label: "Interwał płatności",
      type: "select",
      options: intervalOptions,
      showIf: (form) => form.isRecurring,
      required: false,
    },
  ];

  function validate(form) {
    const errors = {};
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      errors.amount = "Podaj poprawną wartość kwoty!";
    }
    if (!form.category) {
      errors.category = "Wybierz kategorię!";
    }
    if (form.isRecurring && !form.recurringInterval) {
      errors.recurringInterval = "Wybierz interwał płatności!";
    }
    return errors;
  }

  const initialValues = initialData || {
    date: new Date().toISOString().slice(0, 10),
    category: categoryNames[0],
    amount: "",
    description: "",
    isRecurring: false,
    recurringInterval: intervalOptions[0],
  };

  return (
    <UniversalForm
      fields={fields}
      initialValues={initialValues}
      onSubmit={(data) =>
        onSubmit({
          ...data,
          amount: -Math.abs(Number(data.amount)), // kwota zawsze ujemna
        })
      }
      submitLabel={initialData ? "Edytuj fakturę" : "Dodaj fakturę"}
      validate={validate}
      options={categoryNames}
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
