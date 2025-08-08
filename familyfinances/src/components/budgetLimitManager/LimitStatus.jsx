import React from "react";
import { useBudgetLimits } from "../../contexts/BudgetLimitsContext";

// Komponent do wyświetlania statusu limitu
export default function LimitStatus({ type, limit, spent, month }) {
  const context = useBudgetLimits();

  let finalLimit = limit;
  let finalSpent = spent;
  let finalMonth = month;

  if (
    (finalLimit === undefined || finalLimit === "" || finalLimit === null) &&
    type &&
    context.currentLimits
  ) {
    finalLimit = Math.abs(context.currentLimits[type]?.limit ?? 0);
  }
  if (finalSpent === undefined && type) {
    if (type === "invoices") finalSpent = context.currentInvoicesSum ?? 0;
    if (type === "receipts") finalSpent = context.currentReceiptsSum ?? 0;
    if (type === "subs") finalSpent = context.currentSubsSum ?? 0;
  }
  if (!finalMonth) finalMonth = context.currentMonth ?? "";

  const numericLimit = Number(finalLimit) || 0;
  const numericSpent = Number(finalSpent) || 0;

  if (!numericLimit || numericLimit <= 0) return null;
  const percent = numericLimit > 0 ? Math.abs(numericSpent) / Math.abs(numericLimit) * 100 : 0;
  let color = "text-green-700 dark:text-orange-400";
  let warning = null;

  if (Math.abs(numericSpent) === Math.abs(numericLimit)) {
    color = "text-yellow-600 font-bold dark:text-orange-400";
    warning = (
      <span className="block mt-1 text-yellow-600 font-bold dark:text-orange-400">
        Osiągnąłeś limit!
      </span>
    );
  } else if (percent > 100) {
    color = "text-red-700 font-bold dark:text-orange-400";
    warning = (
      <span className="block mt-1 text-red-700 font-bold dark:text-orange-400">
        Uwaga!!! Przekroczono limit!
      </span>
    );
  } else if (percent > 75) {
    color = "text-yellow-600 font-bold dark:text-orange-400";
    warning = (
      <span className="block mt-1 text-yellow-600 font-bold dark:text-orange-400">
        Uwaga! Limit wypełniony w ponad 75%! Zwolnij!
      </span>
    );
  }

  return (
    <div
      className={`mt-4 p-4 rounded-lg shadow bg-orange-50 dark:bg-gray-900 border border-orange-200 dark:border-gray-800 flex flex-col items-center transition-colors duration-300 ${color}`}
    >
      <div className="flex flex-row gap-6 mb-2">
        <span className="font-semibold">
          <span className="text-gray-600 dark:text-orange-300">Limit:</span> {numericLimit.toFixed(2)}{" "}
          zł
        </span>
        <span className="font-semibold">
          <span className="text-gray-600 dark:text-orange-300">Wydano:</span> {numericSpent.toFixed(2)}{" "}
          zł
        </span>
      </div>
      <div className="mb-1">{warning}</div>
    </div>
  );
}
