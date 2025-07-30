import React, {
  createContext,
  useReducer,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { capitalizeWords } from "../utils/stringUtils";

const ReceiptsContext = createContext();

const initialState = {
  storeName: "",
  currentProduct: { name: "", category: "", price: "" },
  currentProducts: [],
  receipts: [],
  shops: [], // dynamiczna lista sklepów
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_STORE_NAME":
      return { ...state, storeName: action.payload };

    case "SET_CURRENT_PRODUCT_FIELD":
      return {
        ...state,
        currentProduct: {
          ...state.currentProduct,
          [action.field]: action.value,
        },
      };

    case "ADD_CURRENT_PRODUCT": {
      const { name, category, price } = state.currentProduct;
      if (!name.trim() || !category.trim() || !price.trim()) {
        alert("Proszę wypełnić wszystkie pola produktu.");
        return state;
      }
      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        alert("Cena musi być liczbą większą od 0.");
        return state;
      }
      const newProduct = {
        name: capitalizeWords(name.trim()),
        category: capitalizeWords(category.trim()),
        price: priceNum,
      };
      return {
        ...state,
        currentProducts: [...state.currentProducts, newProduct],
        currentProduct: { name: "", category: "", price: "" },
      };
    }

    case "REMOVE_PRODUCT":
      return {
        ...state,
        currentProducts: state.currentProducts.filter(
          (_, i) => i !== action.index
        ),
      };

    case "SAVE":
      return {
        ...state,
        storeName: "",
        currentProduct: { name: "", category: "", price: "" },
        currentProducts: [],
      };

    case "SET_RECEIPTS":
      return {
        ...state,
        receipts: action.payload.map((receipt) => ({
          ...receipt,
          storeName: capitalizeWords(receipt.storeName),
          products: receipt.products.map((p) => ({
            ...p,
            name: capitalizeWords(p.name),
            category: capitalizeWords(p.category),
          })),
        })),
      };

    case "SET_SHOPS": {
      const uniqueShops = Array.from(new Set(action.payload));
      return {
        ...state,
        shops: uniqueShops
          .map((shop) => capitalizeWords(shop))
          .sort((a, b) =>
            a.localeCompare(b, undefined, { sensitivity: "base" })
          ),
      };
    }

    case "SET_CURRENT_PRODUCTS":
      return {
        ...state,
        currentProducts: action.payload,
      };

    case "UPDATE_RECEIPT":
      return {
        ...state,
        receipts: state.receipts.map((r) =>
          r.id === action.payload.id ? { ...r, ...action.payload } : r
        ),
      };

    default:
      return state;
  }
}

export function ReceiptsProvider({ children, user }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Usuń produkt po indeksie
  const removeProduct = useCallback((indexToRemove) => {
    dispatch({ type: "REMOVE_PRODUCT", index: indexToRemove });
  }, []);

  // Usuń pojedynczy paragon z Firestore
  const deleteReceipt = useCallback(
    async (id) => {
      if (!user?.uid) return;
      try {
        await deleteDoc(doc(db, "users", user.uid, "receipts", id));
        // onSnapshot automatycznie zaktualizuje lokalny stan
      } catch (error) {
        console.error("Błąd podczas usuwania paragonu:", error);
        alert("Nie udało się usunąć paragonu.");
      }
    },
    [user]
  );

  // Subskrypcja paragonów użytkownika
  useEffect(() => {
    if (!user?.uid) return;

    const receiptsRef = collection(db, "users", user.uid, "receipts");
    const unsubscribe = onSnapshot(receiptsRef, (snapshot) => {
      const receiptsData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        date:
          doc.data().date && typeof doc.data().date.toDate === "function"
            ? doc.data().date.toDate()
            : new Date(),
      }));
      dispatch({ type: "SET_RECEIPTS", payload: receiptsData });
    });

    return () => unsubscribe();
  }, [user]);

  // Subskrypcja sklepów użytkownika
  useEffect(() => {
    if (!user?.uid) return;

    const shopsRef = collection(db, "users", user.uid, "shopLists");
    const unsubscribe = onSnapshot(shopsRef, (snapshot) => {
      const shopsData = snapshot.docs.map((doc) => doc.data().name);
      dispatch({ type: "SET_SHOPS", payload: shopsData });
    });

    return () => unsubscribe();
  }, [user]);

  // Dodanie nowego sklepu, jeśli go nie ma
  const addShopIfNotExists = useCallback(async () => {
    const shopName = state.storeName.trim();
    if (!shopName) return;
    console.log("Sprawdzam czy sklep istnieje:", shopName);

    try {
      const shopsRef = collection(db, "users", user.uid, "shopLists");
      const q = query(shopsRef, where("name", "==", shopName.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("Sklep nie istnieje, dodaję:", shopName);
        await addDoc(shopsRef, { name: shopName.toLowerCase() });
      } else {
        console.log("Sklep już istnieje:", shopName);
      }
    } catch (error) {
      console.error("Błąd dodawania sklepu:", error);
    }
  }, [state.storeName, user]);

  // Zapisywanie paragonu w Firestore w ścieżce użytkownika
  const save = useCallback(async () => {
    if (!user?.uid) {
      alert("Brak zalogowanego użytkownika");
      return;
    }
    if (!state.storeName.trim()) {
      alert("Podaj nazwę sklepu.");
      return;
    }
    if (!state.currentProducts.length) {
      alert("Dodaj przynajmniej jeden produkt.");
      return;
    }

    try {
      await addShopIfNotExists();

      const receiptsRef = collection(db, "users", user.uid, "receipts");
      await addDoc(receiptsRef, {
        storeName: state.storeName.trim(),
        date: new Date(),
        products: state.currentProducts,
      });

      dispatch({ type: "SAVE" });
    } catch (error) {
      console.error("Błąd podczas zapisu paragonu:", error);
      alert("Wystąpił błąd podczas zapisu paragonu.");
    }
  }, [state, addShopIfNotExists, user]);

  // Kalkulacja sumy cen produktów (callback dla optymalizacji)
  const calcTotal = useCallback(
    (products) => products.reduce((sum, p) => sum + p.price, 0).toFixed(2),
    []
  );

  const setStoreName = useCallback(
    (name) => dispatch({ type: "SET_STORE_NAME", payload: name }),
    []
  );

  const setCurrentProductField = useCallback(
    (field, value) =>
      dispatch({ type: "SET_CURRENT_PRODUCT_FIELD", field, value }),
    []
  );

  const addCurrentProduct = useCallback(
    () => dispatch({ type: "ADD_CURRENT_PRODUCT" }),
    []
  );

  const setCurrentProducts = useCallback(
    (products) => dispatch({ type: "SET_CURRENT_PRODUCTS", payload: products }),
    []
  );

  const updateReceipt = useCallback((updated) => {
    dispatch({ type: "UPDATE_RECEIPT", payload: updated });
  }, []);

  const contextValue = useMemo(
    () => ({
      ...state,
      selectedReceipt,
      setSelectedReceipt,
      removeProduct,
      deleteReceipt,
      saveReceiptToDB: save,
      calcTotal,
      setStoreName,
      setCurrentProductField,
      addCurrentProduct,
      setCurrentProducts,
      updateReceipt,
    }),
    [
      state,
      selectedReceipt,
      removeProduct,
      deleteReceipt,
      save,
      calcTotal,
      setStoreName,
      setCurrentProductField,
      addCurrentProduct,
      setCurrentProducts,
      updateReceipt,
    ]
  );

  return (
    <ReceiptsContext.Provider value={contextValue}>
      {children}
    </ReceiptsContext.Provider>
  );
}
export default ReceiptsContext;
