import React, { useContext, useMemo, useState } from "react";
import IncomeContext from "../../contexts/IncomeContext";
import UniversalTable from "../common/UniversalTable";
import ModalDetails from "../modals/ModalDetails";

function IncomeTable() {
  const { incomes } = useContext(IncomeContext);
  const [selectedIncome, setSelectedIncome] = useState(null);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const visibleIncomes = useMemo(() => {
    return (incomes || [])
      .filter((inc) => {
        if (!inc.date) return false;
        const dt = new Date(inc.date);
        return (
          dt.getMonth() === currentMonth && dt.getFullYear() === currentYear
        );
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  }, [incomes, currentMonth, currentYear]);

  const totalSum = useMemo(
    () => visibleIncomes.reduce((sum, inc) => sum + Number(inc.amount), 0),
    [visibleIncomes]
  );

  const monthName = now.toLocaleString("pl-PL", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-2 bg-orange-50 dark:bg-black rounded-lg border border-orange-200 dark:border-gray-800 shadow-inner transition-colors duration-300">
      <h2 className="text-xl font-bold mb-2 text-center text-orange-700 dark:text-orange-400">
        Przychody – {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
      </h2>
      <UniversalTable
        columns={[
          {
            label: (
              <span className="text-orange-900 dark:text-orange-300">Data</span>
            ),
            key: "date",
            render: (row) =>
              row.date ? new Date(row.date).toLocaleDateString("pl-PL") : "-",
          },
          {
            label: (
              <span className="text-orange-900 dark:text-orange-300">
                Kategoria
              </span>
            ),
            key: "category",
            className: "text-orange-700 dark:text-orange-300 font-medium",
          },
          {
            label: (
              <span className="text-orange-900 dark:text-orange-300">
                Kwota
              </span>
            ),
            key: "amount",
            className: "text-green-700 dark:text-orange-400 font-semibold",
            render: (row) => `${Number(row.amount).toFixed(2)} zł`,
          },
        ]}
        data={visibleIncomes}
        emptyText="Brak przychodów w tym miesiącu."
        rowsCount={10}
        onRowClick={setSelectedIncome}
        footer={
          <tr>
            <td
              colSpan={3}
              className="px-4 py-2 text-right text-orange-900 dark:text-orange-300"
            >
              Suma ostatnich 10 przychodów:
            </td>
            <td className="px-4 py-2 text-right text-green-700 dark:text-orange-400 font-semibold">
              {totalSum.toFixed(2)} zł
            </td>
          </tr>
        }
      />
      {selectedIncome && (
        <ModalDetails
          title={`Przychód: ${selectedIncome.category || "-"}`}
          onClose={() => setSelectedIncome(null)}
        >
          <div className="mb-4 text-gray-700 dark:text-orange-300">
            <div>
              <span className="font-semibold">Kategoria: </span>
              {selectedIncome.category || "-"}
            </div>
            <div>
              <span className="font-semibold">Data: </span>
              {selectedIncome.date
                ? new Date(selectedIncome.date).toLocaleDateString("pl-PL")
                : "-"}
            </div>
            <div>
              <span className="font-semibold">Opis: </span>
              {selectedIncome.description || "-"}
            </div>
            <div className="text-right font-bold text-green-700 dark:text-orange-400 mt-4">
              Kwota:{" "}
              <span className="text-green-700 dark:text-orange-400">
                {Number(selectedIncome.amount).toFixed(2)} zł
              </span>
            </div>
          </div>
        </ModalDetails>
      )}
    </div>
  );
}

export default IncomeTable;
