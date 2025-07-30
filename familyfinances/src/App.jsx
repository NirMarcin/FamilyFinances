import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";

import { AuthProvider } from "./contexts/AuthContext";
import { ReceiptsProvider } from "./contexts/ReceiptsContext";
import { InvoiceProvider } from "./contexts/InvoiceContext";
import { IncomeProvider } from "./contexts/IncomeContext";
import { SubsProvider } from "./contexts/SubsContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Charts from "./pages/Charts";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    // Możesz tu wstawić ekran ładowania
    return <div>Ładowanie...</div>;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <SubsProvider user={user}>
          <InvoiceProvider user={user}>
            <ReceiptsProvider user={user}>
              <IncomeProvider user={user}>
                <Routes>
                  {/* Publiczne */}
                  <Route
                    path="/login"
                    element={user ? <Navigate to="/dashboard" /> : <Login />}
                  />
                  <Route
                    path="/register"
                    element={user ? <Navigate to="/dashboard" /> : <Register />}
                  />

                  {/* Chronione */}
                  <Route
                    path="/"
                    element={user ? <Home /> : <Navigate to="/login" />}
                  />
                  <Route
                    path="/dashboard"
                    element={user ? <Dashboard /> : <Navigate to="/login" />}
                  />
                  <Route
                    path="/expenses"
                    element={user ? <Expenses /> : <Navigate to="/login" />}
                  />
                  <Route
                    path="/charts"
                    element={user ? <Charts /> : <Navigate to="/login" />}
                  />
                  {/* Możesz dodać też Route na 404 */}
                  <Route
                    path="*"
                    element={<Navigate to={user ? "/" : "/login"} />}
                  />
                </Routes>
              </IncomeProvider>
            </ReceiptsProvider>
          </InvoiceProvider>
        </SubsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
