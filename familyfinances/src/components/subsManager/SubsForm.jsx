import React, { useContext } from "react";
import UniversalForm from "../common/UniversalForm";
import SubsContext from "../../contexts/SubsContext";

const categoriesList = ["Streaming", "Telefon", "Internet", "Software", "Inne"];

export default function SubsForm({ initialData, onCancel }) {
  const { addSubs, subs } = useContext(SubsContext);

  const fields = [
    {
      name: "name",
      label: "Nazwa subskrypcji",
      type: "text",
      required: true,
    },
    {
      name: "category",
      label: "Kategoria",
      type: "select",
      options: categoriesList,
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
      name: "startDate",
      label: "Data pierwszej płatności",
      type: "date",
      required: true,
    },
    {
      name: "interval",
      label: "Co ile miesięcy",
      type: "number",
      min: 1,
      required: true,
    },
  ];

  const initialValues = initialData || {
    name: "",
    category: categoriesList[0],
    amount: "",
    startDate: new Date().toISOString().slice(0, 10),
    interval: 1,
  };

  function validate(form) {
    const errors = {};
    if (
      !initialData && // tylko przy dodawaniu nowej
      subs.some(
        (sub) =>
          sub.name.trim().toLowerCase() === form.name.trim().toLowerCase() &&
          sub.active !== false &&
          sub.id !== form.id
      )
    ) {
      errors.name = "Subskrypcja o tej nazwie już istnieje!";
    }
    return errors;
  }

  return (
    <UniversalForm
      fields={fields}
      initialValues={initialValues}
      onSubmit={addSubs}
      submitLabel={initialData ? "Edytuj subskrypcję" : "Dodaj subskrypcję"}
      options={{ category: categoriesList }}
      validate={validate}
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
