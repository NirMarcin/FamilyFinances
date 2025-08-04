import React, { useContext, useState } from "react";
import UniversalList from "../common/UniversalList";
import SubsContext from "../../contexts/SubsContext";
import ModalDetails from "../modals/ModalDetails";

function getMonthsActive(startDate) {
  const start = new Date(startDate);
  const now = new Date();
  return (
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth()) +
    (now.getDate() >= start.getDate() ? 0 : -1)
  );
}

function getNextPaymentDate(date, interval) {
  const start = new Date(date);
  const now = new Date();
  let monthsPassed = getMonthsActive(date);
  let next = new Date(start);
  next.setMonth(
    start.getMonth() + Math.ceil((monthsPassed + 1) / interval) * interval
  );
  if (next < now) next.setMonth(next.getMonth() + interval);
  return next.toLocaleDateString("pl-PL");
}

export default function SubsList() {
  const { subs, deleteSub, disableSub } = useContext(SubsContext);

  // Stan modali
  const [modalDisable, setModalDisable] = useState(null);

  // Pokaż tylko subskrypcje aktywne
  const activeSubs = subs.filter((sub) => sub.active !== false);

  // Unikalne subskrypcje po nazwie
  const uniqueSubs = Object.values(
    activeSubs.reduce((acc, sub) => {
      // Jeśli subskrypcja już istnieje, wybierz tę z najwcześniejszą datą
      if (
        !acc[sub.subscriptionId] ||
        new Date(sub.date) < new Date(acc[sub.subscriptionId].date)
      ) {
        acc[sub.subscriptionId] = { ...sub, subscriptionInfo: "" };
      }
      return acc;
    }, {})
  );

  if (!uniqueSubs.length) {
    return (
      <section className="mt-10 p-5 border border-gray-300 rounded-lg bg-orange-50 shadow-inner">
        <h2 className="text-2xl font-extrabold mb-6 text-orange-700 text-center">
          Aktywne subskrypcje
        </h2>
        <p className="text-center text-gray-500">Brak aktywnych subskrypcji.</p>
      </section>
    );
  }

  return (
    <section className="mt-10 p-5 border border-gray-300 rounded-lg bg-orange-50 shadow-inner">
      <h2 className="text-2xl font-extrabold mb-6 text-orange-700 text-center">
        Aktywne subskrypcje
      </h2>
      <UniversalList
        data={uniqueSubs}
        columns={[
          {
            key: "subscriptionInfo",
            label: "Subskrypcja",
            render: (item) => (
              <div>
                <div>
                  <span className="font-semibold">Rozpoczęcie: </span>
                  {item.startDate
                    ? new Date(item.startDate).toLocaleDateString("pl-PL")
                    : "-"}
                </div>
                <div>
                  <span className="font-semibold">Trwa: </span>
                  {item.startDate
                    ? getMonthsActive(item.startDate) + " mies."
                    : "-"}
                </div>
                <div>
                  <span className="font-semibold">Kolejna płatność: </span>
                  {getNextPaymentDate(item.date, item.interval)}
                </div>
              </div>
            ),
          },
          { key: "name", label: "Nazwa" },
          { key: "category", label: "Kategoria" },
          {
            key: "amount",
            label: "Kwota (zł)",
            align: "text-right",
            render: (item) => (
              <span className="text-orange-700 font-semibold">
                {Number(item.amount).toFixed(2)} zł
              </span>
            ),
          },
          {
            key: "interval",
            label: "Interwał (mies.)",
            align: "text-center",
          },
          {
            key: "actions",
            label: "Akcje",
            render: (item) =>
              item.active !== false ? (
                <button
                  className="bg-red-200 hover:bg-red-400 text-red-800 font-bold py-1 px-4 rounded shadow"
                  onClick={() => setModalDisable(item)}
                >
                  Wyłącz
                </button>
              ) : (
                <span className="text-gray-400 font-semibold">Wyłączona</span>
              ),
          },
        ]}
        onDelete={(item) => {
          subs
            .filter((sub) => sub.subscriptionId === item.subscriptionId)
            .forEach((sub) => deleteSub(sub.id));
        }}
        deleteConfirmTitle="Potwierdź usunięcie"
        deleteConfirmMessage={
          <>
            Czy na pewno chcesz usunąć tę subskrypcję?
            <br />
            <span className="pl-4 block text-gray-500">
              Usunięcie jest nieodwracalne i usunie wszystkie dodane płatności.
            </span>
          </>
        }
      />

      {/* Modal potwierdzający wyłączenie */}
      {modalDisable && (
        <ModalDetails
          title="Potwierdź wyłączenie"
          onClose={() => setModalDisable(null)}
        >
          <div>
            Czy na pewno chcesz wyłączyć tę subskrypcję?
            <br />
            <span className="pl-4 block text-gray-500">
              Wyłączona subskrypcja nie będzie już generować nowych płatności.
            </span>
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded shadow"
                onClick={() => setModalDisable(null)}
              >
                Anuluj
              </button>
              <button
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded shadow"
                onClick={() => {
                  disableSub(modalDisable.subscriptionId);
                  setModalDisable(null);
                }}
              >
                Wyłącz
              </button>
            </div>
          </div>
        </ModalDetails>
      )}
    </section>
  );
}
