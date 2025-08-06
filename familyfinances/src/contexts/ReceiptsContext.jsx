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
import { capitalizeWords } from "../utils/stringUtils";

const ReceiptsContext = createContext();

const initialState = {
  receiptsCategories: [],
  shops: [],
  receipts: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_RECEIPTS":
      return { ...state, receipts: action.payload };
    case "ADD_RECEIPT":
      return { ...state, receipts: [...state.receipts, action.payload] };
    case "EDIT_RECEIPT":
      return {
        ...state,
        receipts: state.receipts.map((r) =>
          r.id === action.payload.id ? { ...action.payload } : r
        ),
      };
    case "DELETE_RECEIPT":
      return {
        ...state,
        receipts: state.receipts.filter((r) => r.id !== action.id),
      };
    case "SET_RECEIPTS_CATEGORIES":
      return { ...state, receiptsCategories: action.payload };
    case "ADD_RECEIPTS_CATEGORY":
      return state.receiptsCategories.includes(action.category.trim())
        ? state
        : {
            ...state,
            receiptsCategories: [
              ...state.receiptsCategories,
              action.category.trim(),
            ],
          };
    case "REMOVE_RECEIPTS_CATEGORY":
      return {
        ...state,
        receiptsCategories: state.receiptsCategories.filter(
          (cat) => cat !== action.category
        ),
      };
    case "SET_SHOPS":
      return { ...state, shops: action.payload };
    default:
      return state;
  }
}

export function ReceiptsProvider({ children, user }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Dodaj paragon
  const addReceipt = useCallback(
    async (receipt) => {
      if (!user) return;
      const docRef = await addDoc(
        collection(db, "users", user.uid, "receipts"),
        { ...receipt, type: "ExpenseType", createdAt: new Date().toISOString() }
      );
      dispatch({
        type: "ADD_RECEIPT",
        payload: { ...receipt, type: "expenseType", id: docRef.id },
      });
    },
    [user]
  );

  // Edytuj paragon
  const editReceipt = useCallback(
    async (receipt) => {
      if (!user || !receipt.id) return;
      await updateDoc(doc(db, "users", user.uid, "receipts", receipt.id), {
        ...receipt,
      });
      dispatch({ type: "EDIT_RECEIPT", payload: { ...receipt } });
    },
    [user]
  );

  // Usuń paragon
  const deleteReceipt = useCallback(
    async (id) => {
      if (!user) return;
      await deleteDoc(doc(db, "users", user.uid, "receipts", id));
      dispatch({ type: "DELETE_RECEIPT", id });
    },
    [user]
  );

  // Dodaj kategorię
  const addReceiptsCategory = useCallback(
    async (category) => {
      const trimmed = category.trim();
      if (trimmed && !state.receiptsCategories.includes(trimmed)) {
        await addDoc(collection(db, "users", user.uid, "receiptsCategories"), {
          name: trimmed,
        });
        // Pobierz aktualne kategorie po dodaniu
        const categoriesSnap = await getDocs(
          collection(db, "users", user.uid, "receiptsCategories")
        );
        dispatch({
          type: "SET_RECEIPTS_CATEGORIES",
          payload: categoriesSnap.docs.map((doc) => doc.data().name),
        });
        return true;
      }
      alert("Taka kategoria już istnieje lub jest nieprawidłowa!");
      return false;
    },
    [state.receiptsCategories, user]
  );

  // Usuń kategorię
  const removeReceiptsCategory = useCallback(
    async (category) => {
      const trimmed = category.trim();
      if (trimmed && state.receiptsCategories.includes(trimmed)) {
        const q = query(
          collection(db, "users", user.uid, "receiptsCategories"),
          where("name", "==", trimmed)
        );
        const snapshot = await getDocs(q);
        await Promise.all(snapshot.docs.map((docRef) => deleteDoc(docRef.ref)));
        // Pobierz aktualne kategorie po usunięciu
        const categoriesSnap = await getDocs(
          collection(db, "users", user.uid, "receiptsCategories")
        );
        dispatch({
          type: "SET_RECEIPTS_CATEGORIES",
          payload: categoriesSnap.docs.map((doc) => doc.data().name),
        });
        return true;
      }
      alert("Nie można usunąć tej kategorii!");
      return false;
    },
    [state.receiptsCategories, user]
  );

  // Dodaj sklep
  const addShop = useCallback(
    async (shop) => {
      const trimmed = capitalizeWords(shop.trim());
      if (trimmed && !state.shops.includes(trimmed)) {
        await addDoc(collection(db, "users", user.uid, "shopLists"), {
          name: trimmed,
        });
        // Pobierz aktualną listę sklepów po dodaniu
        const shopsSnap = await getDocs(
          collection(db, "users", user.uid, "shopLists")
        );
        dispatch({
          type: "SET_SHOPS",
          payload: Array.from(
            new Set(
              shopsSnap.docs.map((doc) => capitalizeWords(doc.data().name))
            )
          ),
        });
        return true;
      }
      alert("Taki sklep już istnieje lub jest nieprawidłowy!");
      return false;
    },
    [state.shops, user]
  );

  // Usuń sklep
  const removeShop = useCallback(
    async (shop) => {
      const trimmed = capitalizeWords(shop.trim());
      if (trimmed && state.shops.includes(trimmed)) {
        const q = query(
          collection(db, "users", user.uid, "shopLists"),
          where("name", "==", trimmed)
        );
        const snapshot = await getDocs(q);
        await Promise.all(snapshot.docs.map((docRef) => deleteDoc(docRef.ref)));
        // Pobierz aktualną listę sklepów po usunięciu
        const shopsSnap = await getDocs(
          collection(db, "users", user.uid, "shopLists")
        );
        dispatch({
          type: "SET_SHOPS",
          payload: Array.from(
            new Set(
              shopsSnap.docs.map((doc) => capitalizeWords(doc.data().name))
            )
          ),
        });
        return true;
      }
      alert("Nie można usunąć tego sklepu!");
      return false;
    },
    [state.shops, user]
  );

  // Pobierz dane z Firestore po zalogowaniu
  useEffect(() => {
    if (!user) {
      dispatch({ type: "SET_RECEIPTS", payload: [] });
      dispatch({ type: "SET_SHOPS", payload: initialState.shops });
      dispatch({
        type: "SET_RECEIPTS_CATEGORIES",
        payload: initialState.receiptsCategories,
      });
      return;
    }
    const fetchAll = async () => {
      const [receiptsSnap, shopsSnap, categoriesSnap] = await Promise.all([
        getDocs(collection(db, "users", user.uid, "receipts")),
        getDocs(collection(db, "users", user.uid, "shopLists")),
        getDocs(collection(db, "users", user.uid, "receiptsCategories")),
      ]);
      dispatch({
        type: "SET_RECEIPTS",
        payload: receiptsSnap.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      });
      dispatch({
        type: "SET_SHOPS",
        payload: Array.from(
          new Set(shopsSnap.docs.map((doc) => capitalizeWords(doc.data().name)))
        ),
      });
      dispatch({
        type: "SET_RECEIPTS_CATEGORIES",
        payload: categoriesSnap.docs.map((doc) => doc.data().name),
      });
    };
    fetchAll();
  }, [user]);

  return (
    <ReceiptsContext.Provider
      value={{
        receiptsCategories: state.receiptsCategories,
        shops: state.shops,
        receipts: state.receipts,
        addReceipt,
        editReceipt,
        deleteReceipt,
        addReceiptsCategory,
        removeReceiptsCategory,
        addShop,
        removeShop,
      }}
    >
      {children}
    </ReceiptsContext.Provider>
  );
}

export default ReceiptsContext;
