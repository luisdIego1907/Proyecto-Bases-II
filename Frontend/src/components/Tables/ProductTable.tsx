import { Eye, Pencil } from "lucide-react";
import { usePermissions } from "../../hook/usePermissions";
import type { Product } from "../../data/product";

interface Props {
  products: Product[];
  selectedProducts: number[];

  onSelect: (id: number) => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onSelectProduct: (id: number) => void;
}

export default function ProductTable({
  products,
  selectedProducts,
  onSelect,
  onView,
  onEdit,
  onSelectProduct,
}: Props) {
  const permission = usePermissions();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="max-h-[70vh] overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">
                Código
              </th>

              <th className="px-6 py-4 text-left font-semibold">
                Nombre
              </th>

              <th className="px-6 py-4 text-left font-semibold">
                Stock Crítico
              </th>

              <th className="px-6 py-4 text-left font-semibold">
                Estado
              </th>

              {permission.deleteProducts && (
                <th className="px-6 py-4 text-center font-semibold">
                  Seleccionar
                </th>
              )}

              <th className="px-6 py-4 text-center font-semibold">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {products.map((p) => {
              const isSelected = selectedProducts.includes(
                p.productoId
              );

              return (
                <tr
                  key={p.productoId}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {p.codigo}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        onSelectProduct(p.productoId)
                      }
                      className="font-medium text-cyan-600 hover:text-cyan-700 hover:underline"
                    >
                      {p.nombre}
                    </button>
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {p.stockCritico}
                  </td>

                  <td className="px-6 py-4">
                    {p.activo ? (
                      <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs text-green-700">
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs text-red-600">
                        Inactivo
                      </span>
                    )}
                  </td>

                  {permission.deleteProducts && (
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          onSelect(p.productoId)
                        }
                        className="h-4 w-4 cursor-pointer accent-cyan-600"
                      />
                    </td>
                  )}

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">

                      <div className="group relative">
                        <button
                          type="button"
                          onClick={() => onView(p.productoId)}
                          className="rounded-lg p-2 text-cyan-600 transition hover:bg-cyan-50 hover:text-cyan-700"
                        >
                          <Eye size={18} />
                        </button>

                        <span className="pointer-events-none absolute -top-11 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100">
                          Ver producto
                          <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-slate-800" />
                        </span>
                      </div>

                      {permission.updateProducts && (
                        <div className="group relative">
                          <button
                            type="button"
                            onClick={() => onEdit(p.productoId)}
                            className="rounded-lg p-2 text-emerald-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            <Pencil size={18} />
                          </button>

                          <span className="pointer-events-none absolute -top-11 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100">
                            Editar producto
                            <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-slate-800" />
                          </span>
                        </div>
                      )}

                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}