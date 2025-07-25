import { useState } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import InputField from "../components/fields/InputField";
import { useExpenses } from "../contexts/ExpensesContext";
import ReceiptManager from "../components/ReceiptManager";

const defaultExpenseForm = { id: null, title: "", amount: "" };

export default function Expenses() {
  const { expenses, error, addExpense, updateExpense, removeExpense } =
    useExpenses();

  const [form, setForm] = useState(defaultExpenseForm);
  const [editMode, setEditMode] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!form.title.trim() || !form.amount.trim() || Number(form.amount) <= 0) {
      setLocalError("Podaj nazwę wydatku oraz dodatnią kwotę.");
      return;
    }

    if (editMode) {
      await updateExpense({ ...form, amount: Number(form.amount) });
      setEditMode(false);
    } else {
      await addExpense({ title: form.title, amount: Number(form.amount) });
    }

    setForm(defaultExpenseForm);
  };

  const startEdit = (expense) => {
    setEditMode(true);
    setForm({
      id: expense.id,
      title: expense.title,
      data: expense.data,
      amount: expense.amount.toString(),
    });
    setLocalError("");
  };

  const handleCancel = () => {
    setForm(defaultExpenseForm);
    setEditMode(false);
    setLocalError("");
  };

 return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-6">
        <h2 className="text-2xl font-semibold mb-6 text-center md:text-left">
          Zarządzaj wydatkami
        </h2>
        <div className="flex flex-col md:flex-row gap-8 min-h-[300px]">
          {/* Formularz - elastyczna szerokość do max 60% */}
          <form
            onSubmit={handleSubmit}
            className="flex-grow max-w-[60%] min-w-0 space-y-4"
          >
            <InputField
              label="Nazwa wydatku"
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Nazwa wydatku"
              maxLength={30}
            />
            <InputField
              label="Kwota"
              id="amount"
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              placeholder="Kwota"
              min="0.01"
              step="0.01"
              maxLength={10}
            />
            {(localError || error) && (
              <p className="text-red-600 text-sm">{localError || error}</p>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                variant="primary"
                className="px-5 py-2 rounded"
              >
                {editMode ? "Zapisz zmiany" : "Dodaj wydatek"}
              </Button>
              {editMode && (
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="secondary"
                  className="px-5 py-2 rounded"
                >
                  Anuluj
                </Button>
              )}
            </div>
          </form>

          {/* Lista wydatków - elastyczna szerokość do max 40%, maksymalna wysokość z przewijaniem */}
          <div className="flex-grow max-w-[40%] min-w-0 max-h-[400px] overflow-y-auto">
            <ul>
              {expenses.length === 0 ? (
                <li className="text-gray-500 text-center py-6 italic select-none">
                  Brak wydatków
                </li>
              ) : (
                expenses.map(({ id, title, amount }) => (
                  <li
                    key={id}
                    className="flex justify-between items-center border-b py-3"
                  >
                    <div className="flex-1 min-w-0 break-words">
                      <span className="font-semibold">{title}</span> -{" "}
                      {amount.toFixed(2)} zł
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <Button
                        type="button"
                        onClick={() => startEdit({ id, title, amount })}
                        variant="secondary"
                        className="text-blue-600 hover:underline bg-transparent p-0"
                      >
                        Edytuj
                      </Button>
                      <Button
                        type="button"
                        onClick={() => removeExpense(id)}
                        variant="secondary"
                        className="text-red-600 hover:underline bg-transparent p-0"
                      >
                        Usuń
                      </Button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
      <ReceiptManager/>
    </>
  );
}