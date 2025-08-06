import React, { useContext, useMemo, useState } from "react";
import InvoiceContext from "../../contexts/InvoiceContext";
import ChartsPie from "./ChartsPie";
import ChartsBar from "./ChartsBar";
import UniversalTable from "../common/UniversalTable";
import ModalDetails from "../modals/ModalDetails";

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

export default function InvoiceChartsSummary() {
  const { invoices } = useContext(InvoiceContext);

  // Filtry
  const [dateFrom, setDateFrom] = useState(getMonthStart());
  const [dateTo, setDateTo] = useState(getMonthEnd());
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Stan sortowania
  const [sortKey, setSortKey] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Stan szczegółów faktury
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Filtrowanie faktur
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const dateOk =
        (!dateFrom || invoice.date >= dateFrom) &&
        (!dateTo || invoice.date <= dateTo);

      const categoryOk =
        selectedCategories.length === 0 ||
        selectedCategories.includes(invoice.category);

      return dateOk && categoryOk;
    });
  }, [invoices, dateFrom, dateTo, selectedCategories]);

  // Całkowita suma faktur
  const totalInvoiceAmount = useMemo(
    () =>
      filteredInvoices.reduce(
        (sum, invoice) => sum + Number(invoice.amount || 0),
        0
      ),
    [filteredInvoices]
  );

  // Kwoty według kategorii
  const amountByCategory = useMemo(() => {
    const result = {};
    filteredInvoices.forEach((invoice) => {
      const cat = invoice.category || "Brak kategorii";
      result[cat] = (result[cat] || 0) + Number(invoice.amount || 0);
    });
    return result;
  }, [filteredInvoices]);

  // Dane do wykresu kołowego
  const pieCategoryData = useMemo(
    () => ({
      labels: Object.keys(amountByCategory),
      datasets: [
        {
          label: "Kwota faktur wg kategorii",
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

  // Dane do wykresu słupkowego (ChartsChart)
  const barCategoryData = useMemo(
    () => ({
      labels: Object.keys(amountByCategory),
      datasets: [
        {
          label: "Kwota faktur wg kategorii",
          data: Object.values(amountByCategory),
          backgroundColor: [
            "#FF9F40",
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
  const sortedInvoices = useMemo(() => {
    const sorted = [...filteredInvoices];
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

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredInvoices, sortKey, sortOrder]);

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
      render: (i) => i.category || "Brak kategorii",
    },
    {
      key: "amount",
      label: "Kwota",
      sortable: true,
      render: (i) => i.amount?.toFixed(2) + " zł",
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
    invoices.forEach((invoice) => {
      set.add(invoice.category || "Brak kategorii");
    });
    return Array.from(set);
  }, [invoices]);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-10">
      <h3 className="text-2xl font-bold text-orange-700 mb-6 text-center">
        Podsumowanie faktur
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
            className="border border-orange-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
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
            className="border border-orange-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
          />
        </div>
      </div>
      <div className="text-lg font-semibold mb-8 text-center">
        Całkowita kwota:{" "}
        <span className="text-orange-700">
          {totalInvoiceAmount.toFixed(2)} zł
        </span>
      </div>
      {/* Wykresy wg kategorii */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-1/2 flex flex-col gap-8">
          <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <h4 className="text-lg font-bold text-gray-700 mb-2">
              Wykres kołowy wg kategorii
            </h4>
            <ChartsPie
              data={pieCategoryData}
              title="Kwoty faktur wg kategorii"
            />
          </div>
        </div>
        <div className="md:w-1/2 flex flex-col gap-8">
          <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <h4 className="text-lg font-bold text-gray-700 mb-2">
              Wykres słupkowy wg kategorii
            </h4>
            <ChartsBar
              data={barCategoryData}
              title="Kwoty faktur wg kategorii"
              type="bar"
            />
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
                      ? "bg-orange-100 text-orange-700 font-bold"
                      : "hover:bg-orange-50"
                  }`}
                  onClick={() => handleCategoryClick(cat)}
                  tabIndex={0}
                  aria-pressed={selectedCategories.includes(cat)}
                  role="button"
                >
                  <span className="font-semibold">{cat}</span>
                  {amountByCategory[cat] !== undefined && (
                    <span className="text-orange-700 font-medium">
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
          Tabela faktur
        </h4>
        <div
          className="bg-gray-50 rounded-lg overflow-auto shadow-sm"
          style={{ maxHeight: "400px" }}
        >
          <UniversalTable
            data={sortedInvoices}
            columns={tableColumns}
            className="min-w-full"
            onSort={handleSort}
            sortKey={sortKey}
            sortOrder={sortOrder}
            rowsCount={sortedInvoices.length}
            onRowClick={setSelectedInvoice}
          />
        </div>
      </div>
      {selectedInvoice && (
        <ModalDetails
          title={`Faktura: ${selectedInvoice.category || "-"}`}
          onClose={() => setSelectedInvoice(null)}
        >
          <div className="mb-4 text-gray-700">
            <div>
              <span className="font-semibold">Data: </span>
              {selectedInvoice.date
                ? new Date(selectedInvoice.date).toLocaleDateString("pl-PL")
                : "-"}
            </div>
            <div>
              <span className="font-semibold">Kategoria: </span>
              {selectedInvoice.category || "-"}
            </div>
            <div>
              <span className="font-semibold">Kwota: </span>
              {selectedInvoice.amount !== undefined &&
              selectedInvoice.amount !== null
                ? Number(selectedInvoice.amount).toFixed(2) + " zł"
                : "-"}
            </div>
            <div>
              <span className="font-semibold">Opis: </span>
              {selectedInvoice.description || "-"}
            </div>
          </div>
        </ModalDetails>
      )}
    </div>
  );
}
