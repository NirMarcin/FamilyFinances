import React, { useContext, useMemo, useState } from "react";
import IncomeContext from "../../contexts/IncomeContext";
import ReceiptsContext from "../../contexts/ReceiptsContext";
import InvoiceContext from "../../contexts/InvoiceContext";
import SubsContext from "../../contexts/SubsContext";
import ChartsPie from "./ChartsPie";
import ChartsBar from "./ChartsBar";
import AllTable from "./AllTable";

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

export default function AllSummary() {
  const { incomes } = useContext(IncomeContext);
  const { receipts } = useContext(ReceiptsContext);
  const { invoices } = useContext(InvoiceContext);
  const { subs } = useContext(SubsContext);

  // Filtry daty
  const [dateFrom, setDateFrom] = useState(getMonthStart());
  const [dateTo, setDateTo] = useState(getMonthEnd());

  // Dodaj stan dla źródła wydatków
  const [selectedExpenseSource, setSelectedExpenseSource] = useState("");

  // Lista źródeł wydatków
  const expenseSources = [
    { key: "", label: "Wszystkie" },
    { key: "receipts", label: "Paragony" },
    { key: "invoices", label: "Faktury" },
    { key: "subs", label: "Subskrypcje" },
  ];

  // Filtrowanie po dacie
  const filteredIncomes = useMemo(() => {
    return incomes.filter(
      (inc) =>
        (!dateFrom || inc.date >= dateFrom) && (!dateTo || inc.date <= dateTo)
    );
  }, [incomes, dateFrom, dateTo]);

  // Filtrowanie po dacie i źródle
  const filteredReceipts = useMemo(() => {
    if (selectedExpenseSource && selectedExpenseSource !== "receipts") return [];
    return receipts.filter(
      (r) => (!dateFrom || r.date >= dateFrom) && (!dateTo || r.date <= dateTo)
    );
  }, [receipts, dateFrom, dateTo, selectedExpenseSource]);

  const filteredInvoices = useMemo(() => {
    if (selectedExpenseSource && selectedExpenseSource !== "invoices") return [];
    return invoices.filter(
      (inv) =>
        (!dateFrom || inv.date >= dateFrom) && (!dateTo || inv.date <= dateTo)
    );
  }, [invoices, dateFrom, dateTo, selectedExpenseSource]);

  const filteredSubs = useMemo(() => {
    if (selectedExpenseSource && selectedExpenseSource !== "subs") return [];
    return subs.filter(
      (sub) =>
        (!dateFrom || sub.date >= dateFrom) && (!dateTo || sub.date <= dateTo)
    );
  }, [subs, dateFrom, dateTo, selectedExpenseSource]);

  // Suma przychodów
  const totalIncome = useMemo(
    () =>
      filteredIncomes.reduce(
        (sum, inc) => sum + Math.abs(Number(inc.amount || 0)),
        0
      ),
    [filteredIncomes]
  );

  // Suma wydatków (paragony, faktury, subskrypcje)
  const totalReceipts = useMemo(
    () =>
      filteredReceipts.reduce(
        (sum, r) => sum + Math.abs(Number(r.amount || 0)),
        0
      ),
    [filteredReceipts]
  );
  const totalInvoices = useMemo(
    () =>
      filteredInvoices.reduce(
        (sum, inv) => sum + Math.abs(Number(inv.amount || 0)),
        0
      ),
    [filteredInvoices]
  );
  const totalSubs = useMemo(
    () =>
      filteredSubs.reduce(
        (sum, sub) => sum + Math.abs(Number(sub.amount || 0)),
        0
      ),
    [filteredSubs]
  );

  const totalExpense = totalReceipts + totalInvoices + totalSubs;

  // Dane do wykresów
  const pieData = {
    labels: ["Przychody", "Wydatki"],
    datasets: [
      {
        data: [totalIncome, totalExpense],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  const barData = {
    labels: ["Przychody", "Wydatki"],
    datasets: [
      {
        label: "Suma",
        data: [totalIncome, totalExpense],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-10">
      <h3 className="text-2xl font-bold text-orange-700 mb-6 text-center">
        Podsumowanie całości
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
        <div className="flex flex-col">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Źródło wydatków:
          </label>
          <select
            value={selectedExpenseSource}
            onChange={(e) => setSelectedExpenseSource(e.target.value)}
            className="border border-orange-300 rounded px-2 py-1 w-full"
          >
            {expenseSources.map((src) => (
              <option key={src.key} value={src.key}>
                {src.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="text-lg font-semibold mb-4 text-center">
        Suma przychodów:{" "}
        <span className="text-green-700">{totalIncome.toFixed(2)} zł</span>
        <br />
        Suma wydatków:{" "}
        <span className="text-red-700">{totalExpense.toFixed(2)} zł</span>
      </div>
      <div className="flex flex-col md:flex-row gap-8 justify-center mb-8">
        <div className="md:w-1/2 flex flex-col items-center">
          <h4 className="text-lg font-bold text-gray-700 mb-2 text-center">
            Wykres kołowy: Przychody vs Wydatki
          </h4>
          <ChartsPie data={pieData} title="Przychody vs Wydatki" />
        </div>
        <div className="md:w-1/2 flex flex-col items-center">
          <h4 className="text-lg font-bold text-gray-700 mb-2 text-center">
            Wykres słupkowy: Przychody vs Wydatki
          </h4>
          <ChartsBar data={barData} title="Przychody vs Wydatki" />
        </div>
      </div>
      {/* Tabela pod wykresami */}
      <AllTable />
    </div>
  );
}
