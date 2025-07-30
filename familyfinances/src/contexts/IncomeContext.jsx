import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase"; // <-- importuj swój obiekt db

const IncomeContext = createContext();

const initialState = {
  categories: ["Wynagrodzenie", "Premia", "Inne"],
  incomes: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_INCOMES":
      return { ...state, incomes: action.payload };
    case "ADD_INCOME":
      return { ...state, incomes: [...state.incomes, action.payload] };
    case "EDIT_INCOME":
      return {
        ...state,
        incomes: state.incomes.map((inc) =>
          inc.id === action.payload.id ? { ...action.payload } : inc
        ),
      };
    case "DELETE_INCOME":
      return {
        ...state,
        incomes: state.incomes.filter((inc) => inc.id !== action.id),
      };
    case "ADD_CATEGORY":
      if (
        action.category &&
        !state.categories.includes(action.category.trim())
      ) {
        return {
          ...state,
          categories: [...state.categories, action.category.trim()],
        };
      }
      return state;
    default:
      return state;
  }
}

export function IncomeProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user } = useAuth();

  // Pobierz przychody z Firestore po zalogowaniu
  useEffect(() => {
    if (!user) {
      dispatch({ type: "SET_INCOMES", payload: [] });
      return;
    }
    const fetchIncomes = async () => {
      const q = query(
        collection(db, "incomes"),
        where("userId", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      dispatch({ type: "SET_INCOMES", payload: data });
    };
    fetchIncomes();
  }, [user]);

  // Dodaj przychód do Firestore
  const addIncome = useCallback(
    async (income) => {
      if (!user) return;
      // Walidacja kategorii
      if (
        !income.category ||
        !state.categories.includes(income.category.trim())
      ) {
        alert("Nieprawidłowa kategoria!");
        return;
      }
      const docRef = await addDoc(collection(db, "incomes"), {
        ...income,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      });
      dispatch({
        type: "ADD_INCOME",
        payload: { ...income, userId: user.uid, id: docRef.id },
      });
    },
    [user, state.categories]
  );

  // Edytuj przychód w Firestore
  const editIncome = useCallback(
    async (income) => {
      if (!user || !income.id) return;
      // Walidacja kategorii
      if (
        !income.category ||
        !state.categories.includes(income.category.trim())
      ) {
        alert("Nieprawidłowa kategoria!");
        return;
      }
      const docRef = doc(db, "incomes", income.id);
      await updateDoc(docRef, { ...income, userId: user.uid });
      dispatch({
        type: "EDIT_INCOME",
        payload: { ...income, userId: user.uid },
      });
    },
    [user, state.categories]
  );

  // Usuń przychód z Firestore
  const deleteIncome = useCallback(async (id) => {
    await deleteDoc(doc(db, "incomes", id));
    dispatch({ type: "DELETE_INCOME", id });
  }, []);

  // Dodaj kategorię (tylko lokalnie, ale możesz dodać do bazy jeśli chcesz)
  const addCategory = useCallback(
    (category) => {
      if (category && !state.categories.includes(category.trim())) {
        dispatch({ type: "ADD_CATEGORY", category: category.trim() });
        return true;
      }
      alert("Taka kategoria już istnieje lub jest nieprawidłowa!");
      return false;
    },
    [state.categories]
  );

  return (
    <IncomeContext.Provider
      value={{
        categories: state.categories,
        incomes: state.incomes,
        addIncome,
        editIncome,
        deleteIncome,
        addCategory,
      }}
    >
      {children}
    </IncomeContext.Provider>
  );
}

export default IncomeContext;
