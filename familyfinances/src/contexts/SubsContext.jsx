import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
// import { useAuth } from "./AuthContext"; // USUŃ to!
import {
  collection,
  addDoc,
  getDocs,
  query,
  
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const SubsContext = createContext();

const initialState = {
  subs: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_SUBS":
      return { ...state, subs: action.payload };
    case "ADD_SUBS":
      return { ...state, subs: [...state.subs, ...action.payload] };
    case "DELETE_SUB":
      return {
        ...state,
        subs: state.subs.filter((sub) => sub.id !== action.id),
      };
    default:
      return state;
  }
}

// Funkcja generująca płatności wstecz
function generatePayments({
  name,
  category,
  amount,
  startDate,
  interval,
  userId,
}) {
  const payments = [];
  const today = new Date();
  let date = new Date(startDate);

  while (date <= today) {
    payments.push({
      name,
      category,
      amount: Number(amount),
      date: date.toISOString().slice(0, 10),
      interval: Number(interval),
      userId,
    });
    date.setMonth(date.getMonth() + Number(interval));
  }
  return payments;
}

export function SubsProvider({ children, user }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Pobierz subskrypcje z Firestore po zalogowaniu
  useEffect(() => {
    if (!user) {
      dispatch({ type: "SET_SUBS", payload: [] });
      return;
    }
    const fetchSubs = async () => {
      const q = query(collection(db, "users", user.uid, "subs"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      dispatch({ type: "SET_SUBS", payload: data });
    };
    fetchSubs();
  }, [user]);

  // Dodaj subskrypcje do Firestore
  const addSubs = useCallback(
    async ({ name, category, amount, startDate, interval }) => {
      if (!user) return;
      const payments = generatePayments({
        name,
        category,
        amount,
        startDate,
        interval,
        userId: user.uid,
      });
      // Zapisz każdą płatność jako osobny dokument w users/{user.uid}/subs
      const added = [];
      for (const payment of payments) {
        const docRef = await addDoc(
          collection(db, "users", user.uid, "subs"),
          payment
        );
        added.push({ ...payment, id: docRef.id });
      }
      dispatch({ type: "ADD_SUBS", payload: added });
    },
    [user]
  );

  // Usuń subskrypcję (po id dokumentu)
  const deleteSub = useCallback(
    async (id) => {
      if (!user) return;
      await deleteDoc(doc(db, "users", user.uid, "subs", id));
      dispatch({ type: "DELETE_SUB", id });
    },
    [user]
  );

  return (
    <SubsContext.Provider
      value={{
        subs: state.subs,
        addSubs,
        deleteSub,
      }}
    >
      {children}
    </SubsContext.Provider>
  );
}

export default SubsContext;
