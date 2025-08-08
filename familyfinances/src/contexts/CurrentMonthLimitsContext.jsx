import React, { createContext, useContext, useMemo } from "react";
import { useBudgetLimits } from "./BudgetLimitsContext";
import InvoiceContext from "./InvoiceContext";
import ReceiptsContext from "./ReceiptsContext";
import SubsContext from "./SubsContext";

const CurrentMonthLimitsContext = createContext();

export function CurrentMonthLimitsProvider({ children }) {
  const { savedLimits } = useBudgetLimits();
  const { invoices } = useContext(InvoiceContext);
  const { receipts } = useContext(ReceiptsContext);
  const { subs } = useContext(SubsContext);

  // Aktualny miesiąc w formacie YYYY-MM
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  // Limity dla aktualnego miesiąca
  const currentLimits = useMemo(() => {
    if (!Array.isArray(savedLimits)) return null;
    return savedLimits.find((l) => l.month === currentMonth) || null;
  }, [savedLimits, currentMonth]);

  // Suma wydatków w aktualnym miesiącu
  const invoicesSum = useMemo(
    () =>
      (invoices || [])
        .filter((inv) => inv.date?.startsWith(currentMonth))
        .reduce((sum, inv) => sum + Math.abs(Number(inv.amount || 0)), 0),
    [invoices, currentMonth]
  );

  const receiptsSum = useMemo(
    () =>
      (receipts || [])
        .filter((r) => r.date?.startsWith(currentMonth))
        .reduce(
          (sum, r) =>
            sum +
            (Array.isArray(r.products)
              ? r.products.reduce(
                  (prodSum, p) => prodSum + Math.abs(Number(p.total || 0)),
                  0
                )
              : 0),
          0
        ),
    [receipts, currentMonth]
  );

  const subsSum = useMemo(
    () =>
      (subs || [])
        .filter((sub) => sub.date?.startsWith(currentMonth))
        .reduce((sum, sub) => sum + Math.abs(Number(sub.amount || 0)), 0),
    [subs, currentMonth]
  );

  const value = {
    currentMonth,
    currentLimits,
    invoicesSum,
    receiptsSum,
    subsSum,
  };

  return (
    <CurrentMonthLimitsContext.Provider value={value}>
      {children}
    </CurrentMonthLimitsContext.Provider>
  );
}

export function useCurrentMonthLimits() {
  return useContext(CurrentMonthLimitsContext);
}
