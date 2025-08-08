import { useContext } from "react";
import UniversalList from "../common/UniversalList";
import IncomeEditForm from "./IncomeEditForm";
import IncomeContext from "../../contexts/IncomeContext";

export default function IncomeList({ onEditIncome }) {
  const {
    incomes,
    categories,
    addCategory,
    removeCategory,
    editIncome,
    deleteIncome,
  } = useContext(IncomeContext);

  if (!incomes.length) {
    return (
      <section className="mt-10 p-5 border border-gray-300 dark:border-gray-800 rounded-lg bg-orange-50 dark:bg-black shadow-inner transition-colors duration-300 ">
        <h2 className="text-2xl font-extrabold mb-6 text-orange-700 dark:text-orange-400 text-center">
          Ostatnie przychody
        </h2>
        <p className="text-center text-gray-500 dark:text-orange-300">
          Brak przychodów.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-10 p-5 border border-gray-300 dark:border-gray-800 rounded-lg bg-orange-50 dark:bg-black shadow-inner transition-colors duration-300 dark:text-orange-300">
      <h2 className="text-2xl font-extrabold mb-6 text-orange-700 dark:text-orange-400 text-center">
        Ostatnie przychody
      </h2>
      <UniversalList
        data={[...incomes].sort((a, b) => new Date(b.date) - new Date(a.date))}
        columns={[
          { key: "date", label: "Data" },
          { key: "category", label: "Kategoria" },
          {
            key: "amount",
            label: "Kwota (zł)",
            align: "text-right",
            render: (item) => (
              <span className="text-green-700 dark:text-orange-300 font-semibold">
                {Number(item.amount).toFixed(2)} zł
              </span>
            ),
          },
          {
            key: "description",
            label: "Opis",
            render: (item) => (
              <span className="italic text-gray-600 dark:text-orange-300">
                {item.description || "-"}
              </span>
            ),
          },
        ]}
        editForm={(props) => (
          <IncomeEditForm
            {...props}
            categories={categories}
            onAddCategory={addCategory}
            onRemoveCategory={removeCategory}
            onSubmit={editIncome}
          />
        )}
        onEdit={onEditIncome}
        onDelete={(item) => deleteIncome(item.id)}
        deleteConfirmTitle="Potwierdź usunięcie"
        deleteConfirmMessage="Czy na pewno chcesz usunąć ten przychód?"
      />
    </section>
  );
}
