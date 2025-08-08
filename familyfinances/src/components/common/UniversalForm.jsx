import React, { useState } from "react";
import Button from "../buttons/Button";
import { capitalizeWords } from "../../utils/stringUtils";

export default function UniversalForm({
  fields,
  initialValues = {},
  onSubmit,
  submitLabel = "Zapisz",
  validate,
  extraContent = null,
  onAddOption = {},
  onRemoveOption = {},
  optionInputPlaceholder = {},
  options = {},
}) {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [newOptions, setNewOptions] = useState({});

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    // Automatyczne kapitalizowanie dla pól tekstowych
    const fieldDef = fields.find((f) => f.name === name);
    if (fieldDef && fieldDef.type === "text") {
      newValue = capitalizeWords(newValue);
    }

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
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
      className="space-y-6 mb-10 p-5 border border-orange-300 dark:border-gray-800 rounded-lg bg-orange-50 dark:bg-black shadow-inner transition-colors duration-300"
    >
      {fields
        .filter((field) => !field.showIf || field.showIf(form))
        .map((field) => (
          <div key={field.name} className="mb-4">
            <label className="block font-semibold mb-2 text-orange-800 dark:text-orange-300 tracking-wide">
              {field.label}
            </label>
            {field.type === "select" ? (
              <>
                <div className="flex flex-col gap-2">
                  <select
                    name={field.name}
                    value={form[field.name] || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-orange-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 transition"
                    required={field.required}
                  >
                    {Array.isArray(options[field.name]) &&
                    options[field.name].length > 0 ? (
                      [...options[field.name]]
                        .sort((a, b) =>
                          a.localeCompare(b, "pl", { sensitivity: "base" })
                        )
                        .map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))
                    ) : (
                      <option value="">Brak kategorii</option>
                    )}
                  </select>
                  {onAddOption[field.name] && onRemoveOption[field.name] && (
                    <div className="flex flex-wrap gap-2 items-center mt-1">
                      {/* Jeden przycisk do usuwania aktualnie wybranej opcji */}
                      <Button
                        variant="deleted"
                        type="button"
                        disabled={
                          !Array.isArray(options[field.name]) ||
                          options[field.name].length === 0
                        }
                        onClick={() => {
                          if (
                            Array.isArray(options[field.name]) &&
                            options[field.name].length > 0
                          ) {
                            const last =
                              options[field.name][
                                options[field.name].length - 1
                              ];
                            onRemoveOption[field.name](last);
                            // Jeśli usuwasz wybraną opcję, wyczyść pole w formularzu
                            if (form[field.name] === last) {
                              setForm((prev) => ({
                                ...prev,
                                [field.name]: "",
                              }));
                            }
                          }
                        }}
                        className="!px-4 !py-2"
                        title={`Usuń ${field.label.toLowerCase()}`}
                      >
                        Usuń
                      </Button>
                      <input
                        type="text"
                        value={newOptions[field.name] || ""}
                        onChange={(e) =>
                          setNewOptions((prev) => ({
                            ...prev,
                            [field.name]: capitalizeWords(e.target.value),
                          }))
                        }
                        placeholder={optionInputPlaceholder[field.name] || ""}
                        className="bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 border border-orange-200 dark:border-gray-700"
                        maxLength={32}
                      />
                      <Button
                        className="!px-4 !py-2"
                        variant="primary"
                        type="button"
                        onClick={() => {
                          const val = newOptions[field.name]?.trim();
                          if (val && !options[field.name].includes(val)) {
                            onAddOption[field.name](val);
                            setNewOptions((prev) => ({
                              ...prev,
                              [field.name]: "",
                            }));
                            setForm((prev) => ({
                              ...prev,
                              [field.name]: val,
                            }));
                          }
                        }}
                        title={`Dodaj nową ${field.label.toLowerCase()}`}
                      >
                        Dodaj
                      </Button>
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
                className="w-full px-4 py-2 border border-orange-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 transition"
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
      {submitLabel && (
        <Button variant="primary" type="submit">
          {submitLabel}
        </Button>
      )}
    </form>
  );
}
