export default function ExpansesMenu({ activeTab, setActiveTab }) {
  return (
    <div className="w-[250px] self-start mt-8">
      <div className="bg-gray-100 rounded-lg shadow py-4 px-3 flex flex-col gap-2 sticky top-24">
        <button
          type="button"
          onClick={() => {
            setActiveTab("income");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`text-lg py-2 px-4 rounded transition font-medium text-right ${
            activeTab === "income"
              ? "bg-orange-500 text-white shadow"
              : "hover:bg-gray-200 text-gray-700"
          }`}
        >
          Dodaj przychód
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("expenses");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`text-lg py-2 px-4 rounded transition font-medium text-right ${
            activeTab === "expenses"
              ? "bg-orange-500 text-white shadow"
              : "hover:bg-gray-200 text-gray-700"
          }`}
        >
          Dodaj rachunek
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("receipts");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`text-lg py-2 px-4 rounded transition font-medium text-right ${
            activeTab === "receipts"
              ? "bg-orange-500 text-white shadow"
              : "hover:bg-gray-200 text-gray-700"
          }`}
        >
          Dodaj paragon
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("subs");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`text-lg py-2 px-4 rounded transition font-medium text-right ${
            activeTab === "subs"
              ? "bg-orange-500 text-white shadow"
              : "hover:bg-gray-200 text-gray-700"
          }`}
        >
          Dodaj subskrypcję
        </button>
      </div>
    </div>
  );
}
