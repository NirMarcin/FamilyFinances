import React, { useState, useContext, useRef } from "react";
import InvoiceContext from "../../contexts/InvoiceContext";
import InvoiceForm from "./InvoiceForm";
import InvoiceList from "./InvoiceList";

export default function InvoiceManager() {
  const {
    categories,
    transactions,
    addCategory,
    removeCategory,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useContext(InvoiceContext);

  const [editTransaction, setEditTransaction] = useState(null);
  const formRef = useRef(null);

  function handleFormSubmit(data) {
    if (!editTransaction) {
      const transactionData = { ...data };
      delete transactionData.id;
      addTransaction(transactionData);
    } else {
      updateTransaction({ ...data, id: editTransaction.id });
    }
    setEditTransaction(null);
  }

  function handleEdit(tx) {
    setEditTransaction(tx);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 0);
  }

  function handleCancelEdit() {
    setEditTransaction(null);
  }

  function handleDelete(tx) {
    if (!tx.id) {
      console.warn("Brak id transakcji — nie można usunąć", tx);
      return;
    }
    deleteTransaction(tx.id);
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <div ref={formRef}>
        <h1 className="text-3xl font-extrabold mb-6 text-center text-orange-700">
          {editTransaction ? "Edytuj rachunek" : "Dodaj rachunek"}
        </h1>
        <InvoiceForm
          categories={categories}
          addCategory={addCategory}
          removeCategory={removeCategory}
          onSubmit={handleFormSubmit}
          initialData={editTransaction}
          onCancel={handleCancelEdit}
        />
      </div>

      <h2 className="text-2xl font-extrabold mb-6 text-orange-700">
        Tabela rachunków
      </h2>
      <InvoiceList
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
