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
        options: ["Miesięcznie", "Kwartalnie", "Co pół roku", "Rocznie"],
        showIf: (form) => form.isRecurring,
        required: false,
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
    amount: initialData?.amount || "",
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
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-8 rounded shadow"
          >
            Anuluj
          </button>
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-8 rounded shadow"
          >
            Zapisz
          </button>
        </div>
      }
    />
  );
}
