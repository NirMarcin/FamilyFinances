import IncomeForm from "./IncomeForm";
import IncomeList from "./IncomeList";

export default function IncomeManager() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg mt-8 border border-orange-200 dark:border-gray-800 transition-colors duration-300">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-orange-700 dark:text-orange-400">
        Dodaj/Usuń przychód
      </h1>
      <div>
        <IncomeForm />
      </div>
      <IncomeList />
    </div>
  );
}
