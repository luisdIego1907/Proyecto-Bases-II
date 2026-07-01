import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { InventarioData } from "../../data/Stock";

interface Props {
  products: InventarioData[];
}

export default function StockCriticalCard({
  products,
}: Props) {
  const criticalProducts = products
    .filter((p) => p.cantidadInventario <= p.stockCritico)
    .sort(
      (a, b) =>
        a.cantidadInventario - b.cantidadInventario
    )
    .slice(0, 5);

  return (
    <section className="rounded-2xl border border-red-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <AlertTriangle
            size={22}
            className="text-red-500"
          />

          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Stock crítico
            </h2>

            <p className="text-sm text-slate-500">
              Productos que requieren reposición
            </p>
          </div>
        </div>

        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
          {criticalProducts.length}
        </span>
      </div>

      {criticalProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12">
          <CheckCircle2
            size={44}
            className="text-emerald-500"
          />

          <div className="text-center">
            <p className="font-semibold text-slate-700">
              Todo está en orden
            </p>

            <p className="text-sm text-slate-500">
              No existen productos con stock crítico
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {criticalProducts.map((product) => {
            const percentage = Math.min(
              (product.cantidadInventario /
                product.stockCritico) *
                100,
              100
            );

            return (
              <div
                key={product.productoId}
                className="px-6 py-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">
                      {product.nombre}
                    </p>

                    <p className="text-sm text-slate-500">
                      {product.codigo}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {product.bodega}
                    </p>
                  </div>

                  <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
                    {product.cantidadInventario} uds
                  </span>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-xs text-slate-500">
                    <span>
                      Stock crítico:
                      {" "}
                      {product.stockCritico}
                    </span>

                    <span>
                      {Math.round(percentage)}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-red-500"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="border-t border-slate-100 p-4">
        <Link
          to="/inventory"
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Ver inventario

          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}