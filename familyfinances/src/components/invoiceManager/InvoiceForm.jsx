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
      inputClassName:
        "bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 border border-orange-200 dark:border-gray-700",
      labelClassName: "text-orange-700 dark:text-orange-300",
    },
    {
      name: "category",
      label: "Kategoria",
      type: "select",
      options: categoryNames,
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
      placeholder: "np. faktura za prąd, czynsz, zakupy",
      inputClassName:
        "bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 border border-orange-200 dark:border-gray-700",
      labelClassName: "text-orange-700 dark:text-orange-300",
    },
    // {
    //   name: "isRecurring",
    //   label: "Płatność cykliczna", //temporary disabled
    //   type: "checkbox",
    // // },
    // {
    //   name: "interval",
    //   label: "Co ile miesięcy",
    //   type: "number",
    //   min: 1,
    //   required: true,
    //   showIf: (form) => form.isRecurring,
    // },
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
      options={{ category: categoryNames }}
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
