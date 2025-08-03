import { useMemo, useContext, useState } from "react";
import UniversalForm from "../common/UniversalForm";
import ReceiptsContext from "../../contexts/ReceiptsContext";
import ReceiptsProductsList from "./ReceiptsProductsList";

export default function ReceiptsEditForm({ initialData, onSubmit, onCancel }) {
  const {
    receiptsCategories,
    shops,
    addReceiptsCategory,
    removeReceiptsCategory,
    addShop,
    removeShop,
  } = useContext(ReceiptsContext);

  // Produkty do edycji
  const [products, setProducts] = useState(initialData?.products || []);
  const [productForm, setProductForm] = useState({
    name: "",
    category: receiptsCategories[0] || "",
    quantity: 1,
    unitPrice: "",
  });

  // Pola produktu
  const productFields = [
    {
      name: "name",
      label: "Nazwa produktu",
      type: "text",
      required: true,
      placeholder: "np. Chleb",
    },
    {
      name: "category",
      label: "Kategoria",
      type: "select",
      options: receiptsCategories,
      required: true,
    },
    {
      name: "quantity",
      label: "Ilość",
      type: "number",
      min: 1,
      step: 1,
      required: true,
      placeholder: "np. 2",
    },
    {
      name: "unitPrice",
      label: "Cena jednostkowa",
      type: "number",
      min: 0.01,
      step: 0.01,
      required: true,
      placeholder: "np. 4.99",
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
        id: Date.now() + Math.random(),
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

  // Pola paragonu
  const fields = useMemo(
    () => [
      {
        name: "date",
        label: "Data",
        type: "date",
        required: true,
      },
      {
        name: "store",
        label: "Sklep",
        type: "select",
        options: [...shops, "Inny"],
        required: true,
      },
      {
        name: "customStoreName",
        label: "Nazwa sklepu",
        type: "text",
        required: true,
        showIf: (form) => form.store === "Inny",
        placeholder: "Wpisz nazwę sklepu",
      },
    ],
    [shops]
  );

  function validate(form) {
    const errors = {};
    if (!form.store) errors.store = "Wybierz sklep!";
    if (form.store === "Inny" && !form.customStoreName) {
      errors.customStoreName = "Podaj nazwę sklepu!";
    }
    return errors;
  }

  const initialValues = {
    date: initialData?.date || new Date().toISOString().slice(0, 10),
    store: initialData?.store || shops[0] || "",
    customStoreName: initialData?.customStoreName || "",
  };

  function handleSubmit(formData) {
    if (products.length === 0) {
      alert("Dodaj przynajmniej jeden produkt!");
      return;
    }
    onSubmit({
      ...initialData,
      ...formData,
      products,
    });
    if (onCancel) onCancel();
  }

  return (
    <div>
      {/* Edycja produktów */}
      <UniversalForm
        fields={productFields}
        initialValues={productForm}
        onSubmit={handleAddProduct}
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

      <ReceiptsProductsList
        products={products}
        onDelete={handleRemoveProduct}
      />

      {/* Edycja danych paragonu */}
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
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-8 rounded shadow ml-4"
            >
              Anuluj
            </button>
          )
        }
      />
    </div>
  );
}
