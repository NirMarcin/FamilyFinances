import React from "react";

export default function ChartsFilters({
  dateRange,
  setDateRange,
  category,
  setCategory,
  type,
  setType,
  categories = [],
  shops = [],
  shop,
  setShop,
}) {
  const isDateInvalid =
    dateRange.from &&
    dateRange.to &&
    new Date(dateRange.from) > new Date(dateRange.to);

  return (
    <section className="mb-8 max-w-4xl mx-auto p-5 bg-orange-50 border border-orange-300 rounded-lg shadow-inner flex flex-col md:flex-row gap-4 items-center justify-center">
      {/* Zakres dat */}
      <div className="flex flex-col">
        <label className="font-medium text-orange-800 mb-1">Zakres dat:</label>
        <div className="flex gap-2">
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) =>
              setDateRange({ ...dateRange, from: e.target.value })
            }
            className="border border-orange-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          />
          <span className="mx-1 text-orange-700">–</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="border border-orange-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          />
        </div>
        {isDateInvalid && (
          <span className="text-red-600 text-sm mt-1">
            Data "od" nie może być późniejsza niż data "do".
          </span>
        )}
      </div>

      {/* Kategoria */}
      <div className="flex flex-col">
        <label className="font-medium text-orange-800 mb-1">Kategoria:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-orange-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        >
          <option value="">Wszystkie</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Typ danych */}
      <div className="flex flex-col">
        <label className="font-medium text-orange-800 mb-1">Typ danych:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-orange-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        >
          <option value="">Wszystko</option>
          <option value="receipts">Paragony</option>
          <option value="invoices">Rachunki</option>
          <option value="incomes">Przychody</option> {/* <-- DODAJ TO */}
        </select>
      </div>

      {/* Sklep - tylko dla paragonów */}
      {type === "receipts" && (
        <div className="flex flex-col">
          <label className="font-medium text-orange-800 mb-1">Sklep:</label>
          <select
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            className="border border-orange-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="">Wszystkie</option>
            {shops.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}
    </section>
  );
}
