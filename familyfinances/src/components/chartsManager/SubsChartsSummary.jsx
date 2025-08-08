import React, { useContext, useMemo, useState } from "react";
import SubsContext from "../../contexts/SubsContext";
import ChartsPie from "./ChartsPie";
import UniversalTable from "../common/UniversalTable";
import ModalDetails from "../modals/ModalDetails";
import ExportSubsButton from "../buttons/ExportSubsButton";

// Pomocnicze funkcje do dat
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

export default function SubsChartsSummary() {
  const { subs } = useContext(SubsContext);

  // Filtry
  const [dateFrom, setDateFrom] = useState(getMonthStart());
  const [dateTo, setDateTo] = useState(getMonthEnd());
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]);

  // Stan sortowania
  const [sortKey, setSortKey] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Stan szczegółów subskrypcji
  const [selectedSub, setSelectedSub] = useState(null);

  // Filtrowanie subskrypcji
  const filteredSubs = useMemo(() => {
    return subs.filter((sub) => {
      const dateOk =
        (!dateFrom || sub.date >= dateFrom) && (!dateTo || sub.date <= dateTo);

      const categoryOk =
        selectedCategories.length === 0 ||
        selectedCategories.includes(sub.category || "Brak kategorii");

      const nameOk =
        selectedNames.length === 0 ||
        selectedNames.includes(sub.name || sub.type || "Brak nazwy");

      return dateOk && categoryOk && nameOk;
    });
  }, [subs, dateFrom, dateTo, selectedCategories, selectedNames]);

  // Całkowita suma subskrypcji
  const totalSubsAmount = useMemo(
    () => filteredSubs.reduce((sum, sub) => sum + Number(sub.amount || 0), 0),
    [filteredSubs]
  );

  // Kwoty według kategorii
  const amountByCategory = useMemo(() => {
    const result = {};
    filteredSubs.forEach((sub) => {
      const cat = sub.category || "Brak kategorii";
      result[cat] = (result[cat] || 0) + Number(sub.amount || 0);
    });
    return result;
  }, [filteredSubs]);

  // Kwoty według nazwy
  const amountByName = useMemo(() => {
    const result = {};
    filteredSubs.forEach((sub) => {
      const name = sub.name || sub.type || "Brak nazwy";
      result[name] = (result[name] || 0) + Number(sub.amount || 0);
    });
    return result;
  }, [filteredSubs]);

  // Dane do wykresów

  const pieCategoryData = useMemo(
    () => ({
      labels: Object.keys(amountByCategory),
      datasets: [
        {
          label: "Kwota subskrypcji wg kategorii",
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

  const pieNameData = useMemo(
    () => ({
      labels: Object.keys(amountByName),
      datasets: [
        {
          label: "Kwota subskrypcji wg nazwy",
          data: Object.values(amountByName),
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
    [amountByName]
  );

  // Obsługa kliknięcia w kategorię (wielokrotny wybór)

  const handleCategoryClick = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Obsługa kliknięcia w nazwę (wielokrotny wybór)
  const handleNameClick = (name) => {
    setSelectedNames((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  // Funkcja sortująca
  const sortedSubs = useMemo(() => {
    const sorted = [...filteredSubs];
    sorted.sort((a, b) => {
      let aValue = a[sortKey];
      let bValue = b[sortKey];

      if (sortKey === "amount") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }
      if (sortKey === "category") {
        aValue = a.category || "Brak kategorii";
        bValue = b.category || "Brak kategorii";
      }
      if (sortKey === "type") {
        aValue = a.type || "Brak typu";
        bValue = b.type || "Brak typu";
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredSubs, sortKey, sortOrder]);

  // Kolumny do tabeli
  const tableColumns = [
    {
      key: "date",
      label: "Data",
      sortable: true,
      render: (s) => s.date,
    },
    {
      key: "name",
      label: "Nazwa",
      sortable: true,
      render: (s) => s.name || s.type || "Brak nazwy",
    },
    {
      key: "category",
      label: "Kategoria",
      sortable: true,
      render: (s) => s.category || "Brak kategorii",
    },
    {
      key: "amount",
      label: "Kwota",
      sortable: true,
      render: (s) => Number(s.amount || 0).toFixed(2) + " zł",
    },
    {
      key: "active",
      label: "Status aktywności",
      sortable: false,
      render: (s) =>
        s.active ? (
          <span className="text-green-600 font-semibold">Aktywna</span>
        ) : (
          <span className="text-red-600 font-semibold">Nieaktywna</span>
        ),
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
    subs.forEach((sub) => {
      set.add(sub.category || "Brak kategorii");
    });
    return Array.from(set);
  }, [subs]);

  // Wszystkie nazwy z całej bazy
  const allNames = useMemo(() => {
    const set = new Set();
    subs.forEach((sub) => {
      set.add(sub.name || sub.type || "Brak nazwy");
    });
    return Array.from(set);
  }, [subs]);

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-10 border border-orange-200 dark:border-gray-800 transition-colors duration-300">
      <ExportSubsButton
        data={filteredSubs}
        columns={tableColumns}
        buttonLabel="Eksportuj subskrypcje do CSV"
        filename="subskrypcje.csv"
      />
      <h3 className="text-2xl font-bold text-orange-700 dark:text-orange-400 mb-6 text-center">
        Podsumowanie subskrypcji
      </h3>
      {/* Filtry daty */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 justify-center">
        <div className="flex flex-col">
          <label className="block text-sm font-semibold text-gray-700 dark:text-orange-300 mb-1">
            Data od:
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border border-orange-300 dark:border-gray-700 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 transition-colors duration-300"
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-semibold text-gray-700 dark:text-orange-300 mb-1">
            Data do:
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border border-orange-300 dark:border-gray-700 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-orange-300 transition-colors duration-300"
          />
        </div>
      </div>
      <div className="text-lg font-semibold mb-8 text-center dark:text-orange-400">
        Całkowita kwota:{" "}
        <span className="text-orange-700 dark:text-orange-700">{totalSubsAmount.toFixed(2)} zł</span>
      </div>
      {/* Wykresy */}
      <div className="flex flex-col md:flex-row gap-8 mb-8 justify-center">
        <div className="md:w-1/2 flex flex-col gap-8">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 shadow-sm flex justify-center transition-colors duration-300">
            <div className="w-full flex justify-center">
              <div>
                <h4 className="text-lg font-bold text-gray-700 dark:text-orange-300 mb-2 text-center">
                  Wykres wg kategorii
                </h4>
                <ChartsPie
                  data={pieCategoryData}
                  title="Kwoty subskrypcji wg kategorii"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 flex flex-col gap-8">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 shadow-sm flex justify-center transition-colors duration-300">
            <div className="w-full flex justify-center">
              <div>
                <h4 className="text-lg font-bold text-gray-700 dark:text-orange-300 mb-2 text-center">
                  Wykres wg nazwy
                </h4>
                <ChartsPie
                  data={pieNameData}
                  title="Kwoty subskrypcji wg nazwy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listy do filtrowania */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-1/2 flex flex-col gap-8">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 shadow-sm transition-colors duration-300">
            <h4 className="text-lg font-bold text-gray-700 dark:text-orange-300 mb-2">
              Filtrowanie po kategoriach
            </h4>
            <ul className="list-none text-gray-800 dark:text-orange-300">
              {allCategories.map((cat) => (
                <li
                  key={cat}
                  className={`flex items-center justify-between cursor-pointer mb-1 px-2 py-1 rounded transition ${
                    selectedCategories.includes(cat)
                      ? "bg-orange-100 dark:bg-gray-800 text-orange-700 dark:text-orange-400 font-bold"
                      : "hover:bg-orange-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => handleCategoryClick(cat)}
                  tabIndex={0}
                  aria-pressed={selectedCategories.includes(cat)}
                  role="button"
                >
                  <span className="font-semibold">{cat}</span>
                  {amountByCategory[cat] !== undefined && (
                    <span className="text-orange-700 dark:text-orange-400 font-medium">
                      {amountByCategory[cat].toFixed(2)} zł
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="md:w-1/2 flex flex-col gap-8">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 shadow-sm transition-colors duration-300">
            <h4 className="text-lg font-bold text-gray-700 dark:text-orange-300 mb-2">
              Filtrowanie po nazwie
            </h4>
            <ul className="list-none text-gray-800 dark:text-orange-300">
              {allNames.map((name) => (
                <li
                  key={name}
                  className={`flex items-center justify-between cursor-pointer mb-1 px-2 py-1 rounded transition ${
                    selectedNames.includes(name)
                      ? "bg-orange-100 dark:bg-gray-800 text-orange-700 dark:text-orange-400 font-bold"
                      : "hover:bg-orange-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => handleNameClick(name)}
                  tabIndex={0}
                  aria-pressed={selectedNames.includes(name)}
                  role="button"
                >
                  <span className="font-semibold">{name}</span>
                  {amountByName[name] !== undefined && (
                    <span className="text-orange-700 dark:text-orange-400 font-medium">
                      {amountByName[name].toFixed(2)} zł
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
        <h4 className="text-lg font-bold text-gray-700 dark:text-orange-300 mb-4 text-center">
          Tabela subskrypcji
        </h4>
        <div
          className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-auto shadow-sm transition-colors duration-300"
          style={{ maxHeight: "400px" }}
        >
          <UniversalTable
            data={sortedSubs}
            columns={tableColumns}
            className="min-w-full"
            onSort={handleSort}
            sortKey={sortKey}
            sortOrder={sortOrder}
            rowsCount={sortedSubs.length}
            onRowClick={setSelectedSub}
          />
        </div>
      </div>
      {selectedSub && (
        <ModalDetails
          title={`Subskrypcja: ${selectedSub.type || "-"}`}
          onClose={() => setSelectedSub(null)}
        >
          <div className="mb-4 text-gray-700 dark:text-orange-300">
            <div>
              <span className="font-semibold">Data: </span>
              {selectedSub.date
                ? new Date(selectedSub.date).toLocaleDateString("pl-PL")
                : "-"}
            </div>
            <div>
              <span className="font-semibold">Typ: </span>
              {selectedSub.type || "-"}
            </div>
            <div>
              <span className="font-semibold">Kategoria: </span>
              {selectedSub.category || "-"}
            </div>
            <div>
              <span className="font-semibold">Kwota: </span>
              {selectedSub.amount !== undefined && selectedSub.amount !== null
                ? Number(selectedSub.amount).toFixed(2) + " zł"
                : "-"}
            </div>
            <div>
              <span className="font-semibold">Opis: </span>
              {selectedSub.description || "-"}
            </div>
          </div>
        </ModalDetails>
      )}
    </div>
  );
}
