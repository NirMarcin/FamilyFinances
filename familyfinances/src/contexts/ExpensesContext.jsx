import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  doc,
} from "firebase/firestore";
import { db } from "../firebase"; // ścieżka dostosuj do swojego projektu
import { useAuth } from "./AuthContext";

const initialState = {
  expenses: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_EXPENSES":
      return { ...state, expenses: action.payload };
    case "ADD_EXPENSE":
      return { ...state, expenses: [...state.expenses, action.payload] };
    case "UPDATE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.map((exp) =>
          exp.id === action.payload.id ? action.payload : exp
        ),
      };
    case "DELETE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.filter((exp) => exp.id !== action.payload),
      };
    default:
      return state;
  }
}

// Tworzymy kontekst
const ExpensesContext = createContext();

// Provider kontekstu
export function ExpensesProvider({ children }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      dispatch({ type: "SET_EXPENSES", payload: [] });
      return;
    }

    const expensesCollection = collection(db, "expenses");
    const q = query(expensesCollection, where("userId", "==", user.uid));

    const fetchExpenses = async () => {
      setError(null);
      try {
        const snapshot = await getDocs(q);
        const expensesFromDb = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            amount: Number(data.amount),
            date: data.date
              ? data.date.toDate
                ? data.date.toDate().toISOString().split("T")[0]
                : data.date
              : null,
          };
        });
        dispatch({ type: "SET_EXPENSES", payload: expensesFromDb });
      } catch (err) {
        console.error("Błąd podczas wczytywania wydatków:", err);
        setError("Nie udało się wczytać wydatków. Spróbuj ponownie później.");
      }
    };
    fetchExpenses();
  }, [user]);

  const addExpense = async (expense) => {
    if (!user) {
      setError("Użytkownik nie jest zalogowany.");
      return;
    }
    setError(null);
    try {
      const dateToSave = expense.date || new Date().toISOString().split("T")[0];
      const docRef = await addDoc(collection(db, "expenses"), {
        ...expense,
        amount: Number(expense.amount),
        userId: user.uid,
        date: dateToSave,
      });
      dispatch({
        type: "ADD_EXPENSE",
        payload: {
          id: docRef.id,
          ...expense,
          amount: Number(expense.amount),
          date: dateToSave,
        },
      });
    } catch (err) {
      console.error("Błąd podczas dodawania wydatku:", err);
      setError("Nie udało się dodać wydatku.");
    }
  };

  const updateExpense = async (expense) => {
    if (!user) {
      setError("Użytkownik nie jest zalogowany.");
      return;
    }
    setError(null);
    try {
      const expenseDoc = doc(db, "expenses", expense.id);
      await updateDoc(expenseDoc, {
        title: expense.title,
        amount: Number(expense.amount),
        date: expense.date || new Date().toISOString().split("T")[0],
      });
      dispatch({ type: "UPDATE_EXPENSE", payload: expense });
    } catch (err) {
      console.error("Błąd podczas aktualizacji wydatku:", err);
      setError("Nie udało się zaktualizować wydatku.");
    }
  };

  // Usuwanie wydatku
  const removeExpense = async (id) => {
    if (!user) {
      setError("Użytkownik nie jest zalogowany.");
      return;
    }
    setError(null);
    try {
      const expenseDoc = doc(db, "expenses", id);
      await deleteDoc(expenseDoc);
      dispatch({ type: "DELETE_EXPENSE", payload: id });
    } catch (err) {
      console.error("Błąd podczas usuwania wydatku:", err);
      setError("Nie udało się usunąć wydatku.");
    }
  };

  return (
    <ExpensesContext.Provider
      value={{
        expenses: state.expenses,
        error,
        addExpense,
        updateExpense,
        removeExpense,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}

// Hook do korzystania z kontekstu w komponentach
export function useExpenses() {
  return useContext(ExpensesContext);
}
