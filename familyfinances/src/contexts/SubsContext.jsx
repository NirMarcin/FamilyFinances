import { v4 as uuidv4 } from "uuid";
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
  updateDoc,
  where,
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
    case "DISABLE_SUB":
      return {
        ...state,
        subs: state.subs.map((sub) =>
          sub.id === action.id ? { ...sub, active: false } : sub
        ),
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
      amount: -Math.abs(Number(amount)),
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
      const subscriptionId = uuidv4(); // lub Date.now().toString()
      const payments = generatePayments({
        name,
        category,
        amount,
        startDate,
        interval,
        userId: user.uid,
      }).map((payment) => ({
        ...payment,
        subscriptionId,
        active: true,
        startDate, // dodaj pole startDate do każdego payment
      }));
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

  // Wyłącz subskrypcję (zmień active na false)
  const disableSub = useCallback(
    async (subscriptionId) => {
      if (!user) return;
      // Pobierz wszystkie płatności z tym subscriptionId
      const q = query(
        collection(db, "users", user.uid, "subs"),
        where("subscriptionId", "==", subscriptionId)
      );
      const snapshot = await getDocs(q);
      // Ustaw active: false dla każdej płatności tej subskrypcji
      const batch = [];
      snapshot.forEach((docSnap) => {
        batch.push(
          updateDoc(doc(db, "users", user.uid, "subs", docSnap.id), {
            active: false,
          })
        );
      });
      await Promise.all(batch);
      // Zaktualizuj stan lokalny
      dispatch({
        type: "SET_SUBS",
        payload: state.subs.map((sub) =>
          sub.subscriptionId === subscriptionId
            ? { ...sub, active: false }
            : sub
        ),
      });
    },
    [user, state.subs]
  );

  // Dodaj przyszłe płatności
  useEffect(() => {
    if (!user || !state.subs.length) return;

    const addFuturePayments = async () => {
      const now = new Date();
      for (const sub of state.subs) {
        if (sub.active === false) continue;
        // Oblicz datę następnej płatności
        let lastDate = new Date(sub.date);
        let nextDate = new Date(lastDate);
        nextDate.setMonth(nextDate.getMonth() + Number(sub.interval));

        // Jeśli następna płatność jest w przeszłości lub dziś, dodaj ją
        while (nextDate <= now) {
          // Sprawdź czy taka płatność już istnieje
          const exists = state.subs.some(
            (s) =>
              s.subscriptionId === sub.subscriptionId &&
              s.date === nextDate.toISOString().slice(0, 10)
          );
          if (!exists) {
            const payment = {
              name: sub.name,
              category: sub.category,
              amount: sub.amount,
              date: nextDate.toISOString().slice(0, 10),
              interval: sub.interval,
              userId: user.uid,
              subscriptionId: sub.subscriptionId,
              active: true,
            };
            const docRef = await addDoc(
              collection(db, "users", user.uid, "subs"),
              payment
            );
            dispatch({
              type: "ADD_SUBS",
              payload: [{ ...payment, id: docRef.id }],
            });
          }
          nextDate.setMonth(nextDate.getMonth() + Number(sub.interval));
        }
      }
    };

    addFuturePayments();
  }, [user, state.subs]);

  return (
    <SubsContext.Provider
      value={{
        subs: state.subs,
        addSubs,
        deleteSub,
        disableSub,
      }}
    >
      {children}
    </SubsContext.Provider>
  );
}

export default SubsContext;
