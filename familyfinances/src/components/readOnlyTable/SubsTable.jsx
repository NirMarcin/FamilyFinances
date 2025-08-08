import React, { useContext, useMemo, useState } from "react";
import SubsContext from "../../contexts/SubsContext";
import UniversalTable from "../common/UniversalTable";
import ModalDetails from "../modals/ModalDetails";
import LimitStatus from "../budgetLimitManager/LimitStatus";

function SubsTable() {
  const { subs } = useContext(SubsContext);
  const [selectedSub, setSelectedSub] = useState(null);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const visibleSubs = useMemo(() => {
    return (subs || [])
      .filter((sub) => {
        if (!sub.date) return false;
        const dt = new Date(sub.date);
        return (
          dt.getMonth() === currentMonth && dt.getFullYear() === currentYear
        );
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  }, [subs, currentMonth, currentYear]);

  const totalSum = useMemo(
    () => visibleSubs.reduce((sum, sub) => sum + Number(sub.amount), 0),
    [visibleSubs]
  );

  const monthName = now.toLocaleString("pl-PL", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-2 bg-orange-50 dark:bg-black rounded-lg border border-orange-200 dark:border-gray-800 shadow-inner transition-colors duration-300">
      <h2 className="text-xl font-bold mb-2 text-center text-orange-700 dark:text-orange-400">
        Subskrypcje – {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
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
              <span className="text-orange-900 dark:text-orange-300">Nazwa</span>
            ),
            key: "name",
            className: "text-orange-700 dark:text-orange-300 font-medium",
          },
          {
            label: (
              <span className="text-orange-900 dark:text-orange-300">Kwota</span>
            ),
            key: "amount",
            className: "text-red-600 dark:text-orange-400 font-semibold",
            render: (row) => `${Number(row.amount).toFixed(2)} zł`,
          },
        ]}
        data={visibleSubs}
        emptyText="Brak subskrypcji w tym miesiącu."
        rowsCount={10}
        onRowClick={setSelectedSub}
        footer={
          <tr>
            <td
              colSpan={3}
              className="px-4 py-2 text-right text-orange-900 dark:text-orange-300"
            >
              Suma ostatnich 10 opłat za subskrypcje:
            </td>
            <td className="px-4 py-2 text-right text-red-600 dark:text-orange-400 font-semibold">
              {totalSum.toFixed(2)} zł
            </td>
          </tr>
        }
      />
      <LimitStatus type="subs" label="Subskrypcje" />
      {selectedSub && (
        <ModalDetails
          title={`Subskrypcja: ${selectedSub.name || "-"}`}
          onClose={() => setSelectedSub(null)}
        >
          <div className="mb-4 text-gray-700 dark:text-orange-300">
            <div>
              <span className="font-semibold">Nazwa: </span>
              {selectedSub.name || "-"}
            </div>
            <div>
              <span className="font-semibold">Kategoria: </span>
              {selectedSub.category || "-"}
            </div>
            <div>
              <span className="font-semibold">Data: </span>
              {selectedSub.date
                ? new Date(selectedSub.date).toLocaleDateString("pl-PL")
                : "-"}
            </div>
            <div>
              <span className="font-semibold">Opis: </span>
              {selectedSub.description || "-"}
            </div>
            <div className="text-right font-bold text-red-600 dark:text-orange-400 mt-4">
              Kwota:{" "}
              <span className="text-red-600 dark:text-orange-400">
                {Number(selectedSub.amount).toFixed(2)} zł
              </span>
            </div>
          </div>
        </ModalDetails>
      )}
    </div>
  );
}

export default SubsTable;
