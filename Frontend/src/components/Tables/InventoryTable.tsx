type Props = {
  products: any[];
};

export default function InventoryTable({ products }: Props) {
  return (
    <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10">
      <table className="w-full table-fixed">
        <thead>
          <tr className="bg-gray-100">
            <th className="w-1/6 py-4 px-6 text-left text-gray-600 font-bold uppercase">
              Código
            </th>

            <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
              Producto
            </th>

            <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
              Ubicación
            </th>

            <th className="w-1/6 py-4 px-6 text-left text-gray-600 font-bold uppercase">
              Stock
            </th>

            <th className="w-1/6 py-4 px-6 text-left text-gray-600 font-bold uppercase">
              Estado
            </th>
          </tr>
        </thead>

        <tbody className="bg-white">
          {products.map((product) => (
            <tr key={product.productoId}>
              <td className="py-4 px-6 border-b border-gray-200">
                {product.codigo}
              </td>

              <td className="py-4 px-6 border-b border-gray-200">
                {product.nombre}
              </td>

              <td className="py-4 px-6 border-b border-gray-200">
                {product.bodega} / {product.pasillo} / {product.estante}
              </td>

              <td className="py-4 px-6 border-b border-gray-200">
                {product.cantidadInventario}
              </td>

              <td className="py-4 px-6 border-b border-gray-200">
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
