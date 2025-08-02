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
import { db } from "../firebase";

const InvoiceContext = createContext();

const initialState = {
  categories: [],
  invoices: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_INVOICES":
      return { ...state, invoices: action.payload };
    case "ADD_INVOICE":
      return { ...state, invoices: [...state.invoices, action.payload] };
    case "EDIT_INVOICE":
      return {
        ...state,
        invoices: state.invoices.map((inv) =>
          inv.id === action.payload.id ? { ...action.payload } : inv
        ),
      };
    case "DELETE_INVOICE":
      return {
        ...state,
        invoices: state.invoices.filter((inv) => inv.id !== action.id),
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

export function InvoiceProvider({ children, user }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Dodaj fakturę do Firestore
  const addInvoice = useCallback(
    async (invoice) => {
      if (!user) return;
      // Walidacja kategorii
      if (
        !invoice.category ||
        !state.categories.includes(invoice.category.trim())
      ) {
        alert("Nieprawidłowa kategoria!");
        return;
      }
      // Dodaj fakturę do Firestore w ścieżce users/{user.uid}/transactions
      const docRef = await addDoc(
        collection(db, "users", user.uid, "transactions"),
        {
          ...invoice,
          createdAt: new Date().toISOString(),
        }
      );
      dispatch({
        type: "ADD_INVOICE",
        payload: { ...invoice, id: docRef.id },
      });
    },
    [user, state.categories]
  );

  // Pobierz faktury i kategorie z Firestore po zalogowaniu
  useEffect(() => {
    if (!user) {
      dispatch({ type: "SET_INVOICES", payload: [] });
      dispatch({ type: "SET_CATEGORIES", payload: initialState.categories });
      return;
    }
    const fetchAll = async () => {
      const [invoicesSnap, categoriesSnap] = await Promise.all([
        getDocs(query(collection(db, "users", user.uid, "transactions"))),
        getDocs(query(collection(db, "users", user.uid, "categories"))),
      ]);
      const invoicesData = invoicesSnap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const categoriesData = categoriesSnap.docs.map((doc) => doc.data().name);

      dispatch({ type: "SET_INVOICES", payload: invoicesData });
      dispatch({
        type: "SET_CATEGORIES",
        payload: categoriesData.length
          ? categoriesData
          : initialState.categories,
      });
    };
    fetchAll();
  }, [user]);

  // Edytuj fakturę w Firestore
  const editInvoice = useCallback(
    async (invoice) => {
      if (!user || !invoice.id) return;
      // Walidacja kategorii
      if (
        !invoice.category ||
        !state.categories.includes(invoice.category.trim())
      ) {
        alert("Nieprawidłowa kategoria!");
        return;
      }
      const docRef = doc(db, "users", user.uid, "transactions", invoice.id);
      await updateDoc(docRef, { ...invoice });
      dispatch({
        type: "EDIT_INVOICE",
        payload: { ...invoice },
      });
    },
    [user, state.categories]
  );

  // Usuń fakturę z Firestore
  const deleteInvoice = useCallback(
    async (id) => {
      if (!user) return;
      await deleteDoc(doc(db, "users", user.uid, "transactions", id));
      dispatch({ type: "DELETE_INVOICE", id });
    },
    [user]
  );

  // Dodaj kategorię do Firestore i lokalnie
  const addCategory = useCallback(
    async (category) => {
      const trimmed = category.trim();
      if (trimmed && !state.categories.includes(trimmed)) {
        await addDoc(collection(db, "users", user.uid, "categories"), {
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
        const q = query(
          collection(db, "users", user.uid, "categories"),
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
    <InvoiceContext.Provider
      value={{
        categories: state.categories,
        invoices: state.invoices,
        addInvoice,
        editInvoice,
        deleteInvoice,
        addCategory,
        removeCategory,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export default InvoiceContext;
