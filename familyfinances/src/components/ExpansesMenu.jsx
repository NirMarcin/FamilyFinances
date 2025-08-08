export default function ExpansesMenu({ activeTab, setActiveTab }) {
  return (
    <div className="w-full sm:w-[300px] self-start mt-8">
      <div className="bg-gray-100 dark:bg-black rounded-lg shadow py-4 px-3 flex flex-col gap-2 sticky top-24 border border-orange-200 dark:border-gray-800 transition-colors duration-300">
        <button
          type="button"
          onClick={() => {
            setActiveTab("income");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`text-base sm:text-lg py-2 px-3 sm:px-4 rounded transition font-medium text-right ${
            activeTab === "income"
              ? "bg-orange-500 text-white shadow dark:bg-orange-600 dark:text-orange-200"
              : "hover:bg-gray-200 hover:dark:bg-gray-900 text-gray-700 dark:text-orange-300"
          }`}
        >
          Dodaj/Usuń przychód
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("expenses");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`text-base sm:text-lg py-2 px-3 sm:px-4 rounded transition font-medium text-right ${
            activeTab === "expenses"
              ? "bg-orange-500 text-white shadow dark:bg-orange-600 dark:text-orange-200"
              : "hover:bg-gray-200 hover:dark:bg-gray-900 text-gray-700 dark:text-orange-300"
          }`}
        >
          Dodaj/Usuń rachunek
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("receipts");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`text-base sm:text-lg py-2 px-3 sm:px-4 rounded transition font-medium text-right ${
            activeTab === "receipts"
              ? "bg-orange-500 text-white shadow dark:bg-orange-600 dark:text-orange-200"
              : "hover:bg-gray-200 hover:dark:bg-gray-900 text-gray-700 dark:text-orange-300"
          }`}
        >
          Dodaj/Usuń paragon
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("subs");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`text-base sm:text-lg py-2 px-3 sm:px-4 rounded transition font-medium text-right ${
            activeTab === "subs"
              ? "bg-orange-500 text-white shadow dark:bg-orange-600 dark:text-orange-200"
              : "hover:bg-gray-200 hover:dark:bg-gray-900 text-gray-700 dark:text-orange-300"
          }`}
        >
          Dodaj/Usuń subskrypcję
        </button>
      </div>
    </div>
  );
}
