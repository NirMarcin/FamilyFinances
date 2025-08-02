import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  setDoc,
  doc,
  deleteDoc,
  orderBy,
  limit,
} from "firebase/firestore";

const InvoiceContext = createContext();

const initialState = {
  categories: [],
  transactions: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_CATEGORIES":
      return { ...state, categories: action.categories };
    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.transactions };
    default:
      return state;
  }
}

export function InvoiceProvider({ children, user }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!user) return;

    const categoriesRef = collection(db, "users", user.uid, "categories");
    const unsubscribeCategories = onSnapshot(categoriesRef, (snapshot) => {
      const cats = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));

      dispatch({ type: "SET_CATEGORIES", categories: cats });
    });

    const transactionsRef = collection(db, "users", user.uid, "transactions");
    const q = query(transactionsRef, orderBy("date", "desc"), limit(50));
    const unsubscribeTransactions = onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch({ type: "SET_TRANSACTIONS", transactions: txs });
    });

    return () => {
      unsubscribeCategories();
      unsubscribeTransactions();
    };
  }, [user]);
  // Dodawanie kategorii (przypadek-insensitive)
  const addCategory = useCallback(
    async (name) => {
      if (!user) return; // brak usera => nic nie robić
      const categoriesRef = collection(db, "users", user.uid, "categories");
      if (!name) return;
      if (
        state.categories.some(
          (c) => c.name.toLowerCase() === name.toLowerCase()
        )
      )
        return;

      try {
        await addDoc(categoriesRef, { name });
      } catch (e) {
        console.error("Błąd dodawania kategorii:", e);
      }
    },
    [state.categories, user]
  );

  // Usuwanie kategorii
  const removeCategory = useCallback(
    async (name) => {
      if (!user) return;
      try {
        const cat = state.categories.find((c) => c.name === name);
        if (cat)
          await deleteDoc(doc(db, "users", user.uid, "categories", cat.id));
      } catch (e) {
        console.error("Błąd usuwania kategorii:", e);
      }
    },
    [state.categories, user]
  );

  const addTransaction = useCallback(
    async (transaction) => {
      if (!user) return;
      const transactionsRef = collection(db, "users", user.uid, "transactions");
      try {
        const docRef = await addDoc(transactionsRef, transaction);
        return docRef.id;
      } catch (e) {
        console.error("Błąd dodawania transakcji:", e);
        throw e;
      }
    },
    [user]
  );

  const updateTransaction = useCallback(
    async (transaction) => {
      if (!user) return;
      if (!transaction.id) {
        console.warn("Brak id w transakcji, nie aktualizuję", transaction);
        return;
      }
      try {
        await setDoc(
          doc(db, "users", user.uid, "transactions", transaction.id),
          transaction,
          { merge: false } // nadpisuje cały dokument
        );
      } catch (e) {
        console.error("Błąd aktualizacji transakcji:", e);
      }
    },
    [user]
  );

  const deleteTransaction = useCallback(
    async (transactionId) => {
      if (!user) return;
      try {
        await deleteDoc(
          doc(db, "users", user.uid, "transactions", transactionId)
        );
      } catch (e) {
        console.error("Błąd usuwania transakcji:", e);
      }
    },
    [user]
  );

  return (
    <InvoiceContext.Provider
      value={{
        categories: state.categories,
        transactions: state.transactions,
        addCategory,
        removeCategory,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export default InvoiceContext;
