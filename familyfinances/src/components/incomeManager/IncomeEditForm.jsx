import { useMemo } from "react";
import UniversalForm from "../common/UniversalForm";

export default function IncomeEditForm({
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
        placeholder: "np. premia, prezent, zwrot podatku",
      },
    ],
    [categories]
  );

  function validate(form) {
    const errors = {};
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      errors.amount = "Podaj poprawną kwotę!";
    }
    return errors;
  }

  const initialValues = {
    category: initialData?.category || categories[0] || "",
    amount: initialData?.amount || "",
    description: initialData?.description || "",
  };

  return (
    <UniversalForm
      fields={fields}
      initialValues={initialValues}
      onSubmit={(data) => {
        onSubmit({ ...initialData, ...data, amount: Number(data.amount) });
        if (onCancel) onCancel(); // zamyka modal po zapisie
      }}
      submitLabel={null}
      validate={validate}
      options={categories}
      optionFieldName="category"
      extraContent={
        <div className="flex justify-end gap-4 mt-4">
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
