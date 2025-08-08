import React, { useContext, useMemo, useState } from "react";
import IncomeContext from "../../contexts/IncomeContext";
import ChartsPie from "./ChartsPie";
import UniversalTable from "../common/UniversalTable";
import ModalDetails from "../modals/ModalDetails";
import ExportSubsButton from "../buttons/ExportSubsButton";

function pad(n) {
  return n < 10 ? "0" + n : n;
}
function getMonthStart(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-01`;
}
function getMonthEnd(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const lastDay = new Date(year, month, 0).getDate();
  return `${year}-${pad(month)}-${pad(lastDay)}`;
}

export default function IncomeChartsSummary() {
  const { incomes } = useContext(IncomeContext);

  // Filtry
  const [dateFrom, setDateFrom] = useState(getMonthStart());
  const [dateTo, setDateTo] = useState(getMonthEnd());
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Stan sortowania
  const [sortKey, setSortKey] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Stan szczegółów przychodu
  const [selectedIncome, setSelectedIncome] = useState(null);

  // Filtrowanie przychodów
  const filteredIncomes = useMemo(() => {
    return incomes.filter((income) => {
      const dateOk =
        (!dateFrom || income.date >= dateFrom) &&
        (!dateTo || income.date <= dateTo);

      const categoriesArr = Array.isArray(income.categories)
        ? income.categories
        : income.category
        ? [income.category]
        : [];

      const categoryOk =
        selectedCategories.length === 0 ||
        categoriesArr.some((cat) => selectedCategories.includes(cat));

      return dateOk && categoryOk;
    });
  }, [incomes, dateFrom, dateTo, selectedCategories]);

  // Całkowita suma przychodów
  const totalIncomeAmount = useMemo(
    () =>
      filteredIncomes.reduce(
        (sum, income) => sum + Number(income.amount || 0),
        0
      ),
    [filteredIncomes]
  );

  // Kwoty według kategorii
  const amountByCategory = useMemo(() => {
    const result = {};
    filteredIncomes.forEach((income) => {
      const categoriesArr = Array.isArray(income.categories)
        ? income.categories
        : income.category
        ? [income.category]
        : [];
      categoriesArr.forEach((cat) => {
        result[cat] = (result[cat] || 0) + Number(income.amount || 0);
      });
    });
    return result;
  }, [filteredIncomes]);

  // Dane do wykresu kołowego
  const pieCategoryData = useMemo(
    () => ({
      labels: Object.keys(amountByCategory),
      datasets: [
        {
          label: "Kwota przychodów wg kategorii",
          data: Object.values(amountByCategory),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#C9CBCF",
            "#B2FF66",
            "#66FFB2",
            "#FF66B2",
            "#B266FF",
            "#66B2FF",
          ],
        },
      ],
    }),
    [amountByCategory]
  );

  // Obsługa kliknięcia w kategorię (wielokrotny wybór)
  const handleCategoryClick = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Funkcja sortująca
  const sortedIncomes = useMemo(() => {
    const sorted = [...filteredIncomes];
    sorted.sort((a, b) => {
      let aValue = a[sortKey];
      let bValue = b[sortKey];

      if (sortKey === "amount") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }
      if (sortKey === "category") {
        aValue = Array.isArray(a.categories)
          ? a.categories.join(", ")
          : a.category || "Brak kategorii";
        bValue = Array.isArray(b.categories)
          ? b.categories.join(", ")
          : b.category || "Brak kategorii";
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredIncomes, sortKey, sortOrder]);

  // Kolumny do tabeli
  const tableColumns = [
    {
      key: "date",
      label: "Data",
      sortable: true,
      render: (i) => i.date,
    },
    {
      key: "category",
      label: "Kategoria",
      sortable: true,
      render: (i) =>
        Array.isArray(i.categories)
          ? i.categories.join(", ")
          : i.category || "Brak kategorii",
    },
    {
      key: "amount",
      label: "Kwota",
      sortable: true,
      render: (i) => Number(i.amount || 0).toFixed(2) + " zł",
    },
    {
      key: "description",
      label: "Opis",
      sortable: false,
      render: (i) => i.description || "-",
    },
  ];

  // Obsługa kliknięcia nagłówka kolumny
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // Wszystkie kategorie z całej bazy
  const allCategories = useMemo(() => {
    const set = new Set();
    incomes.forEach((income) => {
      if (Array.isArray(income.categories)) {
        income.categories.forEach((cat) => set.add(cat));
      } else if (income.category) {
        set.add(income.category);
      }
    });
    return Array.from(set);
  }, [incomes]);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-10">
      <ExportSubsButton
        data={sortedIncomes}
        columns={tableColumns}
        buttonLabel="Eksportuj przychody do CSV"
        filename="przychody.csv"
      />
      <h3 className="text-2xl font-bold text-green-700 mb-6 text-center">
        Podsumowanie przychodów
      </h3>
      {/* Filtry daty */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 justify-center">
        <div className="flex flex-col">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Data od:
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border border-green-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-green-200 transition"
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Data do:
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border border-green-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-green-200 transition"
          />
        </div>
      </div>
      <div className="text-lg font-semibold mb-8 text-center">
        Całkowita kwota:{" "}
        <span className="text-green-700">
          {totalIncomeAmount.toFixed(2)} zł
        </span>
      </div>
      {/* Wykresy wg kategorii */}
      <div className="flex flex-col md:flex-row gap-8 mb-8 justify-center">
        <div className="md:w-1/2 flex flex-col gap-8">
          <div className="bg-gray-50 rounded-lg p-4 shadow-sm flex justify-center">
            <div className="w-full flex justify-center">
              <div>
                <h4 className="text-lg font-bold text-gray-700 mb-2 text-center">
                  Wykres kołowy wg kategorii
                </h4>
                <ChartsPie
                  data={pieCategoryData}
                  title="Kwoty przychodów wg kategorii"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Listy do filtrowania */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-full flex flex-col gap-8">
          <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <h4 className="text-lg font-bold text-gray-700 mb-2">
              Filtrowanie po kategoriach
            </h4>
            <ul className="list-none text-gray-800">
              {allCategories.map((cat) => (
                <li
                  key={cat}
                  className={`flex items-center justify-between cursor-pointer mb-1 px-2 py-1 rounded transition ${
                    selectedCategories.includes(cat)
                      ? "bg-green-100 text-green-700 font-bold"
                      : "hover:bg-green-50"
                  }`}
                  onClick={() => handleCategoryClick(cat)}
                  tabIndex={0}
                  aria-pressed={selectedCategories.includes(cat)}
                  role="button"
                >
                  <span className="font-semibold">{cat}</span>
                  {amountByCategory[cat] !== undefined && (
                    <span className="text-green-700 font-medium">
                      {amountByCategory[cat].toFixed(2)} zł
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Tabela na dole */}
      <div className="mt-10">
        <h4 className="text-lg font-bold text-gray-700 mb-4 text-center">
          Tabela przychodów
        </h4>
        <div
          className="bg-gray-50 rounded-lg overflow-auto shadow-sm"
          style={{ maxHeight: "400px" }}
        >
          <UniversalTable
            data={sortedIncomes}
            columns={tableColumns}
            className="min-w-full"
            onSort={handleSort}
            sortKey={sortKey}
            sortOrder={sortOrder}
            rowsCount={sortedIncomes.length}
            onRowClick={setSelectedIncome}
          />
        </div>
      </div>
      {selectedIncome && (
        <ModalDetails
          title={`Przychód: ${
            Array.isArray(selectedIncome.categories)
              ? selectedIncome.categories.join(", ")
              : selectedIncome.category || "-"
          }`}
          onClose={() => setSelectedIncome(null)}
        >
          <div className="mb-4 text-gray-700">
            <div>
              <span className="font-semibold">Data: </span>
              {selectedIncome.date
                ? new Date(selectedIncome.date).toLocaleDateString("pl-PL")
                : "-"}
            </div>
            <div>
              <span className="font-semibold">Kategoria: </span>
              {Array.isArray(selectedIncome.categories)
                ? selectedIncome.categories.join(", ")
                : selectedIncome.category || "-"}
            </div>
            <div>
              <span className="font-semibold">Kwota: </span>
              {selectedIncome.amount !== undefined &&
              selectedIncome.amount !== null
                ? Number(selectedIncome.amount).toFixed(2) + " zł"
                : "-"}
            </div>
            <div>
              <span className="font-semibold">Opis: </span>
              {selectedIncome.description || "-"}
            </div>
          </div>
        </ModalDetails>
      )}
    </div>
  );
}
