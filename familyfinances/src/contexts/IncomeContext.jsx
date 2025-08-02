import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase"; // <-- importuj swój obiekt db

const IncomeContext = createContext();

const initialState = {
  categories: [],
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
    case "REMOVE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter((cat) => cat !== action.category),
      };
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    default:
      return state;
  }
}

export function IncomeProvider({ children, user }) {
  const [state, dispatch] = useReducer(reducer, initialState);

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
      // Dodaj przychód do Firestore w ścieżce users/{user.uid}/incomes
      const docRef = await addDoc(
        collection(db, "users", user.uid, "incomes"),
        {
          ...income,
          createdAt: new Date().toISOString(),
        }
      );
      dispatch({
        type: "ADD_INCOME",
        payload: { ...income, id: docRef.id },
      });
    },
    [user, state.categories]
  );

  // Pobierz przychody z Firestore po zalogowaniu
  useEffect(() => {
    if (!user) {
      dispatch({ type: "SET_INCOMES", payload: [] });
      dispatch({ type: "SET_CATEGORIES", payload: initialState.categories });
      return;
    }
    const fetchAll = async () => {
      // Zapytania równoległe
      const [incomesSnap, categoriesSnap] = await Promise.all([
        getDocs(query(collection(db, "users", user.uid, "incomes"))),
        getDocs(query(collection(db, "users", user.uid, "incomeCategories"))),
      ]);
      const incomesData = incomesSnap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const categoriesData = categoriesSnap.docs.map((doc) => doc.data().name);

      dispatch({ type: "SET_INCOMES", payload: incomesData });
      dispatch({ type: "SET_CATEGORIES", payload: categoriesData.length ? categoriesData : initialState.categories });
    };
    fetchAll();
  }, [user]);

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
      // Edytuj przychód w Firestore w ścieżce users/{user.uid}/incomes
      const docRef = doc(db, "users", user.uid, "incomes", income.id);
      await updateDoc(docRef, { ...income });
      dispatch({
        type: "EDIT_INCOME",
        payload: { ...income },
      });
    },
    [user, state.categories]
  );

  // Usuń przychód z Firestore
  const deleteIncome = useCallback(
    async (id) => {
      if (!user) return;
      // Usuń przychód z Firestore w ścieżce users/{user.uid}/incomes
      await deleteDoc(doc(db, "users", user.uid, "incomes", id));
      dispatch({ type: "DELETE_INCOME", id });
    },
    [user]
  );

  // Dodaj kategorię do Firestore i lokalnie
  const addCategory = useCallback(
    async (category) => {
      const trimmed = category.trim();
      if (trimmed && !state.categories.includes(trimmed)) {
        // Dodaj kategorię do Firestore w ścieżce users/{user.uid}/incomeCategories
        await addDoc(collection(db, "users", user.uid, "incomeCategories"), {
          name: trimmed,
        });
        dispatch({ type: "ADD_CATEGORY", category: trimmed });
        return true;
      }
      alert("Taka kategoria już istnieje lub jest nieprawidłowa!");
      return false;
    },
    [state.categories, user]
  );

  // Usuń kategorię z Firestore i lokalnie
  const removeCategory = useCallback(
    async (category) => {
      const trimmed = category.trim();
      if (trimmed && state.categories.includes(trimmed)) {
        // Usuń kategorię z Firestore w ścieżce users/{user.uid}/incomeCategories
        const q = query(
          collection(db, "users", user.uid, "incomeCategories"),
          where("name", "==", trimmed)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          await Promise.all(
            snapshot.docs.map((docRef) => deleteDoc(docRef.ref))
          );
        }
        dispatch({ type: "REMOVE_CATEGORY", category: trimmed });
        return true;
      }
      alert("Nie można usunąć tej kategorii!");
      return false;
    },
    [state.categories, user]
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
        removeCategory,
      }}
    >
      {children}
    </IncomeContext.Provider>
  );
}

export default IncomeContext;
