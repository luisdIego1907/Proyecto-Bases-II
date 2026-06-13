import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./shared/Header";
import Home from "./features/home/Home";
import ClientList from "./features/pages/ClientList";
import ClientEditForm from "./components/forms/ClientEditForm";
import ClientRegisterForm from "./components/forms/ClientRegisterForm";
import LoginForm from "./features/login/Login";
import ProtectedRoute from "./security/ProtectedRoute";
import { isAuthenticated } from "./auth/sessionAuth";
import InventoryList from "./features/pages/InventoryList";

function App() {
  const [auth, setAuth] = useState(isAuthenticated());

  useEffect(() => {
    const interval = setInterval(() => {
      setAuth(isAuthenticated());
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        {auth && <Header />}

        <main className="flex-1">
          <Routes>
            <Route path="/login" element={<LoginForm />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <ProtectedRoute>
                  <ClientList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/register"
              element={
                <ProtectedRoute>
                  <ClientRegisterForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/:id"
              element={
                <ProtectedRoute>
                  <ClientEditForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <InventoryList />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
