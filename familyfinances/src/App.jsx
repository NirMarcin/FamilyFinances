import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Charts from "./pages/Charts";
import Budget from "./pages/Budget";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

import { AuthProvider } from "./contexts/AuthContext";
import { ReceiptsProvider } from "./contexts/ReceiptsContext";
import { InvoiceProvider } from "./contexts/InvoiceContext";
import { IncomeProvider } from "./contexts/IncomeContext";
import { SubsProvider } from "./contexts/SubsContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

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
                  <Route path="/" element={<Home />} />
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
                  <Route
                    path="/budget"
                    element={user ? <Budget /> : <Navigate to="/login" />}
                  />
                  <Route
                    path="/reports"
                    element={user ? <Reports /> : <Navigate to="/login" />}
                  />
                  <Route
                    path="/settings"
                    element={user ? <Settings /> : <Navigate to="/login" />}
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
