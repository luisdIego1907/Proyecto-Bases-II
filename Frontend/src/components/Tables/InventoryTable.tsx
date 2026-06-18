import type { InventarioData } from "../../data/Stock";

type Props = {
  products: InventarioData[];
  maxHeight?: string;
};

export default function InventoryTable({
  products,
  maxHeight = "550px",
}: Props) {
  function formatDate(date?: string) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString();
  }

  return (
    <div
      style={{ maxHeight }}
      className="overflow-auto rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <table className="w-full text-sm">
        {/* Header */}
        <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600 shadow-sm">
          <tr>
            <th className="px-6 py-4 text-left font-semibold">Código</th>

            <th className="px-6 py-4 text-left font-semibold">Producto</th>

            <th className="px-6 py-4 text-left font-semibold">Ubicación</th>

            <th className="px-6 py-4 text-left font-semibold">Existencias</th>

            <th className="px-6 py-4 text-left font-semibold">Estado</th>

            <th className="px-6 py-4 text-left font-semibold">
              Último ingreso
            </th>

            <th className="px-6 py-4 text-left font-semibold">
              Último despacho
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-slate-100">
          {products.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                No hay productos registrados
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr
                key={product.productoId}
                className="transition hover:bg-slate-50"
              >
                <td className="px-6 py-4 font-medium text-slate-800">
                  {product.codigo}
                </td>

                <td className="px-6 py-4 text-slate-700">{product.nombre}</td>

                <td className="px-6 py-4 text-slate-600">
                  {product.bodega} / {product.pasillo} / {product.estante}
                </td>

                <td className="px-6 py-4 font-medium text-slate-800">
                  {product.cantidadInventario}
                </td>

                <td className="px-6 py-4">
                  {product.estadoStock === "REORDEN" ? (
                    <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white">
                      Bajo stock
                    </span>
                  ) : (
                    <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white">
                      Disponible
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {formatDate(product.ultimoIngreso)}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {formatDate(product.ultimoDespacho)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
