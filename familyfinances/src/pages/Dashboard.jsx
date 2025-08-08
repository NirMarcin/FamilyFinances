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
        <span className="block mb-2 font-semibold text-orange-900">
          Witaj w panelu podsumowania!
        </span>
        Na tej stronie znajdziesz po 10 ostatnich transakcji z bieżącego
        miesiąca: rachunki, paragony, przychody, subskrypcje. Dodatkowo znajdują
        się tu limity miesięczne na aktualny miesiąc oraz ostrzeżenia o ich
        przekroczeniu.
        <br />
        <span className="block mt-2">
          Kliknij wybraną pozycję w tabeli, aby zobaczyć szczegóły.
        </span>
      </PagesBanner>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white rounded-lg shadow-lg p-4 border border-orange-200">
            <InvoiceTable />
          </section>
          <section className="bg-white rounded-lg shadow-lg p-4 border border-orange-200">
            <ReceiptsTable />
          </section>
          <section className="bg-white rounded-lg shadow-lg p-4 border border-orange-200">
            <IncomeTable />
          </section>
          <section className="bg-white rounded-lg shadow-lg p-4 border border-orange-200">
            <SubsTable />
          </section>
        </div>
      </main>
    </>
  );
}
