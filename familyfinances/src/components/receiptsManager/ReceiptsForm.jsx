import React, { useContext, useState } from "react";
import UniversalForm from "../common/UniversalForm";
import ReceiptsProductsList from "./ReceiptsProductsList";
import ReceiptsContext from "../../contexts/ReceiptsContext";

export default function ReceiptsForm({ initialData, onCancel, onSubmit }) {
  const {
    shops,
    addShop,
    removeShop,
    receiptsCategories,
    addReceiptsCategory,
    removeReceiptsCategory,
  } = useContext(ReceiptsContext);

  const [products, setProducts] = useState(initialData?.products || []);
  const [productForm, setProductForm] = useState({
    name: "",
    category: receiptsCategories[0] || "",
    quantity: 1,
    unitPrice: "",
  });

  // Pola formularza produktu
  const productFields = [
    {
      name: "name",
      label: "Nazwa produktu",
      type: "text",
      required: true,
      placeholder: "np. Chleb",
      inputClassName:
        "bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 border border-orange-200 dark:border-gray-700",
      labelClassName: "text-orange-700 dark:text-orange-300",
    },
    {
      name: "category",
      label: "Kategoria",
      type: "select",
      options: receiptsCategories,
      required: true,
      inputClassName:
        "bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 border border-orange-200 dark:border-gray-700",
      labelClassName: "text-orange-700 dark:text-orange-300",
    },
    {
      name: "quantity",
      label: "Ilość",
      type: "number",
      min: 1,
      step: 1,
      required: true,
      placeholder: "np. 2",
      inputClassName:
        "bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 border border-orange-200 dark:border-gray-700",
      labelClassName: "text-orange-700 dark:text-orange-300",
    },
    {
      name: "unitPrice",
      label: "Cena jednostkowa",
      type: "number",
      min: 0.01,
      step: 0.01,
      required: true,
      placeholder: "np. 4.99",
      inputClassName:
        "bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 border border-orange-200 dark:border-gray-700",
      labelClassName: "text-orange-700 dark:text-orange-300",
    },
  ];

  function validateProduct(form) {
    const errors = {};
    if (!form.name) errors.name = "Podaj nazwę produktu!";
    if (!form.category) errors.category = "Wybierz kategorię!";
    if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) <= 0)
      errors.quantity = "Podaj poprawną ilość!";
    if (!form.unitPrice || isNaN(form.unitPrice) || Number(form.unitPrice) <= 0)
      errors.unitPrice = "Podaj poprawną cenę!";
    return errors;
  }

  function handleAddProduct(form) {
    setProducts([
      ...products,
      {
        ...form,
        id: Date.now() + Math.random(), // unikalny klucz
        quantity: Number(form.quantity),
        unitPrice: Number(form.unitPrice),
        total: Number(form.quantity) * Number(form.unitPrice),
      },
    ]);
    setProductForm({
      name: "",
      category: receiptsCategories[0] || "",
      quantity: 1,
      unitPrice: "",
    });
  }

  function handleRemoveProduct(idx) {
    const updated = [...products];
    updated.splice(idx, 1);
    setProducts(updated);
  }

  const handleSubmit = (formData) => {
    onSubmit({ ...formData, products });
    setProducts([]);
    if (onCancel) onCancel();
  };

  // Pola formularza paragonu
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
      name: "store",
      label: "Sklep",
      type: "select",
      options: [...shops, "Inny"],
      required: true,
      inputClassName:
        "bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 border border-orange-200 dark:border-gray-700",
      labelClassName: "text-orange-700 dark:text-orange-300",
    },
    {
      name: "customStoreName",
      label: "Nazwa sklepu",
      type: "text",
      required: true,
      showIf: (form) => form.store === "Inny",
      placeholder: "Wpisz nazwę sklepu",
      inputClassName:
        "bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 border border-orange-200 dark:border-gray-700",
      labelClassName: "text-orange-700 dark:text-orange-300",
    },
  ];

  function validate(form) {
    const errors = {};
    if (!form.store) errors.store = "Wybierz sklep!";
    if (form.store === "Inny" && !form.customStoreName) {
      errors.customStoreName = "Podaj nazwę sklepu!";
    }
    return errors;
  }

  const initialValues = initialData || {
    date: new Date().toISOString().slice(0, 10),
    store: shops[0] || "",
    customStoreName: "",
  };

  return (
    <div>
      {/* Formularz dodawania produktu */}
      <UniversalForm
        fields={productFields}
        initialValues={productForm}
        onSubmit={(form) => {
          handleAddProduct(form);
          setProductForm({
            name: "",
            category: receiptsCategories[0] || "",
            quantity: 1,
            unitPrice: "",
            uniqueId: Date.now() + Math.random(),
          });
        }}
        submitLabel="Dodaj produkt"
        validate={validateProduct}
        options={{
          category: receiptsCategories,
        }}
        onAddOption={{
          category: addReceiptsCategory,
        }}
        onRemoveOption={{
          category: removeReceiptsCategory,
        }}
        optionFieldName="category"
        optionInputPlaceholder={{ category: "Dodaj kategorię" }}
        resetOnSubmit={true}
      />

      {/* Lista produktów */}
      <ReceiptsProductsList
        products={products}
        onDelete={handleRemoveProduct}
      />

      {/* Formularz dodania paragonu */}
      <UniversalForm
        fields={fields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validate={validate}
        options={{
          store: shops,
        }}
        onAddOption={{
          store: addShop,
        }}
        onRemoveOption={{
          store: removeShop,
        }}
        optionFieldName={{ store: "store" }}
        optionInputPlaceholder={{ store: "Dodaj sklep" }}
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
    </div>
  );
}
