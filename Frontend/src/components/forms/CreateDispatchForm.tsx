import { useState } from "react";
import ClientSelector from "../../components/dispatch/ClientSelector";
import { inventoryMock } from "../../mock/inventario.mock";
import type { InventarioData } from "../../data/Stock";
import AvailableProductsTable from "../Tables/AvailableProductTable";
import type { CartItem } from "../../data/dispatch/CartItem";
import DispatchCart from "../dispatch/DispatchCart";

export default function CreateDispatch() {
  // Cliente seleccionado
  const [selectedClient, setSelectedClient] = useState("");

  // Temporal: crear despacho
  function handleCreateDispatch() {
    console.log("Crear despacho para cliente:", selectedClient);
  }

  // Temporal: procesar despacho; conectar BE
  function handleProcessDispatch() {
    console.log("Procesar despacho");
  }

  //Obtener la tabla de productos
  const [products, setProducts] = useState<InventarioData[]>(
    inventoryMock.filter((p) => p.cantidadInventario > 0),
  );

  const [cart, setCart] = useState<CartItem[]>([]);

  function handleAddProduct(productId: number, quantity: number) {
    const product = products.find((p) => p.productoId === productId);

    if (!product) return;

    // VALIDACIONES

    if (quantity <= 0) {
      alert("Ingrese una cantidad válida");
      return;
    }

    if (quantity > product.cantidadInventario) {
      alert("Stock insuficiente");
      return;
    }

    // actualizar carrito

    setCart((prev) => {
      const existing = prev.find((item) => item.productoId === productId);

      if (existing) {
        return prev.map((item) =>
          item.productoId === productId
            ? {
                ...item,
                cantidad: item.cantidad + quantity,
              }
            : item,
        );
      }

      return [
        ...prev,
        {
          productoId: product.productoId,
          nombre: product.nombre,
          cantidad: quantity,
        },
      ];
    });

    // descontar stock visualmente

    setProducts((prev) =>
      prev.map((product) =>
        product.productoId === productId
          ? {
              ...product,
              cantidadInventario: product.cantidadInventario - quantity,
            }
          : product,
      ),
    );
  }

  //Funcion para quitar items del carrito
  function handleRemoveProduct(productId: number) {
    const cartItem = cart.find((item) => item.productoId === productId);

    if (!cartItem) return;

    // devolver stock

    setProducts((prev) =>
      prev.map((product) =>
        product.productoId === productId
          ? {
              ...product,
              cantidadInventario:
                product.cantidadInventario + cartItem.cantidad,
            }
          : product,
      ),
    );

    // quitar carrito

    setCart((prev) => prev.filter((item) => item.productoId !== productId));
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Nuevo Despacho</h1>

        <p className="mt-1 text-slate-500">
          Seleccione un cliente y agregue productos al despacho
        </p>
      </div>

      {/* Selección cliente */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <ClientSelector
          selectedClient={selectedClient}
          onChange={setSelectedClient}
          onCreate={handleCreateDispatch}
        />
      </div>

      {/* Productos + carrito */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Tabla productos */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Productos Disponibles
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Seleccione productos disponibles en inventario
            </p>
          </div>

          {/* Temporal */}
          <AvailableProductsTable
            products={products}
            onAddProduct={handleAddProduct}
          />
        </div>

        {/* Carrito */}
        <DispatchCart
          cart={cart}
          onRemove={handleRemoveProduct}
          onProcess={handleProcessDispatch}
        />
      </div>
    </div>
  );
}
