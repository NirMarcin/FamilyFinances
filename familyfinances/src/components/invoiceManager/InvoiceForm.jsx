import React, { useContext } from "react";
import UniversalForm from "../common/UniversalForm";
import InvoiceContext from "../../contexts/InvoiceContext";

export default function InvoiceForm({ initialData, onCancel }) {
  const { categories, addCategory, removeCategory, addInvoice } =
    useContext(InvoiceContext);

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
      name: "interval",
      label: "Co ile miesięcy",
      type: "number",
      min: 1,
      required: true,
      showIf: (form) => form.isRecurring,
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
    return errors;
  }

  const initialValues = initialData || {
    date: new Date().toISOString().slice(0, 10),
    category: categoryNames[0],
    amount: "",
    description: "",
    isRecurring: false,
    interval: 1,
  };

  return (
    <UniversalForm
      fields={fields}
      initialValues={initialValues}
      onSubmit={(data) => {
        addInvoice({
          ...data,
          amount: -Math.abs(Number(data.amount)),
          recurringInterval: data.isRecurring ? data.recurringInterval : null,
        });
        if (onCancel) onCancel();
      }}
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
