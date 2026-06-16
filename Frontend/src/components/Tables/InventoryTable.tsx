type Props = {
  products: any[];
};

export default function InventoryTable({ products }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-slate-50 text-slate-600">
            <th className="px-6 py-4 text-left font-semibold">Código</th>

            <th className="px-6 py-4 text-left font-semibold">Producto</th>

            <th className="px-6 py-4 text-left font-semibold">Ubicación</th>

            <th className="px-6 py-4 text-left font-semibold">Stock</th>

            <th className="px-6 py-4 text-left font-semibold">Estado</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <tr
              key={product.productoId}
              className="hover:bg-slate-50 transition"
            >
              <td className="px-6 py-4 font-medium text-slate-800">
                {product.codigo}
              </td>

              <td className="px-6 py-4 text-slate-600">{product.nombre}</td>

              <td className="px-6 py-4 text-slate-600">
                {product.bodega} / {product.pasillo} / {product.estante}
              </td>

              <td className="px-6 py-4 text-slate-600">
                {product.cantidadInventario}
              </td>

              <td className="px-6 py-4 text-slate-600">
                {product.estadoStock === "REORDEN" ? (
                  <span className="bg-red-500 text-white py-1 px-2 rounded-full text-xs">
                    Bajo stock
                  </span>
                ) : (
                  <span className="bg-green-500 text-white py-1 px-2 rounded-full text-xs">
                    Disponible
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
