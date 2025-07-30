import React, { useContext } from "react";
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-orange-700">
        Dodaj przychód
      </h1>
      <section className="mb-10 p-5 border border-gray-300 rounded-lg bg-orange-50 shadow-inner">
        <IncomeForm
          categories={categories}
          onAddCategory={addCategory}
          onAddIncome={addIncome}
        />
      </section>
      <section>
        <h2 className="text-2xl font-extrabold mb-6 text-orange-700">
          Ostatnie przychody
        </h2>
        <IncomeList
          incomes={incomes}
          onEditIncome={editIncome}
          onDeleteIncome={deleteIncome}
        />
      </section>
    </div>
  );
}
