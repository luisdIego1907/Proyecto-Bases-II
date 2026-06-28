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
import NotFoundPage from "./shared/NotFoundPage";

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
            {/* Login */}
            <Route path="/login" element={<LoginForm />} />

            {/* Home */}
            <Route
              path="/"
              element={
                <ProtectedRoute roles={["ADMIN", "SUPERVISOR", "OPERARIO"]}>
                  <Home />
                </ProtectedRoute>
              }
            />

            {/* Clientes */}
            <Route
              path="/clients"
              element={
                <ProtectedRoute roles={["ADMIN", "SUPERVISOR", "OPERARIO"]}>
                  <ClientList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/clients/register"
              element={
                <ProtectedRoute roles={["ADMIN", "SUPERVISOR"]}>
                  <ClientForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/clients/:id"
              element={
                <ProtectedRoute roles={["ADMIN", "SUPERVISOR"]}>
                  <ClientForm />
                </ProtectedRoute>
              }
            />

            {/* Productos */}
            <Route
              path="/products"
              element={
                <ProtectedRoute roles={["ADMIN", "SUPERVISOR", "OPERARIO"]}>
                  <ProductList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/products/register"
              element={
                <ProtectedRoute roles={["ADMIN", "SUPERVISOR"]}>
                  <ProductForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/products/:id"
              element={
                <ProtectedRoute roles={["ADMIN", "SUPERVISOR"]}>
                  <ProductForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/products/:id/reception"
              element={
                <ProtectedRoute roles={["ADMIN", "SUPERVISOR", "OPERARIO"]}>
                  <ReceptionForm />
                </ProtectedRoute>
              }
            />

            {/* Inventario */}
            <Route
              path="/inventory"
              element={
                <ProtectedRoute roles={["ADMIN", "SUPERVISOR", "OPERARIO"]}>
                  <InventoryList />
                </ProtectedRoute>
              }
            />

            {/* Despachos */}
            <Route
              path="/dispatch"
              element={
                <ProtectedRoute roles={["ADMIN", "SUPERVISOR"]}>
                  <DispatchList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dispatch/create"
              element={
                <ProtectedRoute roles={["ADMIN", "SUPERVISOR", "OPERARIO"]}>
                  <CreateDispatch />
                </ProtectedRoute>
              }
            />

            {/* Auditoría */}
            <Route
              path="/audit"
              element={
                <ProtectedRoute roles={["ADMIN", "SUPERVISOR"]}>
                  <AuditPage />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
