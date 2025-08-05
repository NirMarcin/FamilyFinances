export default function ChartsMenu({ activeTab, setActiveTab }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-10 py-8 bg-transparent">
      <div className="bg-gray-100 rounded-lg shadow py-2 px-4 flex flex-row gap-4">
        <button
          type="button"
          onClick={() => {
            setActiveTab("IncomeChartsSummary");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`text-lg py-2 px-6 rounded transition font-medium ${
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
          className={`text-lg py-2 px-6 rounded transition font-medium ${
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
          className={`text-lg py-2 px-6 rounded transition font-medium ${
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
          className={`text-lg py-2 px-6 rounded transition font-medium ${
            activeTab === "SubsChartsSummary"
              ? "bg-orange-500 text-white shadow"
              : "hover:bg-gray-200 text-gray-700"
          }`}
        >
          Podsumowanie subskrypcji
        </button>
           <button
          type="button"
          onClick={() => {
            setActiveTab("AllSummary");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`text-lg py-2 px-6 rounded transition font-medium ${
            activeTab === "AllSummary"
              ? "bg-orange-500 text-white shadow"
              : "hover:bg-gray-200 text-gray-700"
          }`}
        >
          Podsumowanie
        </button>
      </div>
    </div>
  );
}
