import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { isAuthenticated } from "./auth/sessionAuth";
import ProtectedRoute from "./security/ProtectedRoute";

import Header from "./shared/Header";

import Home from "./features/home/Home";
import LoginForm from "./features/login/Login";
import ProductList from "./features/pages/ProductList";
import ClientForm from "./components/forms/ClientForm";
import ProductForm from "./components/forms/ProductForm";
import InventoryList from "./features/pages/InventoryList";
import ClientList from "./features/pages/ClientList";
import DispatchList from "./features/pages/DispatchList";
import CreateDispatch from "./components/forms/CreateDispatchForm";
import ReceptionForm from "./components/forms/ReceptionForm";
import AuditPage from "./features/pages/AuditPage";

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
                  <ClientForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/clients/:id"
              element={
                <ProtectedRoute>
                  <ClientForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <ProductList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/products/register"
              element={
                <ProtectedRoute>
                  <ProductForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/products/:id"
              element={
                <ProtectedRoute>
                  <ProductForm />
                </ProtectedRoute>
              }
            />

            <Route path="/products/:id/reception" element={<ReceptionForm />} />

            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <InventoryList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dispatch"
              element={
                <ProtectedRoute>
                  <DispatchList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dispatch/create"
              element={
                <ProtectedRoute>
                  <CreateDispatch />
                </ProtectedRoute>
              }
            />

            <Route
              path="/audit"
              element={
                <ProtectedRoute>
                  <AuditPage />
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
