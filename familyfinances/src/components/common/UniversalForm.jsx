import React, { useState } from "react";
import Button from "../buttons/Button";

export default function UniversalForm({
  fields,
  initialValues = {},
  onSubmit,
  submitLabel = "Zapisz",
  validate,
  extraContent = null,
  onAddOption,
  onRemoveOption,
  optionInputPlaceholder = "Dodaj kategorię",
  optionFieldName = "category",
  options = [],
}) {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [newOption, setNewOption] = useState("");

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

  const showOptionControls =
    typeof onAddOption === "function" && typeof onRemoveOption === "function";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 mb-10 p-5 border border-orange-300 rounded-lg bg-orange-50 shadow-inner"
    >
      {fields.map((field) => (
        <div key={field.name} className="mb-4">
          <label className="block font-semibold mb-2 text-orange-800 tracking-wide">
            {field.label}
          </label>
          {field.type === "select" ? (
            <>
              <div className="flex flex-col gap-2">
                <select
                  name={field.name}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white transition"
                  required={field.required}
                >
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {showOptionControls && field.name === optionFieldName && (
                  <div className="flex flex-wrap gap-2 items-center mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          form[field.name] &&
                          options.includes(form[field.name])
                        ) {
                          onRemoveOption(form[field.name]);
                          setForm((prev) => ({
                            ...prev,
                            [field.name]: "",
                          }));
                        }
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow transition disabled:opacity-50"
                      disabled={!form[field.name]}
                      title="Usuń wybraną kategorię"
                    >
                      Usuń wybraną
                    </button>
                    <input
                      type="text"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      placeholder={optionInputPlaceholder}
                      className="px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white transition"
                      maxLength={32}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          newOption.trim() &&
                          !options.includes(newOption.trim())
                        ) {
                          onAddOption(newOption.trim());
                          setNewOption("");
                          setForm((prev) => ({
                            ...prev,
                            [field.name]: newOption.trim(),
                          }));
                        }
                      }}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded shadow transition"
                      title="Dodaj nową kategorię"
                    >
                      Dodaj
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : field.type === "checkbox" ? (
            <input
              type="checkbox"
              name={field.name}
              checked={!!form[field.name]}
              onChange={handleChange}
              className="mr-2 accent-orange-500"
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
              className="w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white transition"
              required={field.required}
            />
          )}
          {errors[field.name] && (
            <div className="text-red-600 text-sm mt-1 font-semibold">
              {errors[field.name]}
            </div>
          )}
        </div>
      ))}
      {extraContent && (
        <div className="flex justify-end items-center mt-2">{extraContent}</div>
      )}
      <Button
        type="submit"
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-8 rounded shadow transition"
      >
        {submitLabel}
      </Button>
    </form>
  );
}
