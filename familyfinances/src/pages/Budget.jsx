import PagesBanner from "../components/PagesBanner";
import Navbar from "../components/Navbar";
import BudgetLimitManager from "../components/budgetLimitManager/BudgetLimitManager";

export default function Budget() {
  return (
    <>
      <Navbar />
      <PagesBanner title="Budżet">
        <span className="block mb-2 font-semibold text-orange-900 dark:text-orange-400">
          Na tej stronie możesz ustawić swój miesięczny budżet, śledzić wydatki
          oraz analizować, ile zostało Ci do wykorzystania w danym okresie.
        </span>
        <span className="block mb-2 text-gray-700 dark:text-orange-300">
          W przyszłości pojawią się tu narzędzia do planowania i kontroli
          domowych finansów.
        </span>
      </PagesBanner>
      <div className="max-w-7xl mx-auto px-4 sm:px-10 py-8 bg-transparent dark:bg-black transition-colors duration-300">
        <div className="flex flex-col min-h-[300px] items-stretch">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 border border-orange-200 dark:border-gray-800 min-h-[320px] transition-colors duration-300">
            <BudgetLimitManager />
          </div>
        </div>
      </div>
    </>
  );
}
