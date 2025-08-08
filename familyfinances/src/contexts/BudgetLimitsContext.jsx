import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
} from "react";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";
import InvoiceContext from "./InvoiceContext";
import ReceiptsContext from "./ReceiptsContext";
import SubsContext from "./SubsContext";

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

const BudgetLimitsContext = createContext();

const initialState = {
  month: getCurrentMonth(),
  limits: { invoices: "", receipts: "", subs: "" },
  savedLimits: [],
  loading: false,
  invoicesSum: 0,
  receiptsSum: 0,
  subsSum: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_MONTH":
      return { ...state, month: action.payload };
    case "SET_LIMITS":
      return { ...state, limits: action.payload };
    case "SET_SAVED_LIMITS":
      return { ...state, savedLimits: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_LIMIT_VALUE":
      return {
        ...state,
        limits: {
          ...state.limits,
          [action.payload.type]: action.payload.value,
        },
      };
    case "SET_SUMS":
      return {
        ...state,
        invoicesSum: action.payload.invoicesSum,
        receiptsSum: action.payload.receiptsSum,
        subsSum: action.payload.subsSum,
      };
    default:
      return state;
  }
}

export function BudgetLimitsProvider({ children }) {
  const { user } = useAuth();
  const { invoices } = useContext(InvoiceContext);
  const { receipts } = useContext(ReceiptsContext);
  const { subs } = useContext(SubsContext);

  const [state, dispatch] = useReducer(reducer, initialState);

  // Aktualny miesiąc
  const currentMonth = getCurrentMonth();

  // Limity dla bieżącego miesiąca
  const currentLimits = useMemo(() => {
    if (!Array.isArray(state.savedLimits)) return null;
    return state.savedLimits.find((l) => l.month === currentMonth) || null;
  }, [state.savedLimits, currentMonth]);

  // Suma wydatków dla bieżącego miesiąca
  const currentInvoicesSum = useMemo(
    () =>
      (invoices || [])
        .filter((inv) => inv.date?.startsWith(currentMonth))
        .reduce((sum, inv) => sum + Math.abs(Number(inv.amount || 0)), 0),
    [invoices, currentMonth]
  );

  const currentReceiptsSum = useMemo(
    () =>
      (receipts || [])
        .filter((r) => r.date?.startsWith(currentMonth))
        .reduce(
          (sum, r) =>
            sum +
            (Array.isArray(r.products)
              ? r.products.reduce(
                  (prodSum, p) => prodSum + Math.abs(Number(p.total || 0)),
                  0
                )
              : 0),
          0
        ),
    [receipts, currentMonth]
  );

  const currentSubsSum = useMemo(
    () =>
      (subs || [])
        .filter((sub) => sub.date?.startsWith(currentMonth))
        .reduce((sum, sub) => sum + Math.abs(Number(sub.amount || 0)), 0),
    [subs, currentMonth]
  );

  // Pobierz wszystkie limity użytkownika z Firebase
  useEffect(() => {
    if (!user) return;
    dispatch({ type: "SET_LOADING", payload: true });
    const ref = collection(db, "users", user.uid, "budgetLimits");
    getDocs(ref)
      .then((snap) => {
        const limitsArr = [];
        snap.forEach((doc) => {
          limitsArr.push(doc.data());
        });
        dispatch({ type: "SET_SAVED_LIMITS", payload: limitsArr });
        // Ustaw limity dla wybranego miesiąca do formularza
        const current = limitsArr.find((l) => l.month === state.month);
        if (current) {
          dispatch({
            type: "SET_LIMITS",
            payload: {
              invoices: current.invoices.limit,
              receipts: current.receipts.limit,
              subs: current.subs.limit,
            },
          });
        } else {
          dispatch({
            type: "SET_LIMITS",
            payload: { invoices: "", receipts: "", subs: "" },
          });
        }
      })
      .finally(() => dispatch({ type: "SET_LOADING", payload: false }));
  }, [state.month, user]);

  // Dodaj funkcję do zmiany miesiąca
  const setMonth = (newMonth) => {
    dispatch({ type: "SET_MONTH", payload: newMonth });
  };

  // Dodaj funkcję do zmiany limitu
  const handleLimitChange = (type, value) => {
    dispatch({ type: "SET_LIMIT_VALUE", payload: { type, value } });
  };

  // Dodaj lub edytuj limit w Firebase
  const handleSaveLimits = async () => {
    if (!user) return;
    dispatch({ type: "SET_LOADING", payload: true });
    const ref = doc(db, "users", user.uid, "budgetLimits", state.month);
    const data = {
      month: state.month,
      invoices: { limit: state.limits.invoices, sum: state.invoicesSum },
      receipts: { limit: state.limits.receipts, sum: state.receiptsSum },
      subs: { limit: state.limits.subs, sum: state.subsSum },
    };
    await setDoc(ref, data);
    dispatch({
      type: "SET_SAVED_LIMITS",
      payload: [
        ...state.savedLimits.filter((l) => l.month !== state.month),
        data,
      ],
    });
    dispatch({ type: "SET_LOADING", payload: false });
  };

  // Usuń limit z Firebase i lokalnej tablicy
  const handleDeleteLimit = async (m) => {
    if (!user) return;
    dispatch({ type: "SET_LOADING", payload: true });
    const ref = doc(db, "users", user.uid, "budgetLimits", m);
    await deleteDoc(ref);
    dispatch({
      type: "SET_SAVED_LIMITS",
      payload: state.savedLimits.filter((l) => l.month !== m),
    });
    dispatch({ type: "SET_LOADING", payload: false });
  };

  // Rozpocznij edycję limitu (ustawia limity w formularzu)
  const handleEditLimit = (limit) => {
    dispatch({ type: "SET_MONTH", payload: limit.month });
    dispatch({
      type: "SET_LIMITS",
      payload: {
        invoices: limit.invoices.limit,
        receipts: limit.receipts.limit,
        subs: limit.subs.limit,
      },
    });
  };

  // receiptsSum dla wybranego miesiąca
  const receiptsSum = useMemo(
    () =>
      (receipts || [])
        .filter((r) => r.date?.startsWith(state.month))
        .reduce(
          (sum, r) =>
            sum +
            (Array.isArray(r.products)
              ? r.products.reduce(
                  (prodSum, p) => prodSum + Math.abs(Number(p.total || 0)),
                  0
                )
              : 0),
          0
        ),
    [receipts, state.month]
  );

  // invoicesSum dla wybranego miesiąca
  const invoicesSum = useMemo(
    () =>
      (invoices || [])
        .filter((inv) => inv.date?.startsWith(state.month))
        .reduce((sum, inv) => sum + Math.abs(Number(inv.amount || 0)), 0),
    [invoices, state.month]
  );

  // subsSum dla wybranego miesiąca
  const subsSum = useMemo(
    () =>
      (subs || [])
        .filter((sub) => sub.date?.startsWith(state.month))
        .reduce((sum, sub) => sum + Math.abs(Number(sub.amount || 0)), 0),
    [subs, state.month]
  );

  // Dodaj funkcję do ustawiania limitów
  const setLimits = (limitsObj) => {
    dispatch({ type: "SET_LIMITS", payload: limitsObj });
  };

  const value = {
    ...state,
    setMonth,
    setLimits, // <-- dodaj tutaj!
    handleLimitChange,
    handleSaveLimits,
    handleDeleteLimit,
    handleEditLimit,
    invoicesSum,
    receiptsSum,
    subsSum,
    currentMonth,
    currentLimits,
    currentInvoicesSum,
    currentReceiptsSum,
    currentSubsSum,
  };

  return (
    <BudgetLimitsContext.Provider value={value}>
      {children}
    </BudgetLimitsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBudgetLimits() {
  return useContext(BudgetLimitsContext);
}
