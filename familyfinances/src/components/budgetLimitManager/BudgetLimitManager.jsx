import React, { useState } from "react";
import { useBudgetLimits } from "../../contexts/BudgetLimitsContext";
import LimitStatus from "./LimitStatus";
import UniversalTable from "../common/UniversalTable";

export default function BudgetLimitManager() {
  const {
    month,
    setMonth,
    limits,
    handleLimitChange,
    handleSaveLimits,
    savedLimits,
    handleDeleteLimit,
    handleEditLimit,
    loading,
    invoicesSum,
    receiptsSum,
    subsSum,
    setLimits,
  } = useBudgetLimits();

  const [error, setError] = useState("");
  const [editMonth, setEditMonth] = useState(null);

  // Walidacja: czy limit na ten miesiąc już istnieje?
  const handleAddLimit = async () => {
    setError("");
    if (
      Array.isArray(savedLimits) &&
      savedLimits.some((l) => l.month === month)
    ) {
      setError("Limit na ten miesiąc już istnieje!");
      return;
    }
    await handleSaveLimits();
    resetForm();
  };

  // Resetuj formularz po dodaniu/edycji
  const resetForm = () => {
    setEditMonth(null);
    setError("");
    setLimits({ invoices: "", receipts: "", subs: "" });
  };

  // Edycja limitu
  const handleEdit = (limit) => {
    handleEditLimit(limit);
    setEditMonth(limit.month);
  };

  // Zapisz edytowany limit
  const handleSaveEdit = async () => {
    await handleSaveLimits();
    resetForm();
  };

  // Usuń limit
  const handleDelete = async (m) => {
    await handleDeleteLimit(m);
    resetForm();
  };

  // Lista limitów do wyświetlenia
  const limitsList = Array.isArray(savedLimits)
    ? savedLimits.sort((a, b) => b.month.localeCompare(a.month))
    : [];

  const tableColumns = [
    {
      label: "Miesiąc",
      key: "month",
      className: "font-semibold text-orange-700",
    },
    {
      label: "Faktury",
      key: "invoices",
      render: (row) => `${Math.abs(row.invoices.limit)} zł`,
      className: "text-red-700 font-semibold",
    },
    {
      label: "Paragony",
      key: "receipts",
      render: (row) => `${Math.abs(row.receipts.limit)} zł`,
      className: "text-orange-700 font-semibold",
    },
    {
      label: "Subskrypcje",
      key: "subs",
      render: (row) => `${Math.abs(row.subs.limit)} zł`,
      className: "text-orange-700 font-semibold",
    },
    {
      label: "Akcje",
      key: "actions",
      render: (row) => (
        <div className="flex gap-2 justify-center">
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-xs px-2 py-1 rounded"
            onClick={() => handleEdit(row)}
            disabled={editMonth === row.month}
          >
            Edytuj
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-xs px-2 py-1 rounded text-white"
            onClick={() => handleDelete(row.month)}
            disabled={editMonth === row.month}
          >
            Usuń
          </button>
        </div>
      ),
      className: "text-center",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg mt-8 border border-orange-200 dark:border-gray-800 transition-colors duration-300">
      <h2 className="text-xl font-bold text-orange-700 dark:text-orange-400 mb-4 text-center">
        Ustaw limity wydatków na miesiąc
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (editMonth) {
            handleSaveEdit();
          } else {
            handleAddLimit();
          }
        }}
        className="space-y-6 mb-10 p-5 border border-orange-300 dark:border-gray-800 rounded-lg bg-orange-50 dark:bg-black shadow-inner transition-colors duration-300"
      >
        <div className="mb-4">
          <label className="block font-semibold mb-2 text-orange-800 dark:text-orange-300 tracking-wide">
            Wybierz miesiąc:
          </label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full px-4 py-2 border border-orange-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 transition-colors duration-300"
            disabled={!!editMonth}
            required
          />
        </div>
        <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-2 text-orange-800 dark:text-orange-300 tracking-wide">
              Limit faktur (zł):
            </label>
            <input
              type="number"
              min="0"
              value={limits.invoices === "" ? "" : Math.abs(limits.invoices)}
              onChange={(e) => handleLimitChange("invoices", e.target.value)}
              className="w-full px-4 py-2 border border-orange-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 transition-colors duration-300"
              placeholder="np. 1000"
              required
            />
          </div>
          <div className="md:w-112 w-full">
            <LimitStatus
              label="Faktury"
              limit={Math.abs(limits.invoices)}
              spent={invoicesSum}
              month={month}
            />
          </div>
        </div>
        <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-2 text-orange-800 dark:text-orange-300 tracking-wide">
              Limit paragonów (zł):
            </label>
            <input
              type="number"
              min="0"
              value={limits.receipts === "" ? "" : Math.abs(limits.receipts)}
              onChange={(e) => handleLimitChange("receipts", e.target.value)}
              className="w-full px-4 py-2 border border-orange-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 transition-colors duration-300"
              placeholder="np. 500"
              required
            />
          </div>
          <div className="md:w-112 w-full">
            <LimitStatus
              label="Paragony"
              limit={Math.abs(limits.receipts)}
              spent={receiptsSum}
              month={month}
            />
          </div>
        </div>
        <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-2 text-orange-800 dark:text-orange-300 tracking-wide">
              Limit subskrypcji (zł):
            </label>
            <input
              type="number"
              min="0"
              value={limits.subs === "" ? "" : Math.abs(limits.subs)}
              onChange={(e) => handleLimitChange("subs", e.target.value)}
              className="w-full px-4 py-2 border border-orange-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 transition-colors duration-300"
              placeholder="np. 200"
              required
            />
          </div>
          <div className="md:w-112 w-full">
            <LimitStatus
              label="Subskrypcje"
              limit={Math.abs(limits.subs)}
              spent={subsSum}
              month={month}
            />
          </div>
        </div>
        {error && (
          <div className="text-red-600 font-semibold text-center">{error}</div>
        )}
        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800 text-white dark:text-orange-200 font-semibold py-2 px-4 rounded shadow w-full mt-2 transition-colors duration-300"
          disabled={loading}
        >
          {editMonth ? "Zapisz edycję" : "Zatwierdź limity"}
        </button>
      </form>
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-2 text-orange-700 dark:text-orange-400 text-center">
          Limity miesięczne
        </h3>
        <UniversalTable
          columns={tableColumns}
          data={limitsList}
          emptyText="Brak limitów"
          rowsCount={12}
          className="w-full border text-sm"
          rowClassName="border-t"
        />
      </div>
    </div>
  );
}
