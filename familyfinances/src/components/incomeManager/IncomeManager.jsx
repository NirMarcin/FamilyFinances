import IncomeForm from "./IncomeForm";
import IncomeList from "./IncomeList";

export default function IncomeManager() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-orange-700">Dodaj/Usuń przychód</h1>
      <div>
        <IncomeForm />
      </div>
      <IncomeList />
    </div>
  );
}
