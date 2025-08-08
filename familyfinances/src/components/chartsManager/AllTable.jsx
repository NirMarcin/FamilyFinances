import React, { useContext, useMemo, useState } from "react";
import IncomeContext from "../../contexts/IncomeContext";
import ReceiptsContext from "../../contexts/ReceiptsContext";
import InvoiceContext from "../../contexts/InvoiceContext";
import SubsContext from "../../contexts/SubsContext";
import UniversalTable from "../common/UniversalTable";
import ModalDetails from "../modals/ModalDetails";
import ExportSubsButton from "../../utils/ExportSubsButton";

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

export default function AllTable() {
  const { incomes } = useContext(IncomeContext);
  const { receipts } = useContext(ReceiptsContext);
  const { invoices } = useContext(InvoiceContext);
  const { subs } = useContext(SubsContext);

  // Stan sortowania
  const [sortKey, setSortKey] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Stan szczegółów transakcji
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Filtry
  const [dateFrom, setDateFrom] = useState(getMonthStart());
  const [dateTo, setDateTo] = useState(getMonthEnd());
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);

  // Przygotuj dane do tabeli
  const allTransactions = useMemo(() => {
    // Przychody
    const incomeRows = incomes.map((inc) => ({
      id: inc.id,
      type: "Przychód",
      date: inc.date,
      category: Array.isArray(inc.categories)
        ? inc.categories.join(", ")
        : inc.category || "-",
      amount: Number(inc.amount || 0),
      description: inc.description || "-",
      source: "Przychody",
      active: "-",
      extra: inc,
    }));

    // Paragony
    const receiptsRows = receipts.map((r) => ({
      id: r.id,
      type: "Wydatek",
      date: r.date,
      category:
        (r.products || [])
          .map((p) => p.category || "Brak kategorii")
          .filter((v, i, arr) => arr.indexOf(v) === i)
          .join(", ") || "-",
      amount: (r.products || []).reduce(
        (sum, p) => sum + Number(p.total || 0),
        0
      ),
      description: r.store || r.shop || "-",
      source: "Paragon",
      active: "-",
      extra: r,
    }));

    // Faktury
    const invoicesRows = invoices.map((inv) => ({
      id: inv.id,
      type: "Wydatek",
      date: inv.date,
      category: inv.category || "-",
      amount: Number(inv.amount || 0),
      description: inv.description || "-",
      source: "Faktura",
      active: "-",
      extra: inv,
    }));

    // Subskrypcje
    const subsRows = subs.map((sub) => ({
      id: sub.id,
      type: "Wydatek",
      date: sub.date,
      category: sub.category || "-",
      amount: Number(sub.amount || 0),
      description: sub.name || sub.type || "-",
      source: "Subskrypcja",
      active: sub.active ? "Aktywna" : "Nieaktywna",
      extra: sub,
    }));

    return [...incomeRows, ...receiptsRows, ...invoicesRows, ...subsRows];
  }, [incomes, receipts, invoices, subs]);

  // Wyciągnij wszystkie typy, kategorie, źródła
  const allTypes = useMemo(
    () => Array.from(new Set(allTransactions.map((t) => t.type))),
    [allTransactions]
  );
  const allSources = useMemo(
    () => Array.from(new Set(allTransactions.map((t) => t.source))),
    [allTransactions]
  );

  // Dynamiczne kategorie na podstawie wybranego źródła
  const filteredCategories = useMemo(() => {
    if (!selectedSources[0]) {
      // Wszystkie kategorie jeśli nie wybrano źródła
      return Array.from(
        new Set(
          allTransactions
            .map((t) => t.category.split(", "))
            .flat()
            .filter((cat) => !!cat)
        )
      );
    }
    // Kategorie tylko z wybranego źródła
    return Array.from(
      new Set(
        allTransactions
          .filter((t) => t.source === selectedSources[0])
          .map((t) => t.category.split(", "))
          .flat()
          .filter((cat) => !!cat)
      )
    );
  }, [allTransactions, selectedSources]);

  // Filtrowanie
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((t) => {
      // Data
      const dateOk =
        (!dateFrom || t.date >= dateFrom) && (!dateTo || t.date <= dateTo);

      // Typ
      const typeOk =
        selectedTypes.length === 0 || selectedTypes.includes(t.type);

      // Kategoria
      const categoryArr = t.category.split(", ").map((cat) => cat.trim());
      const categoryOk =
        selectedCategories.length === 0 ||
        categoryArr.some((cat) => selectedCategories.includes(cat));

      // Źródło
      const sourceOk =
        selectedSources.length === 0 || selectedSources.includes(t.source);

      return dateOk && typeOk && categoryOk && sourceOk;
    });
  }, [
    allTransactions,
    dateFrom,
    dateTo,
    selectedTypes,
    selectedCategories,
    selectedSources,
  ]);

  // Kolumny do tabeli
  const tableColumns = [
    { key: "type", label: "Typ", sortable: false },
    { key: "date", label: "Data", sortable: true, render: (row) => row.date },
    {
      key: "category",
      label: "Kategoria",
      sortable: true,
      render: (row) => row.category,
    },
    {
      key: "amount",
      label: "Kwota",
      sortable: true,
      render: (row) => `${row.amount.toFixed(2)} zł`,
    },
    {
      key: "source",
      label: "Źródło",
      sortable: false,
      render: (row) => row.source,
    },
  ];

  // Funkcja sortująca
  const sortedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions];
    sorted.sort((a, b) => {
      let aValue = a[sortKey];
      let bValue = b[sortKey];

      if (sortKey === "amount") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }
      if (sortKey === "category") {
        aValue = a.category || "-";
        bValue = b.category || "-";
      }
      if (sortKey === "date") {
        aValue = a.date || "";
        bValue = b.date || "";
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredTransactions, sortKey, sortOrder]);

  // Obsługa kliknięcia nagłówka kolumny
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // Obsługa zmiany selecta
  const handleTypeSelect = (e) => {
    const value = e.target.value;
    setSelectedTypes(value ? [value] : []);
  };
  const handleCategorySelect = (e) => {
    const value = e.target.value;
    setSelectedCategories(value ? [value] : []);
  };
  const handleSourceSelect = (e) => {
    const value = e.target.value;
    setSelectedSources(value ? [value] : []);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white  p-6 mb-10">
      <h3 className="text-2xl font-bold text-orange-700 mb-6 text-center">
        Wszystkie transakcje
      </h3>
      {/* Filtry */}
      <div className="flex flex-col md:flex-row gap-8 mb-8 justify-center">
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700 mb-1">
            Miesiąc od:
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border border-orange-300 rounded px-2 py-1 w-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700 mb-1">
            Miesiąc do:
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border border-orange-300 rounded px-2 py-1 w-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700 mb-1">Typ:</label>
          <select
            value={selectedTypes[0] || ""}
            onChange={handleTypeSelect}
            className="border border-orange-300 rounded px-2 py-1 w-full"
          >
            <option value="">Wszystkie</option>
            {allTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700 mb-1">Kategoria:</label>
          <select
            value={selectedCategories[0] || ""}
            onChange={handleCategorySelect}
            className="border border-orange-300 rounded px-2 py-1 w-full"
          >
            <option value="">Wszystkie</option>
            {filteredCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700 mb-1">Źródło:</label>
          <select
            value={selectedSources[0] || ""}
            onChange={handleSourceSelect}
            className="border border-orange-300 rounded px-2 py-1 w-full"
          >
            <option value="">Wszystkie</option>
            {allSources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>
      </div>
      <ExportSubsButton
        data={sortedTransactions}
        columns={tableColumns}
        buttonLabel="Eksportuj transakcje do CSV"
        filename="transakcje.csv"
      />
      <div
        className="bg-gray-50 rounded-lg overflow-auto shadow-sm"
        style={{ maxHeight: "500px" }}
      >
        <UniversalTable
          data={sortedTransactions}
          columns={tableColumns}
          className="min-w-full"
          onSort={handleSort}
          sortKey={sortKey}
          sortOrder={sortOrder}
          rowsCount={sortedTransactions.length}
          onRowClick={(row) => setSelectedTransaction(row)}
        />
      </div>
      {selectedTransaction && (
        <ModalDetails
          title={`Szczegóły: ${selectedTransaction.type} (${selectedTransaction.source})`}
          onClose={() => setSelectedTransaction(null)}
        >
          <div className="mb-4 text-gray-700">
            <div>
              <span className="font-semibold">Data: </span>
              {selectedTransaction.date
                ? new Date(selectedTransaction.date).toLocaleDateString("pl-PL")
                : "-"}
            </div>
            <div>
              <span className="font-semibold">Kategoria: </span>
              {selectedTransaction.category}
            </div>
            <div>
              <span className="font-semibold">Kwota: </span>
              {selectedTransaction.amount !== undefined
                ? Number(selectedTransaction.amount).toFixed(2) + " zł"
                : "-"}
            </div>
            <div>
              <span className="font-semibold">Opis: </span>
              {selectedTransaction.description}
            </div>
            <div>
              <span className="font-semibold">Źródło: </span>
              {selectedTransaction.source}
            </div>
            {selectedTransaction.active && (
              <div>
                <span className="font-semibold">Status: </span>
                {selectedTransaction.active}
              </div>
            )}
          </div>
        </ModalDetails>
      )}
    </div>
  );
}
