import { useMemo } from "react";
import UniversalForm from "../common/UniversalForm";

export default function InvoiceEditForm({
  categories = [],
  initialData,
  onSubmit,
  onCancel,
}) {
  const fields = useMemo(
    () => [
      {
        name: "category",
        label: "Kategoria",
        type: "select",
        options: categories,
        required: true,
        inputClassName: "bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 border border-orange-200 dark:border-gray-700",
        labelClassName: "text-orange-700 dark:text-orange-300",
      },
      {
        name: "amount",
        label: "Kwota",
        type: "number",
        min: 0,
        step: 0.01,
        required: true,
        inputClassName: "bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 border border-orange-200 dark:border-gray-700",
        labelClassName: "text-orange-700 dark:text-orange-300",
      },
      {
        name: "description",
        label: "Opis",
        type: "text",
        placeholder: "np. faktura za prąd, czynsz, zakupy",
        inputClassName: "bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 border border-orange-200 dark:border-gray-700",
        labelClassName: "text-orange-700 dark:text-orange-300",
      },
      {
        name: "isRecurring",
        label: "Płatność cykliczna",
        type: "checkbox",
        labelClassName: "text-orange-700 dark:text-orange-300",
      },
      {
        name: "recurringInterval",
        label: "Interwał płatności",
        type: "select",
        options: ["Miesięcznie", "Kwartalnie", "Co pół roku", "Rocznie"],
        showIf: (form) => form.isRecurring,
        required: false,
        inputClassName: "bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 border border-orange-200 dark:border-gray-700",
        labelClassName: "text-orange-700 dark:text-orange-300",
      },
    ],
    [categories]
  );

  function validate(form) {
    const errors = {};
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      errors.amount = "Podaj poprawną kwotę!";
    }
    if (!form.category) {
      errors.category = "Wybierz kategorię!";
    }
    if (form.isRecurring && !form.recurringInterval) {
      errors.recurringInterval = "Wybierz interwał płatności!";
    }
    return errors;
  }

  const initialValues = {
    category: initialData?.category || categories[0] || "",
    amount: initialData?.amount ? Math.abs(Number(initialData.amount)) : "",
    description: initialData?.description || "",
    isRecurring: initialData?.isRecurring || false,
    recurringInterval: initialData?.recurringInterval || "Miesięcznie",
  };

  return (
    <UniversalForm
      fields={fields}
      initialValues={initialValues}
      onSubmit={(data) => {
        onSubmit({
          ...initialData,
          ...data,
          amount: -Math.abs(Number(data.amount)),
        });
        if (onCancel) onCancel();
      }}
      submitLabel={null}
      validate={validate}
      options={categories}
      optionFieldName="category"
      extraContent={
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-orange-300 font-bold py-2 px-8 rounded shadow transition-colors duration-300"
          >
            Anuluj
          </button>
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-700 dark:hover:bg-orange-800 text-white dark:text-orange-200 font-bold py-2 px-8 rounded shadow transition-colors duration-300"
          >
            Zapisz
          </button>
        </div>
      }
    />
  );
}
