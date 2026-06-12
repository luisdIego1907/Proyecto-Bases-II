import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  House,
  Users,
  Box,
  Menu,
  X,
} from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    {
      name: "Inicio",
      icon: <House size={18} />,
      to: "/",
    },
    {
      name: "Clientes",
      icon: <Users size={18} />,
      to: "/clients",
    },
    {
      name: "Productos",
      icon: <Box size={18} />,
      to: "/products",
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <Package
              size={34}
              className="text-blue-600"
            />

            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-800">
                SGID
              </span>

              <span className="text-xs text-slate-500">
                Inventario y Despachos
              </span>
            </div>
          </Link>

          {/* Desktop */}
           <nav className="flex items-center gap-6">
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
          </nav>

          {/* Mobile Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-700"
          >
            {isOpen ? (
              <X size={26} />
            ) : (
              <Menu size={26} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
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
                  <span>{link.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

