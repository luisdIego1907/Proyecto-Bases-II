import { useEffect, useState } from "react";
import {
  Users,
  Package,
  CircleAlert,
} from "lucide-react";

import { getClientes } from "../../services/ClientService";
import { getProducts } from "../../services/ProductService";
import { getDispatches } from "../../services/DispatchService";

export default function DashboardCards() {
  const [stats, setStats] = useState({
    clientes: 0,
    productos: 0,
    despachosPendientes: 0,
  });

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [clientes, productos, despachos] =
          await Promise.all([
            getClientes(),
            getProducts(),
            getDispatches(),
          ]);

        setStats({
          clientes: clientes.length,
          productos: productos.length,
          despachosPendientes: despachos.filter(
            (d) =>
              d.estado?.toUpperCase() === "PENDIENTE"
          ).length,
        });
      } catch (error) {
        console.error(
          "Error cargando dashboard:",
          error,
        );
      }
    }

    loadDashboard();
  }, []);

  const cards = [
    {
      title: "Clientes",
      value: stats.clientes,
      subtitle: "Clientes registrados",
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Productos",
      value: stats.productos,
      subtitle: "Productos registrados",
      icon: Package,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Pendientes",
      value: stats.despachosPendientes,
      subtitle: "Despachos pendientes",
      icon: CircleAlert,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <section className="mb-12">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900">
          Resumen del sistema
        </h2>

        <p className="text-sm text-slate-500">
          Información general del sistema
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {card.title}
                  </p>

                  <h3 className="mt-3 text-4xl font-bold text-slate-900">
                    {card.value}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {card.subtitle}
                  </p>
                </div>

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.color}`}
                >
                  <Icon size={28} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}