import Navbar from "../components/Navbar";
import InvoiceTable from "../components/ReadOnlyTable/InvoiceTable";
import ReceiptsTable from "../components/ReadOnlyTable/ReceiptsTable";
import IncomeTable from "../components/ReadOnlyTable/IncomeTable";
import SubsTable from "../components/ReadOnlyTable/SubsTable";

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-orange-700 mb-8 text-center">
          Podsumowanie miesiąca
        </h1>
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
