import { useState } from "react";
import type { Product } from "../../data/product";
import type { InventarioData } from "../../data/Stock";

interface Props {
  products: InventarioData[];
  onAddProduct: (productId: number, quantity: number) => void;
}

export default function AvailableProductsTable({
  products,
  onAddProduct,
}: Props) {
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  function handleQuantityChange(productId: number, value: string) {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Number(value),
    }));
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-6 py-4 text-left font-semibold">Código</th>
            <th className="px-6 py-4 text-left font-semibold">Producto</th>
            <th className="px-6 py-4 text-left font-semibold">Stock</th>
            <th className="px-6 py-4 text-left font-semibold">Cantidad</th>
            <th className="px-6 py-4 text-left font-semibold">Acción</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <tr
              key={product.productoId}
              className="hover:bg-slate-50 transition"
            >
              <td className="px-6 py-4">{product.codigo}</td>

              <td className="px-6 py-4 font-medium">{product.nombre}</td>

              <td className="px-6 py-4">{product.cantidadInventario}</td>

              <td className="px-6 py-4">
                <input
                  type="number"
                  min="1"
                  max={product.cantidadInventario}
                  value={quantities[product.productoId] || ""}
                  onChange={(e) =>
                    handleQuantityChange(product.productoId, e.target.value)
                  }
                  className="w-20 rounded-lg border px-2 py-1"
                />
              </td>

              <td className="px-6 py-4">
                <button
                  onClick={() =>
                    onAddProduct(
                      product.productoId,
                      quantities[product.productoId] || 1,
                    )
                  }
                  className="rounded-lg bg-cyan-600 px-3 py-2 text-white hover:bg-cyan-700 transition"
                >
                  Agregar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
