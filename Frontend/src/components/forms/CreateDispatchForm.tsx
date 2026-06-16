import { useEffect, useState } from "react";

import ClientSelector from "../../components/dispatch/ClientSelector";
import AvailableProductsTable from "../Tables/AvailableProductTable";
import DispatchCart from "../dispatch/DispatchCart";

import type { InventarioData } from "../../data/Stock";
import type { CartItem } from "../../data/dispatch/CartItem";
import type { ClientListItem } from "../../data/client";

import { getInventory } from "../../services/ProductService";
import { getClientes } from "../../services/ClientService";
import {
  addCartItem,
  createDispatch,
  processDispatch,
} from "../../services/DispatchService";

export default function CreateDispatch() {
  const [clients, setClients] = useState<ClientListItem[]>([]);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);

  const [products, setProducts] = useState<InventarioData[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [dispatchId, setDispatchId] = useState<number | null>(null);
  const [dispatchCreated, setDispatchCreated] = useState(false);

  const [loading, setLoading] = useState(true);
  const [creatingDispatch, setCreatingDispatch] = useState(false);
  const [processingDispatch, setProcessingDispatch] = useState(false);

  async function loadInitialData() {
    try {
      const clientsData = await getClientes();

      const validClients = clientsData.filter(
        (client) =>
          client.rolCliente === "DESTINO" || client.rolCliente === "AMBOS",
      );

      setClients(validClients);

      const inventory = await getInventory();

      setProducts(
        inventory.filter((product) => product.cantidadInventario > 0),
      );
    } catch (error) {
      console.log(error);
      alert("No se pudieron cargar los datos");
    }
  }

  useEffect(() => {
    async function load() {
      await loadInitialData();
      setLoading(false);
    }

    load();
  }, []);

  async function handleCreateDispatch() {
    if (!selectedClient) {
      alert("Debe seleccionar un cliente");
      return;
    }

    if (creatingDispatch) return;

    try {
      setCreatingDispatch(true);

      const response = await createDispatch({
        clienteId: selectedClient,
        usuarioId: 1,
      });

      setDispatchId(response.despachoId);
      setDispatchCreated(true);

      alert(response.mensaje);
    } catch (error) {
      console.log(error);

      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setCreatingDispatch(false);
    }
  }

  async function handleAddProduct(productId: number, quantity: number) {
    if (!dispatchId) {
      alert("Debe crear despacho primero");
      return;
    }

    if (processingDispatch) return;

    const product = products.find((p) => p.productoId === productId);

    if (!product) return;

    if (quantity <= 0) {
      alert("Ingrese una cantidad válida");
      return;
    }

    if (quantity > product.cantidadInventario) {
      alert("Stock insuficiente");
      return;
    }

    try {
      await addCartItem({
        despachoId: dispatchId,
        productoId: productId,
        cantidadSolicitada: quantity,
      });

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

      setProducts((prev) =>
        prev
          .map((item) =>
            item.productoId === productId
              ? {
                  ...item,
                  cantidadInventario: item.cantidadInventario - quantity,
                }
              : item,
          )
          .filter((item) => item.cantidadInventario > 0),
      );
    } catch (error) {
      console.log(error);

      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  async function handleProcessDispatch() {
    if (!dispatchId) {
      alert("No existe despacho");
      return;
    }

    if (cart.length === 0) {
      alert("Debe agregar productos");
      return;
    }

    if (processingDispatch) return;

    try {
      setProcessingDispatch(true);

      const response = await processDispatch({
        despachoId: dispatchId,
        usuarioId: 1,
      });

      alert(response.mensaje);

      await loadInitialData();

      setCart([]);
      setSelectedClient(null);
      setDispatchId(null);
      setDispatchCreated(false);
    } catch (error) {
      console.log(error);

      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setProcessingDispatch(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-slate-500">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Nuevo Despacho</h1>

        <p className="mt-1 text-slate-500">
          Seleccione un cliente y agregue productos al despacho
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <ClientSelector
          clients={clients}
          selectedClient={selectedClient}
          onChange={setSelectedClient}
          onCreate={handleCreateDispatch}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Productos Disponibles
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Seleccione productos disponibles en inventario
            </p>
          </div>

          {dispatchCreated ? (
            <AvailableProductsTable
              products={products}
              onAddProduct={handleAddProduct}
            />
          ) : (
            <div className="rounded-xl bg-slate-50 p-4 text-slate-500">
              Cree un despacho primero para habilitar productos
            </div>
          )}
        </div>

        <DispatchCart cart={cart} onProcess={handleProcessDispatch} />
      </div>
    </div>
  );
}
