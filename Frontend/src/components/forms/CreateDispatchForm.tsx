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

import FeedbackModal from "../../shared/FeedbackModal";
import { getUserId } from "../../auth/sessionAuth";

/**
 * CreateDispatch
 *
 * Este componente maneja todo el flujo de creación y procesamiento de despachos:
 * 1. Carga de clientes válidos
 * 2. Carga de inventario real desde backend
 * 3. Creación de despacho
 * 4. Agregado de productos al carrito del despacho
 * 5. Procesamiento final del despacho
 *
 * El backend es la fuente de verdad del inventario, por lo que el frontend
 * no simula cambios en stock, solo refleja datos reales.
 */
export default function CreateDispatch() {
  /**
   * Clientes disponibles para despachar
   */
  const [clients, setClients] = useState<ClientListItem[]>([]);

  /**
   * Cliente seleccionado para el despacho actual
   */
  const [selectedClient, setSelectedClient] = useState<number | null>(null);

  /**
   * Productos disponibles en inventario (estado real del backend)
   */
  const [products, setProducts] = useState<InventarioData[]>([]);

  /**
   * Carrito temporal del despacho
   */
  const [cart, setCart] = useState<CartItem[]>([]);

  /**
   * ID del despacho activo
   */
  const [dispatchId, setDispatchId] = useState<number | null>(null);

  /**
   * Indica si ya se creó el despacho
   */
  const [dispatchCreated, setDispatchCreated] = useState(false);

  /**
   * Estados de carga y control de acciones
   */
  const [loading, setLoading] = useState(true);
  const [creatingDispatch, setCreatingDispatch] = useState(false);
  const [processingDispatch, setProcessingDispatch] = useState(false);

  /**
   * Modal de feedback para mensajes al usuario
   */
  const [modal, setModal] = useState({
    open: false,
    type: "success" as "success" | "error" | "warning",
    message: "",
  });

  /**
   * Usuario autenticado (se obtiene una sola vez al renderizar)
   */
  const userId = getUserId();

  /**
   * Muestra mensajes en el modal de feedback
   */
  function showMessage(type: "success" | "error" | "warning", message: string) {
    setModal({
      open: true,
      type,
      message,
    });
  }

  /**
   * Carga inicial de datos:
   * - Clientes válidos (DESTINO o AMBOS)
   * - Inventario real desde backend
   */
  async function loadInitialData() {
    try {
      const clientsData = await getClientes();

      const validClients = clientsData.filter(
        (client) =>
          client.rolCliente === "DESTINO" || client.rolCliente === "AMBOS",
      );

      setClients(validClients);

      const inventory = await getInventory();

      setProducts(inventory.filter((p) => p.cantidadInventario > 0));
    } catch (error) {
      console.log(error);
      showMessage("error", "No se pudieron cargar los datos");
    }
  }

  /**
   * Carga inicial al montar el componente
   */
  useEffect(() => {
    async function load() {
      try {
        await loadInitialData();
      } catch (error) {
        console.log(error);
        showMessage("error", "No se pudieron cargar los datos");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /**
   * Crea un despacho en estado PENDIENTE
   */
  async function handleCreateDispatch() {
    if (!selectedClient) {
      showMessage("warning", "Debe seleccionar un cliente");
      return;
    }

    if (creatingDispatch) return;

    if (!userId) {
      showMessage("error", "Usuario no autenticado");
      return;
    }

    try {
      setCreatingDispatch(true);

      const response = await createDispatch({
        clienteId: selectedClient,
        usuarioId: userId,
      });

      setDispatchId(response.despachoId);
      setDispatchCreated(true);

      showMessage("success", response.mensaje);
    } catch (error) {
      console.log(error);

      if (error instanceof Error) {
        showMessage("error", error.message);
      }
    } finally {
      setCreatingDispatch(false);
    }
  }

  /**
   * Agrega productos al carrito del despacho
   *
   * Importante:
   * - NO se modifica el inventario local
   * - El backend valida el stock real al procesar
   */
  async function handleAddProduct(productId: number, quantity: number) {
    if (!dispatchId) {
      showMessage(
        "warning",
        "Primero debe crear un despacho para poder seleccionar un producto",
      );
      return;
    }

    if (processingDispatch) return;

    const product = products.find((p) => p.productoId === productId);
    if (!product) return;

    if (quantity <= 0) {
      showMessage("warning", "Ingrese una cantidad valida");
      return;
    }

    if (quantity > product.cantidadInventario) {
      showMessage("warning", "No hay suficiente inventario");
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
              ? { ...item, cantidad: item.cantidad + quantity }
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
    } catch (error) {
      console.log(error);

      if (error instanceof Error) {
        showMessage("error", error.message);
      }
    }
  }

  /**
   * Procesa el despacho completo:
   * - Valida existencia de despacho
   * - Valida carrito no vacío
   * - Envía a backend para procesamiento
   * - Limpia estado local tras éxito
   */
  async function handleProcessDispatch() {
    if (!dispatchId) {
      showMessage("error", "No existe despacho");
      return;
    }

    if (cart.length === 0) {
      showMessage("error", "Debe agregar más productos");
      return;
    }

    if (!userId) {
      showMessage("error", "Usuario no autenticado");
      return;
    }

    if (processingDispatch) return;

    try {
      setProcessingDispatch(true);

      const response = await processDispatch({
        despachoId: dispatchId,
        usuarioId: userId,
      });

      showMessage("success", response.mensaje);

      // Recarga inventario real desde backend
      await loadInitialData();

      // Limpia estado del flujo
      setCart([]);
      setSelectedClient(null);
      setDispatchId(null);
      setDispatchCreated(false);
    } catch (error) {
      console.log(error);

      if (error instanceof Error) {
        showMessage("error", error.message);
      }
    } finally {
      setProcessingDispatch(false);
    }
  }

  /**
   * Loading inicial
   */
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-slate-500">Cargando productos...</p>
      </div>
    );
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

      {/* Selector de cliente */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <ClientSelector
          clients={clients}
          selectedClient={selectedClient}
          onChange={setSelectedClient}
          onCreate={handleCreateDispatch}
        />
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Productos */}
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

        {/* Carrito */}
        <DispatchCart cart={cart} onProcess={handleProcessDispatch} />
      </div>

      {/* Modal de feedback */}
      <FeedbackModal
        isOpen={modal.open}
        type={modal.type}
        message={modal.message}
        onClose={() => setModal((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
