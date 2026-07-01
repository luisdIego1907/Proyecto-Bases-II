import { Link } from "react-router-dom";
import {
  Users,
  Archive,
  Clipboard,
  Boxes,
  ArrowRight,
  Logs,
} from "lucide-react";

import { hasRole } from "../../auth/sessionAuth";

export default function QuickActions() {
  const actions = [
    {
      title: "Clientes",
      description: "Gestionar clientes registrados",
      icon: Users,
      to: "/clients",
      roles: ["ADMIN", "SUPERVISOR", "OPERARIO"],
    },
    {
      title: "Recepción",
      description: "Registrar ingreso de mercancía",
      icon: Archive,
      to: "/products",
      roles: ["ADMIN", "SUPERVISOR", "OPERARIO"],
    },
    {
      title: "Inventario",
      description: "Consultar existencias",
      icon: Clipboard,
      to: "/inventory",
      roles: ["ADMIN", "SUPERVISOR", "OPERARIO"],
    },
    {
      title: "Despachos",
      description: "Gestionar despachos",
      icon: Boxes,
      to: "/dispatch",
      roles: ["ADMIN", "SUPERVISOR", "OPERARIO"],
    },
    {
      title: "Auditorías",
      description: "Consultar movimientos",
      icon: Logs,
      to: "/audit",
      roles: ["ADMIN", "SUPERVISOR"],
    },
  ];

  return (
    <section className="mb-12">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900">
          Accesos rápidos
        </h2>

        <p className="text-sm text-slate-500">
          Accede rápidamente a los módulos principales del sistema
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {actions
          .filter((action) => hasRole(action.roles))
          .map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                to={action.to}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Icon size={28} />
                </div>

                <h3 className="text-lg font-semibold text-slate-800">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {action.description}
                </p>

                <div className="mt-6 flex items-center gap-2 font-medium text-blue-600 opacity-0 transition-all group-hover:opacity-100">
                  Ir al módulo

                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </Link>
            );
          })}
      </div>
    </section>
  );
}