export default function ChartsMenu({ activeTab, setActiveTab }) {
  return (
    <div className="w-[300px] self-start mt-8">
      <div className="bg-gray-100 rounded-lg shadow py-4 px-3 flex flex-col gap-2 sticky top-24">
        <button
          type="button"
          onClick={() => {
            setActiveTab("AllSummary");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`text-lg py-2 px-4 rounded transition font-medium text-right ${
            activeTab === "AllSummary"
              ? "bg-orange-500 text-white shadow"
              : "hover:bg-gray-200 text-gray-700"
          }`}
        >
          Podsumowanie całości
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("IncomeChartsSummary");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`text-lg py-2 px-4 rounded transition font-medium text-right ${
            activeTab === "IncomeChartsSummary"
              ? "bg-orange-500 text-white shadow"
              : "hover:bg-gray-200 text-gray-700"
          }`}
        >
          Podsumowanie przychodów
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("InvoiceChartsSummary");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`text-lg py-2 px-4 rounded transition font-medium text-right ${
            activeTab === "InvoiceChartsSummary"
              ? "bg-orange-500 text-white shadow"
              : "hover:bg-gray-200 text-gray-700"
          }`}
        >
          Podsumowanie faktur
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("ReceiptsChartsSummary");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`text-lg py-2 px-4 rounded transition font-medium text-right ${
            activeTab === "ReceiptsChartsSummary"
              ? "bg-orange-500 text-white shadow"
              : "hover:bg-gray-200 text-gray-700"
          }`}
        >
          Podsumowanie paragonów
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("SubsChartsSummary");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`text-lg py-2 px-4 rounded transition font-medium text-right ${
            activeTab === "SubsChartsSummary"
              ? "bg-orange-500 text-white shadow"
              : "hover:bg-gray-200 text-gray-700"
          }`}
        >
          Podsumowanie subskrypcji
        </button>
      </div>
    </div>
  );
}
