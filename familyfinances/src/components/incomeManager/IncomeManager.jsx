import React, { useContext, useState, useRef } from "react";
import IncomeForm from "./IncomeForm";
import IncomeList from "./IncomeList";
import IncomeContext from "../../contexts/IncomeContext";

export default function IncomeManager() {
  const {
    categories,
    incomes,
    addIncome,
    editIncome,
    deleteIncome,
    addCategory,
  } = useContext(IncomeContext);

  const [editIncomeData, setEditIncomeData] = useState(null);
  const formRef = useRef(null);

  function handleAddOrEditIncome(data) {
    if (editIncomeData) {
      editIncome({ ...data, id: editIncomeData.id });
      setEditIncomeData(null);
    } else {
      addIncome(data);
    }
  }

  function handleEditIncome(item) {
    setEditIncomeData(item);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 0);
  }

  function handleCancelEdit() {
    setEditIncomeData(null);
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-orange-700">
        {editIncomeData ? "Edytuj przychód" : "Dodaj przychód"}
      </h1>
      <section
        ref={formRef}
        className="mb-10 p-5 border border-gray-300 rounded-lg bg-orange-50 shadow-inner"
      >
        <IncomeForm
          categories={categories}
          onAddCategory={addCategory}
          onAddIncome={handleAddOrEditIncome}
          initialData={editIncomeData}
          onCancel={editIncomeData ? handleCancelEdit : undefined}
        />
      </section>
      <section>
        <h2 className="text-2xl font-extrabold mb-6 text-orange-700">
          Ostatnie przychody
        </h2>
        <IncomeList
          incomes={incomes}
          onEditIncome={handleEditIncome}
          onDeleteIncome={deleteIncome}
        />
      </section>
    </div>
  );
}
