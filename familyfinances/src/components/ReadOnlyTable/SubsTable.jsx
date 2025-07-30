import React, { useContext, useMemo } from "react";
import SubsContext from "../../contexts/SubsContext";

function SubsTable() {
  const { subs } = useContext(SubsContext);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const visibleSubs = useMemo(() => {
    return (subs || [])
      .filter((sub) => {
        if (!sub.date) return false;
        const dt = new Date(sub.date);
        return dt.getMonth() === currentMonth && dt.getFullYear() === currentYear;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  }, [subs, currentMonth, currentYear]);

  const totalSum = useMemo(
    () => visibleSubs.reduce((sum, sub) => sum + Number(sub.amount), 0),
    [visibleSubs]
  );

  const monthName = now.toLocaleString("pl-PL", { month: "long", year: "numeric" });

  return (
    <div className="overflow-auto p-2">
      <h2 className="text-xl font-bold mb-2 text-center text-orange-700">
        Subskrypcje – {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
      </h2>
      <div className="border border-orange-300 rounded-lg shadow-md bg-white overflow-x-auto">
        <table className="w-full">
          <thead className="bg-orange-200 text-orange-900 font-semibold">
            <tr>
              <th className="px-4 py-2 border-b border-orange-300 text-left">Data</th>
              <th className="px-4 py-2 border-b border-orange-300 text-left">Nazwa</th>
              <th className="px-4 py-2 border-b border-orange-300 text-right">Kwota</th>
              <th className="px-4 py-2 border-b border-orange-300 text-left">Opis</th>
            </tr>
          </thead>
          <tbody>
            {visibleSubs.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  Brak subskrypcji w tym miesiącu.
                </td>
              </tr>
            ) : (
              visibleSubs.map((sub) => (
                <tr key={sub.id} className="border-b border-orange-200">
                  <td className="px-4 py-2 whitespace-nowrap text-left align-middle">
                    {sub.date ? new Date(sub.date).toLocaleDateString("pl-PL") : ""}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-left text-orange-700 font-medium align-middle">
                    {sub.name || "-"}
                  </td>
                  <td className="px-4 py-2 text-right whitespace-nowrap text-green-700 font-semibold align-middle">
                    {Number(sub.amount).toFixed(2)} zł
                  </td>
                  <td className="px-4 py-2 text-left align-middle">
                    {sub.description || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot className="bg-orange-100 font-semibold">
            <tr>
              <td colSpan={2} className="text-right px-4 py-2">
                Razem:
              </td>
              <td className="text-right px-4 py-2">{totalSum.toFixed(2)} zł</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default SubsTable;