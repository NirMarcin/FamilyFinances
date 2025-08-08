import Navbar from "../components/Navbar";
import InvoiceTable from "../components/readOnlyTable/InvoiceTable";
import ReceiptsTable from "../components/readOnlyTable/ReceiptsTable";
import IncomeTable from "../components/readOnlyTable/IncomeTable";
import SubsTable from "../components/readOnlyTable/SubsTable";
import PagesBanner from "../components/PagesBanner";

export default function Dashboard() {
  const now = new Date();
  const monthName = now.toLocaleString("pl-PL", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Navbar />
      <PagesBanner
        title={`Podsumowanie – ${
          monthName.charAt(0).toUpperCase() + monthName.slice(1)
        }`}
      >
        <span className="block mb-2 font-semibold text-orange-900 dark:text-orange-400">
          Witaj w panelu podsumowania!
        </span>
        <span className="block mb-2 text-gray-800 dark:text-orange-300">
          Na tej stronie znajdziesz po 10 ostatnich transakcji z bieżącego
          miesiąca: rachunki, paragony, przychody, subskrypcje. Dodatkowo znajdują
          się tu limity miesięczne na aktualny miesiąc oraz ostrzeżenia o ich
          przekroczeniu.
        </span>
        <span className="block mt-2 text-gray-700 dark:text-orange-200">
          Kliknij wybraną pozycję w tabeli, aby zobaczyć szczegóły.
        </span>
      </PagesBanner>
      <main className="max-w-6xl mx-auto px-4 py-8 dark:bg-black transition-colors duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 border border-orange-200 dark:border-gray-800 transition-colors duration-300">
            <InvoiceTable />
          </section>
          <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 border border-orange-200 dark:border-gray-800 transition-colors duration-300">
            <ReceiptsTable />
          </section>
          <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 border border-orange-200 dark:border-gray-800 transition-colors duration-300">
            <IncomeTable />
          </section>
          <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 border border-orange-200 dark:border-gray-800 transition-colors duration-300">
            <SubsTable />
          </section>
        </div>
      </main>
    </>
  );
}
