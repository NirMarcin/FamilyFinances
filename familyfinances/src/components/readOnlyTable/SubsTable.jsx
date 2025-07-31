import React, { useContext, useMemo, useState } from "react";
import SubsContext from "../../contexts/SubsContext";
import UniversalTable from "../common/UniversalTable";
import ModalDetails from "../modals/ModalDetails";

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
    <div className="p-2">
      <h2 className="text-xl font-bold mb-2 text-center text-orange-700">
        Subskrypcje – {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
      </h2>
      <UniversalTable
        columns={[
          {
            label: <span className="text-orange-900">Data</span>,
            key: "date",
            render: (row) =>
              row.date ? new Date(row.date).toLocaleDateString("pl-PL") : "-",
          },
          {
            label: <span className="text-orange-900">Nazwa</span>,
            key: "name",
            className: "text-orange-700 font-medium",
          },
          {
            label: <span className="text-orange-900">Kwota</span>,
            key: "amount",
            className: "text-red-700 font-semibold",
            render: (row) => `${Number(row.amount).toFixed(2)} zł`,
          },
        ]}
        data={visibleSubs}
        emptyText="Brak subskrypcji w tym miesiącu."
        rowsCount={10}
        onRowClick={setSelectedSub}
        footer={
          <tr>
            <td colSpan={3} className="px-4 py-2 text-right">
              Razem:
            </td>
            <td className="px-4 py-2 text-right text-red-700 font-semibold">
              {totalSum.toFixed(2)} zł
            </td>
          </tr>
        }
      />
      <ModalDetails
        receipt={selectedSub}
        onClose={() => setSelectedSub(null)}
        showProducts={false}
        title={
          selectedSub ? `Subskrypcja: ${selectedSub.name || "-"}` : undefined
        }
        extraInfo={
          selectedSub && (
            <div className="mb-4 text-gray-700">
              <div>
                <span className="font-semibold">Kwota: </span>
                <span className="text-red-700">
                  {Number(selectedSub.amount).toFixed(2)} zł
                </span>
              </div>
              <div>
                <span className="font-semibold">Opis: </span>
                {selectedSub.description || "-"}
              </div>
            </div>
          )
        }
      />
    </div>
  );
}

export default SubsTable;
