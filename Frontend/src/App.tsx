import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { isAuthenticated } from "./auth/sessionAuth";
import ProtectedRoute from "./security/ProtectedRoute";

import Header from "./shared/Header";

import Home from "./features/home/Home";
import LoginForm from "./features/login/Login";
import ProductList from "./features/ProductList";
import ClientForm from "./components/forms/ClientForm";
import ProductForm from "./components/forms/ProductForm";
import InventoryList from "./features/pages/InventoryList";
import ClientList from "./features/pages/ClientList";
import DispatchList from "./features/pages/DispatchList";
import CreateDispatch from "./components/forms/CreateDispatchForm";

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
            {/* Public route */}
            <Route path="/login" element={<LoginForm />} />

            {/* Home */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            {/* Clients */}
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

            {/* Products */}
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

            {/* Inventory */}
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
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
