import React, { useState } from "react";
import Button from "../buttons/Button";

export default function UniversalForm({
  fields,
  initialValues = {},
  onSubmit,
  submitLabel = "Zapisz",
  validate,
  extraContent = null,
}) {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validate) {
      const validation = validate(form);
      setErrors(validation);
      if (Object.keys(validation).length > 0) return;
    }
    onSubmit(form);
    setForm(initialValues);
    setErrors({});
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 mb-10 p-5 border border-gray-300 rounded-lg bg-orange-50 shadow-inner"
    >
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block font-medium mb-1 text-orange-800">
            {field.label}
          </label>
          {field.type === "select" ? (
            <select
              name={field.name}
              value={form[field.name] || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
              required={field.required}
            >
              {field.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : field.type === "checkbox" ? (
            <input
              type="checkbox"
              name={field.name}
              checked={!!form[field.name]}
              onChange={handleChange}
              className="mr-2"
            />
          ) : (
            <input
              type={field.type}
              name={field.name}
              value={form[field.name] || ""}
              onChange={handleChange}
              min={field.min}
              max={field.max}
              step={field.step}
              placeholder={field.placeholder}
              className="w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
              required={field.required}
            />
          )}
          {errors[field.name] && (
            <div className="text-red-600 text-sm mt-1">
              {errors[field.name]}
            </div>
          )}
        </div>
      ))}
      {extraContent}
      <Button
        type="submit"
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-8 rounded shadow"
      >
        {submitLabel}
      </Button>
    </form>
  );
}
