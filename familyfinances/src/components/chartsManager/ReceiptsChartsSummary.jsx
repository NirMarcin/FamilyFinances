import React, { useContext, useMemo, useState } from "react";
import ReceiptsContext from "../../contexts/ReceiptsContext";
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

export default function ReceiptsChartsSummary() {
  const { receipts } = useContext(ReceiptsContext);

  // Filtry
  const [dateFrom, setDateFrom] = useState(getMonthStart());
  const [dateTo, setDateTo] = useState(getMonthEnd());
  const [selectedShops, setSelectedShops] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Stan sortowania
  const [sortKey, setSortKey] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Stan szczegółów paragonu
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Filtrowanie paragonów
  const filteredReceipts = useMemo(() => {
    return receipts.filter((receipt) => {
      const dateOk =
        (!dateFrom || receipt.date >= dateFrom) &&
        (!dateTo || receipt.date <= dateTo);

      const shop = receipt.store || receipt.shop || "Nieznany";
      const shopOk = selectedShops.length === 0 || selectedShops.includes(shop);

      // Zmieniony warunek filtrowania kategorii
      const categoryOk =
        selectedCategories.length === 0 ||
        (receipt.products || []).some((p) =>
          selectedCategories.includes(p.category || "Brak kategorii")
        );
      return dateOk && shopOk && categoryOk;
    });
  }, [receipts, dateFrom, dateTo, selectedShops, selectedCategories]);

  // Suma kwot każdego paragonu
  const filteredReceiptsWithAmount = filteredReceipts.map((receipt) => ({
    ...receipt,
    amount: (receipt.products || []).reduce(
      (sum, p) => sum + Number(p.total || 0),
      0
    ),
  }));

  // Całkowita suma wszystkich paragonów
  const totalReceiptsAmount = useMemo(
    () => filteredReceiptsWithAmount.reduce((sum, r) => sum + r.amount, 0),
    [filteredReceiptsWithAmount]
  );

  // Kwoty według sklepów
  const amountByShop = useMemo(() => {
    const result = {};
    filteredReceiptsWithAmount.forEach((receipt) => {
      const shop = receipt.store || receipt.shop || "Nieznany";
      result[shop] = (result[shop] || 0) + receipt.amount;
    });
    return result;
  }, [filteredReceiptsWithAmount]);

  // Kwoty według kategorii - tylko wybrane kategorie
  const amountByCategory = useMemo(() => {
    const result = {};
    filteredReceiptsWithAmount.forEach((receipt) => {
      (receipt.products || []).forEach((product) => {
        const cat = product.category || "Brak kategorii";
        // Dodaj tylko jeśli jest wybrana lub nie wybrano żadnej
        if (
          selectedCategories.length === 0 ||
          selectedCategories.includes(cat)
        ) {
          result[cat] = (result[cat] || 0) + Number(product.total || 0);
        }
      });
    });
    // Jeśli wybrano kategorie, pokazuj tylko wybrane
    if (selectedCategories.length > 0) {
      const filteredResult = {};
      selectedCategories.forEach((cat) => {
        if (result[cat]) filteredResult[cat] = result[cat];
      });
      return filteredResult;
    }
    return result;
  }, [filteredReceiptsWithAmount, selectedCategories]);

  // Dane do wykresów
  const pieShopData = useMemo(
    () => ({
      labels: Object.keys(amountByShop),
      datasets: [
        {
          label: "Kwota paragonów wg sklepu",
          data: Object.values(amountByShop),
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
    [amountByShop]
  );

  const pieCategoryData = useMemo(
    () => ({
      labels: Object.keys(amountByCategory),
      datasets: [
        {
          label: "Kwota paragonów wg kategorii",
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

  // Obsługa kliknięcia w sklep/kategorię (wielokrotny wybór)
  const handleShopClick = (shop) => {
    setSelectedShops((prev) =>
      prev.includes(shop) ? prev.filter((s) => s !== shop) : [...prev, shop]
    );
  };
  const handleCategoryClick = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Funkcja sortująca
  const sortedReceipts = useMemo(() => {
    const sorted = [...filteredReceiptsWithAmount];
    sorted.sort((a, b) => {
      let aValue = a[sortKey];
      let bValue = b[sortKey];

      // Specjalne sortowanie dla kolumny "amount"
      if (sortKey === "amount") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      // Specjalne sortowanie dla kolumny "products" (kategorie)
      if (sortKey === "products") {
        aValue = [
          ...new Set(
            (a.products || []).map((p) => p.category || "Brak kategorii")
          ),
        ].join(", ");
        bValue = [
          ...new Set(
            (b.products || []).map((p) => p.category || "Brak kategorii")
          ),
        ].join(", ");
      }

      // Specjalne sortowanie dla sklepu
      if (sortKey === "store") {
        aValue = a.store || a.shop || "Nieznany";
        bValue = b.store || b.shop || "Nieznany";
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredReceiptsWithAmount, sortKey, sortOrder]);

  // Kolumny do tabeli z obsługą sortowania
  const tableColumns = [
    {
      key: "date",
      label: "Data",
      sortable: true,
      render: (r) => r.date,
    },
    {
      key: "store",
      label: "Sklep",
      sortable: true,
      render: (r) => r.store || r.shop || "Nieznany",
    },
    {
      key: "products",
      label: "Kategorie",
      sortable: true,
      render: (r) =>
        [
          ...new Set(
            (r.products || []).map((p) => p.category || "Brak kategorii")
          ),
        ].join(", "),
    },
    {
      key: "amount",
      label: "Kwota",
      sortable: true,
      render: (r) => r.amount?.toFixed(2) + " zł",
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

  const allCategories = useMemo(() => {
    const set = new Set();
    receipts.forEach((receipt) => {
      (receipt.products || []).forEach((product) => {
        set.add(product.category || "Brak kategorii");
      });
    });
    return Array.from(set);
  }, [receipts]);

  // Lista wszystkich sklepów z wszystkich paragonów
  const allShops = useMemo(() => {
    const set = new Set();
    receipts.forEach((receipt) => {
      set.add(receipt.store || receipt.shop || "Nieznany");
    });
    return Array.from(set);
  }, [receipts]);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-10">
      <ExportSubsButton
        data={filteredReceiptsWithAmount}
        columns={tableColumns}
        buttonLabel="Eksportuj paragony do CSV"
        filename="paragony.csv"
      />
      <h3 className="text-2xl font-bold text-orange-700 mb-6 text-center">
        Podsumowanie paragonów
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
          {totalReceiptsAmount.toFixed(2)} zł
        </span>
      </div>
      {/* Wykresy */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-1/2 flex flex-col gap-8">
          <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <h4 className="text-lg font-bold text-gray-700 mb-2">
              Wykres wg sklepów
            </h4>
            <ChartsPie data={pieShopData} title="Kwoty paragonów wg sklepów" />
          </div>
        </div>
        <div className="md:w-1/2 flex flex-col gap-8">
          <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <h4 className="text-lg font-bold text-gray-700 mb-2">
              Wykres wg kategorii
            </h4>
            <ChartsPie
              data={pieCategoryData}
              title="Kwoty paragonów wg kategorii"
            />
          </div>
        </div>
      </div>
      {/* Listy do filtrowania */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-1/2 flex flex-col gap-8">
          <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <h4 className="text-lg font-bold text-gray-700 mb-2">
              Filtrowanie po sklepach
            </h4>
            <ul className="list-none text-gray-800">
              {allShops.map((shop) => (
                <li
                  key={shop}
                  className={`flex items-center justify-between cursor-pointer mb-1 px-2 py-1 rounded transition ${
                    selectedShops.includes(shop)
                      ? "bg-orange-100 text-orange-700 font-bold"
                      : "hover:bg-orange-50"
                  }`}
                  onClick={() => handleShopClick(shop)}
                  tabIndex={0}
                  aria-pressed={selectedShops.includes(shop)}
                  role="button"
                >
                  <span className="font-semibold">{shop}</span>
                  {amountByShop[shop] !== undefined && (
                    <span className="text-orange-700 font-medium">
                      {amountByShop[shop].toFixed(2)} zł
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="md:w-1/2 flex flex-col gap-8">
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
          Tabela paragonów
        </h4>
        <div
          className="bg-gray-50 rounded-lg overflow-auto shadow-sm"
          style={{ maxHeight: "400px" }}
        >
          <UniversalTable
            data={sortedReceipts}
            columns={tableColumns}
            className="min-w-full"
            onSort={handleSort}
            sortKey={sortKey}
            sortOrder={sortOrder}
            rowsCount={sortedReceipts.length}
            onRowClick={setSelectedReceipt}
          />
        </div>
      </div>
      {selectedReceipt && (
        <ModalDetails
          title={`Paragon: ${
            selectedReceipt.store || selectedReceipt.shop || "-"
          }`}
          onClose={() => setSelectedReceipt(null)}
        >
          <div className="mb-4 text-gray-700">
            <div>
              <span className="font-semibold">Sklep: </span>
              {selectedReceipt.store === "Inny"
                ? selectedReceipt.customStoreName
                : selectedReceipt.store || selectedReceipt.shop || "-"}
            </div>
            <div>
              <span className="font-semibold">Data: </span>
              {selectedReceipt.date
                ? new Date(selectedReceipt.date).toLocaleDateString("pl-PL")
                : "-"}
            </div>
          </div>
          <table className="w-full mb-4">
            <thead>
              <tr>
                <th className="border border-orange-300 p-3 text-left">
                  Produkt
                </th>
                <th className="border border-orange-300 p-3 text-left">
                  Kategoria
                </th>
                <th className="border border-orange-300 p-3 text-right">
                  Ilość
                </th>
                <th className="border border-orange-300 p-3 text-right">
                  Cena jednostkowa (zł)
                </th>
                <th className="border border-orange-300 p-3 text-right">
                  Suma produktu (zł)
                </th>
              </tr>
            </thead>
            <tbody>
              {(selectedReceipt.products || []).map((p, idx) => (
                <tr
                  key={p.id ?? idx}
                  className={idx % 2 === 1 ? "bg-orange-100" : ""}
                >
                  <td className="border border-orange-300 p-3">{p.name}</td>
                  <td className="border border-orange-300 p-3">{p.category}</td>
                  <td className="border border-orange-300 p-3 text-right">
                    {p.quantity}
                  </td>
                  <td className="border border-orange-300 p-3 text-right">
                    {p.unitPrice !== undefined && p.unitPrice !== null
                      ? Number(p.unitPrice).toFixed(2)
                      : "-"}
                  </td>
                  <td className="border border-orange-300 p-3 text-right">
                    {p.total !== undefined && p.total !== null
                      ? Number(p.total).toFixed(2)
                      : p.quantity && p.unitPrice
                      ? (Number(p.quantity) * Number(p.unitPrice)).toFixed(2)
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right font-bold text-orange-700 mb-2">
            Suma całkowita rachunku:{" "}
            {(selectedReceipt.products || [])
              .reduce(
                (sum, p) =>
                  sum +
                  (p.total !== undefined && p.total !== null
                    ? p.total
                    : (p.quantity ?? 0) * (p.unitPrice ?? 0)),
                0
              )
              .toFixed(2)}{" "}
            zł
          </div>
        </ModalDetails>
      )}
    </div>
  );
}
