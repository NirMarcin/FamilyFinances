import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      // Ustaw sesję tylko na czas otwartej karty/przeglądarki
      await setPersistence(auth, browserSessionPersistence);

      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      return { success: true };
    } catch (error) {
      let message;
      if (error && typeof error.code === "string") {
        switch (error.code) {
          case "auth/invalid-credential":
          case "auth/user-not-found":
          case "auth/wrong-password":
            message = "Nieprawidłowy e-mail lub hasło.";
            break;
          case "auth/network-request-failed":
            message =
              "Brak połączenia z internetem. Sprawdź swoje łącze i spróbuj ponownie.";
            break;
          case "auth/invalid-email":
            message = "Nieprawidłowy format email.";
            break;
          default:
            message = error.message || "Wystąpił nieznany błąd.";
        }
      } else {
        message = typeof error === "string" ? error : "Wystąpił nieznany błąd.";
      }

      setAuthError(message);
      return { success: false, message };
    }
  };

  const register = async (email, password) => {
    setAuthError(null);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(result.user);
      return { success: true };
    } catch (error) {
      let message;
      if (error && typeof error.code === "string") {
        switch (error.code) {
          case "auth/email-already-in-use":
            message = "Email jest już zajęty.";
            break;
          case "auth/invalid-email":
            message = "Nieprawidłowy format email.";
            break;
          case "auth/operation-not-allowed":
            message = "Rejestracja została wyłączona.";
            break;
          case "auth/weak-password":
            message = "Hasło jest zbyt słabe (min. 6 znaków).";
            break;
          case "auth/network-request-failed":
            message =
              "Brak połączenia z internetem. Sprawdź łącze i spróbuj ponownie.";
            break;
          default:
            message =
              error.message || "Wystąpił nieznany błąd podczas rejestracji.";
        }
      } else {
        message =
          typeof error === "string"
            ? error
            : "Wystąpił nieznany błąd podczas rejestracji.";
      }

      setAuthError(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        login,
        register,
        logout,
        setAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
