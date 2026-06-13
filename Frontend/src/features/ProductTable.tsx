import type { Product } from "../data/product";

interface Props {
  products: Product[];
  selectedProducts: number[];
  onSelect: (id: number) => void;
  onEdit: (id: number) => void;
}

export default function ProductTable({
  products,
  selectedProducts,
  onSelect,
  onEdit,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">

        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-6 py-4 text-left font-semibold">Código</th>
            <th className="px-6 py-4 text-left font-semibold">Nombre</th>
            <th className="px-6 py-4 text-left font-semibold">Stock Crítico</th>
            <th className="px-6 py-4 text-left font-semibold">Inventario</th>
            <th className="px-6 py-4 text-left font-semibold">Estado</th>
            <th className="px-6 py-4 text-center font-semibold">Seleccionar</th>
            <th className="px-6 py-4 text-center font-semibold">Acciones</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {products.map((p) => {
            const isSelected = selectedProducts.includes(p.productoId);

            return (
              <tr key={p.productoId} className="hover:bg-slate-50 transition">

                <td className="px-6 py-4 font-medium text-slate-800">
                  {p.codigo}
                </td>

                <td className="px-6 py-4 text-slate-700">
                  {p.nombre}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {p.stockCritico}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {p.cantidadInventario}
                </td>

                <td className="px-6 py-4">
                  {p.activo ? (
                    <span className="inline-flex px-3 py-1 rounded-full text-xs bg-green-50 text-green-700">
                      Activo
                    </span>
                  ) : (
                    <span className="inline-flex px-3 py-1 rounded-full text-xs bg-red-50 text-red-600">
                      Inactivo
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect(p.productoId)}
                    className="h-4 w-4 accent-cyan-600 cursor-pointer"
                  />
                </td>

                {/* EDIT */}
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onEdit(p.productoId)}
                    className="text-cyan-600 hover:bg-cyan-50 px-3 py-1 rounded-lg font-medium"
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
  );
}