import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Menu,
  LogOut,
  ChevronDown,
  X,
  House,
  Users,
  Clipboard,
  Boxes,
  Logs,
  Archive,
} from "lucide-react";

import {
  clearSession,
  hasRole,
  isAuthenticated,
  getRoles,
} from "../auth/sessionAuth";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [auth, setAuth] = useState(isAuthenticated());

  useEffect(() => {
    const update = () => setAuth(isAuthenticated());

    window.addEventListener("auth-change", update);

    return () =>
      window.removeEventListener("auth-change", update);
  }, []);

  const handleLogout = () => {
    clearSession();
    setDropdownOpen(false);
    setSidebarOpen(false);
  };

  const roles = getRoles();
  const mainRole = roles[0];

  const getRoleLabel = () => {
    switch (mainRole) {
      case "ADMIN":
        return "Administrador";

      case "SUPERVISOR":
        return "Supervisor";

      case "OPERARIO":
        return "Operario";

      default:
        return "Usuario";
    }
  };

  const roleLabel = getRoleLabel();

  const getInitials = () =>
    roleLabel.charAt(0).toUpperCase();

  if (!auth) return null;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setSidebarOpen(!sidebarOpen)
              }
              className="rounded-lg p-2 transition hover:bg-slate-100"
            >
              <Menu size={24} />
            </button>

            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <Package
                size={34}
                className="text-blue-600"
              />

              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  SGID
                </h1>

                <p className="text-xs text-slate-500">
                  Inventario y Despachos
                </p>
              </div>
            </Link>
          </div>

          <div className="relative">

            <button
              type="button"
              onClick={() =>
                setDropdownOpen(!dropdownOpen)
              }
              className={`flex items-center gap-3 px-3 py-2 transition-all duration-200 ${dropdownOpen
                  ? "rounded-t-2xl bg-white shadow-lg"
                  : "rounded-2xl hover:bg-slate-50"
                }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                {getInitials()}
              </div>

              <div className="text-left">
                <p className="text-sm font-semibold text-slate-700">
                  {roleLabel}
                </p>

                <p className="text-xs text-slate-400">
                  {mainRole}
                </p>
              </div>

              <ChevronDown
                size={18}
                className={`text-slate-400 transition-transform duration-200 ${dropdownOpen
                    ? "rotate-180"
                    : ""
                  }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full w-full overflow-hidden rounded-b-2xl border border-t-0 border-slate-200 bg-white shadow-lg">

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 "
                >
                  <LogOut size={18} />

                  <span className="font-medium">
                    Cerrar sesión
                  </span>
                </button>

              </div>
            )}

          </div>
        </div>
      </header>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 ${sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Menú
            </h2>

            <p className="text-xs text-slate-500">
              Navegación principal
            </p>
          </div>

          <button
            onClick={() =>
              setSidebarOpen(false)
            }
            className="rounded-lg p-2 transition hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          <Link
            to="/"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="group flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <span className="text-slate-400 transition-colors group-hover:text-blue-600">
              <House size={20} />
            </span>

            Inicio
          </Link>

          <Link
            to="/clients"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="group flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <span className="text-slate-400 transition-colors group-hover:text-blue-600">
              <Users size={20} />
            </span>

            Clientes
          </Link>

          <Link
            to="/products"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="group flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <span className="text-slate-400 transition-colors group-hover:text-blue-600">
              <Archive size={20} />
            </span>

            Recepción de mercancía
          </Link>

          <Link
            to="/inventory"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="group flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <span className="text-slate-400 transition-colors group-hover:text-blue-600">
              <Clipboard size={20} />
            </span>

            Inventario
          </Link>

          <Link
            to="/dispatch"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="group flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <span className="text-slate-400 transition-colors group-hover:text-blue-600">
              <Boxes size={20} />
            </span>

            Despachos
          </Link>

          {hasRole(["ADMIN", "SUPERVISOR"]) && (
            <Link
              to="/audit"
              onClick={() =>
                setSidebarOpen(false)
              }
              className="group flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
            >
              <span className="text-slate-400 transition-colors group-hover:text-blue-600">
                <Logs size={20} />
              </span>

              Auditorías
            </Link>
          )}
        </nav>
      </aside>
    </>
  );
}