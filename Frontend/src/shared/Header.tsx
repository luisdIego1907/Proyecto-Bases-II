import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  House,
  Users,
  Box,
  Menu,
  X,
  LogOut,
  User,
  Clipboard,
  Boxes,
  Logs,
} from "lucide-react";

import { isAuthenticated, clearSession } from "../auth/sessionAuth";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [auth, setAuth] = useState(isAuthenticated());

  useEffect(() => {
    const update = () => setAuth(isAuthenticated());

    window.addEventListener("auth-change", update);
    return () => window.removeEventListener("auth-change", update);
  }, []);

  const links = [
    { name: "Inicio", icon: <House size={18} />, to: "/" },
    { name: "Clientes", icon: <Users size={18} />, to: "/clients" },
    {
      name: "Recepción de Mercancía",
      icon: <Box size={18} />,
      to: "/products",
    },
    { name: "Inventario", icon: <Clipboard size={18} />, to: "/inventory" },
    { name: "Despacho", icon: <Boxes size={18} />, to: "/dispatch" },
    { name: "Auditorias", icon: <Logs size={18} />, to: "/audit" },
  ];

  const handleLogout = () => {
    clearSession();
    setDropdownOpen(false);
    setIsOpen(false);
  };

  if (!auth) return null;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <Package size={34} className="text-blue-600" />

            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-800">SGID</span>
              <span className="text-xs text-slate-500">
                Inventario y Despachos
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className="group relative flex items-center gap-2 text-[15px] font-semibold text-slate-600 transition-colors hover:text-blue-600"
              >
                <span className="text-slate-400 transition-all group-hover:text-blue-600">
                  {link.icon}
                </span>

                {link.name}

                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
              </Link>
            ))}

            <div className="relative ml-2">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition"
              >
                <User size={18} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 transition"
                  >
                    <LogOut size={16} />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </nav>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-700"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-slate-200 py-4">
            <nav className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-slate-600 hover:text-blue-600"
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 text-red-500 font-semibold"
              >
                <LogOut size={18} />
                Cerrar sesión
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
