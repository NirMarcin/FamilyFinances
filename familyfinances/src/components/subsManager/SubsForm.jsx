import React from "react";
import Button from "../buttons/Button";
import UniversalForm from "../common/UniversalForm";

const categoriesList = ["Streaming", "Telefon", "Internet", "Software", "Inne"];

export default function SubsForm({ onAdd }) {
  const handleSubmit = async (values) => {
    const { name, category, amount, startDate, interval } = values;
    await onAdd({ name, category, amount, startDate, interval });
  };

  return (
    <UniversalForm
      fields={[
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
      ]}
      initialValues={{
        name: "",
        category: categoriesList[0],
        amount: "",
        startDate: "",
        interval: 1,
      }}
      onSubmit={handleSubmit}
      submitLabel="Dodaj subskrypcję"
    />
  );
}
