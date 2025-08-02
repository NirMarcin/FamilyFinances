import { useContext } from "react";
import UniversalList from "../common/UniversalList";
import IncomeEditForm from "./IncomeEditForm";
import IncomeContext from "../../contexts/IncomeContext";

export default function IncomeList({
  incomes,
  onEditIncome,
  onDeleteIncome,
  categories = [],
  addCategory,
  removeCategory,
}) {
  const { editIncome } = useContext(IncomeContext);

  if (!incomes.length) {
    return (
      <section className="mt-10 p-5 border border-gray-300 rounded-lg bg-orange-50 shadow-inner">
        <h2 className="text-2xl font-extrabold mb-6 text-orange-700 text-center">
          Ostatnie przychody
        </h2>
        <p className="text-center text-gray-500">Brak przychodów.</p>
      </section>
    );
  }

  return (
    <section className="mt-10 p-5 border border-gray-300 rounded-lg bg-orange-50 shadow-inner">
      <h2 className="text-2xl font-extrabold mb-6 text-orange-700 text-center">
        Ostatnie przychody
      </h2>
      <UniversalList
        data={[...incomes]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 10)}
        columns={[
          { key: "date", label: "Data" },
          { key: "category", label: "Kategoria" },
          {
            key: "amount",
            label: "Kwota (zł)",
            align: "text-right",
            render: (item) => (
              <span className="text-green-700 font-semibold">
                {Number(item.amount).toFixed(2)} zł
              </span>
            ),
          },
          {
            key: "description",
            label: "Opis",
            render: (item) => (
              <span className="italic text-gray-600">
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
            onSubmit={(data) => {
              editIncome(data);
            }}
          />
        )}
        onEdit={onEditIncome}
        onDelete={(item) => onDeleteIncome(item.id)}
        deleteConfirmTitle="Potwierdź usunięcie"
        deleteConfirmMessage="Czy na pewno chcesz usunąć ten przychód?"
      />
    </section>
  );
}
