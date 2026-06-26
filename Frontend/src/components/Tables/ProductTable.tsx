import type { Product } from "../../data/product";

interface Props {
  products: Product[];
  selectedProducts: number[];

  onSelect: (id: number) => void;
  onEdit: (id: number) => void;
  onSelectProduct: (id: number) => void;
}

export default function ProductTable({
  products,
  selectedProducts,
  onSelect,
  onEdit,
  onSelectProduct,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="max-h-[70vh] overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600 border-b border-slate-200">
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

              <th className="px-6 py-4 text-center font-semibold">
                Seleccionar
              </th>

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
                  className="hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {p.codigo}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        onSelectProduct(p.productoId)
                      }
                      className="text-cyan-600 hover:text-cyan-700 hover:underline font-medium"
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

                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() =>
                        onEdit(p.productoId)
                      }
                      className="rounded-lg px-3 py-1 font-medium text-cyan-600 hover:bg-cyan-50"
                    >
                      Editar
                    </button>
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