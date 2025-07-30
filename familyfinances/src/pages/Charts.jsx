import React, { useContext, useState, useMemo } from "react";
import ReceiptsContext from "../contexts/ReceiptsContext";
import InvoiceContext from "../contexts/InvoiceContext";
import IncomeContext from "../contexts/IncomeContext"; // <-- dodaj import
import ChartsFilters from "../components/ChartsManager/ChartsFilters";
import ChartsNav from "../components/ChartsManager/ChartsBanner";
import Navbar from "../components/Navbar";
import ChartsMain from "../components/ChartsManager/ChartsMain";
import calcTotal from "../utils/calcTotal";

export default function Charts() {
  // Pobierz dane z contextów
  const { receipts = [], shops = [] } = useContext(ReceiptsContext);
  const { transactions = [], categories = [] } = useContext(InvoiceContext);
  const { incomes = [] } = useContext(IncomeContext); // <-- pobierz przychody

  // Stany filtrów
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [shop, setShop] = useState("");

  // Zbierz wszystkie kategorie z receipts, transactions i incomes
  const receiptCategories = useMemo(
    () =>
      Array.from(
        new Set(receipts.flatMap((r) => r.products.map((p) => p.category)))
      ),
    [receipts]
  );
  const transactionCategories = useMemo(
    () => Array.from(new Set(transactions.map((t) => t.category))),
    [transactions]
  );
  const incomeCategories = useMemo(
    () => Array.from(new Set(incomes.map((i) => i.category))),
    [incomes]
  );
  const allCategories = useMemo(
    () =>
      Array.from(
        new Set([
          ...categories.map((c) => c.name),
          ...receiptCategories,
          ...transactionCategories,
          ...incomeCategories,
        ])
      ).filter(Boolean),
    [categories, receiptCategories, transactionCategories, incomeCategories]
  );

  // Filtrowanie receipts
  const filteredReceipts = useMemo(() => {
    return receipts.filter((r) => {
      const date = new Date(r.date);
      const from = dateRange.from ? new Date(dateRange.from) : null;
      const to = dateRange.to ? new Date(dateRange.to) : null;
      const matchDate = (!from || date >= from) && (!to || date <= to);
      const matchCategory =
        !category || r.products.some((p) => p.category === category);
      const matchShop = !shop || r.storeName === shop;
      return matchDate && matchCategory && matchShop;
    });
  }, [receipts, dateRange, category, shop]);

  // Filtrowanie transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const date = new Date(t.date);
      const from = dateRange.from ? new Date(dateRange.from) : null;
      const to = dateRange.to ? new Date(dateRange.to) : null;
      const matchDate = (!from || date >= from) && (!to || date <= to);
      const matchCategory = !category || t.category === category;
      return matchDate && matchCategory;
    });
  }, [transactions, dateRange, category]);

  // Filtrowanie incomes
  const filteredIncomes = useMemo(() => {
    return incomes.filter((i) => {
      const date = new Date(i.date);
      const from = dateRange.from ? new Date(dateRange.from) : null;
      const to = dateRange.to ? new Date(dateRange.to) : null;
      const matchDate = (!from || date >= from) && (!to || date <= to);
      const matchCategory = !category || i.category === category;
      return matchDate && matchCategory;
    });
  }, [incomes, dateRange, category]);

  // Wybierz źródło danych na podstawie typu
  const dataSource =
    type === "receipts"
      ? filteredReceipts
      : type === "invoices"
      ? filteredTransactions
      : type === "incomes"
      ? filteredIncomes
      : [...filteredReceipts, ...filteredTransactions, ...filteredIncomes];

  // PieChart: udział wg kategorii (wydatki i przychody)
  const pieData = useMemo(() => {
    const map = {};
    if (type === "receipts" || type === "") {
      filteredReceipts.forEach((r) =>
        r.products.forEach((p) => {
          if (!category || p.category === category) {
            map[p.category] = (map[p.category] || 0) + Number(p.price || 0); // DODATNIE
          }
        })
      );
    }
    if (type === "invoices" || type === "") {
      filteredTransactions.forEach((t) => {
        if (!category || t.category === category) {
          map[t.category] = (map[t.category] || 0) + Number(t.amount || 0); // DODATNIE
        }
      });
    }
    if (type === "incomes" || type === "") {
      filteredIncomes.forEach((i) => {
        if (!category || i.category === category) {
          map[i.category] = (map[i.category] || 0) + Number(i.amount || 0); // DODATNIE
        }
      });
    }
    return Object.entries(map)
      .filter(([cat]) => cat)
      .map(([cat, value]) => ({ name: cat, value }));
  }, [filteredReceipts, filteredTransactions, filteredIncomes, type, category]);

  // BarChart: suma w miesiącach (wydatki i przychody osobno)
  const barData = useMemo(() => {
    const map = {};
    // Wydatki (paragony i rachunki)
    [...filteredReceipts, ...filteredTransactions].forEach((item) => {
      const date = new Date(item.date);
      const month = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      let amount = 0;
      if (item.products) {
        amount = calcTotal(item.products);
      } else if (item.amount && item.category) {
        amount = Number(item.amount || 0);
      }
      map[month] = map[month] || { month, expenses: 0, income: 0 };
      map[month].expenses += amount;
    });
    // Przychody
    filteredIncomes.forEach((item) => {
      const date = new Date(item.date);
      const month = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      map[month] = map[month] || { month, expenses: 0, income: 0 };
      map[month].income += Number(item.amount || 0);
    });
    return Object.values(map).sort((a, b) => a.month.localeCompare(b.month));
  }, [filteredReceipts, filteredTransactions, filteredIncomes, calcTotal]);

  // LineChart: trend w czasie (dzień)
  const lineData = useMemo(() => {
    // 1. Wyznacz zakres dat (ostatnie 3 miesiące)
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth() - 2, 1); // początek 3 miesiące temu
    const end = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ); // dziś

    // 2. Zbuduj mapę z danymi
    const map = {};
    // Wydatki
    [...filteredReceipts, ...filteredTransactions].forEach((item) => {
      const dateStr =
        typeof item.date === "string"
          ? item.date.slice(0, 10)
          : item.date instanceof Date
          ? item.date.toISOString().slice(0, 10)
          : "";
      let amount = 0;
      if (item.products) {
        amount = calcTotal(item.products);
      } else if (item.amount && item.category) {
        amount = Number(item.amount || 0);
      }
      if (dateStr) {
        map[dateStr] = map[dateStr] || {
          date: dateStr,
          expenses: 0,
          income: 0,
        };
        map[dateStr].expenses += amount;
      }
    });
    // Przychody
    filteredIncomes.forEach((item) => {
      const dateStr =
        typeof item.date === "string"
          ? item.date.slice(0, 10)
          : item.date instanceof Date
          ? item.date.toISOString().slice(0, 10)
          : "";
      if (dateStr) {
        map[dateStr] = map[dateStr] || {
          date: dateStr,
          expenses: 0,
          income: 0,
        };
        map[dateStr].income += Number(item.amount || 0);
      }
    });

    // 3. Uzupełnij brakujące dni zerami
    const result = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().slice(0, 10);
      result.push(map[dateStr] || { date: dateStr, expenses: 0, income: 0 });
    }

    return result;
  }, [filteredReceipts, filteredTransactions, filteredIncomes, calcTotal]);

  return (
    <>
      <Navbar />
      <ChartsNav />
      <ChartsFilters
        dateRange={dateRange}
        setDateRange={setDateRange}
        category={category}
        setCategory={setCategory}
        type={type}
        setType={setType}
        categories={allCategories}
        shops={shops}
        shop={shop}
        setShop={setShop}
      />
      <ChartsMain pieData={pieData} barData={barData} lineData={lineData} />
    </>
  );
}
