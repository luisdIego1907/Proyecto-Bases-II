import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { InventarioData } from "../../data/Stock";
import type { CarritoDespachoResponse } from "../../data/dispatch/CartItem";

import { getInventory } from "../../services/ProductService";
import {
  getDispatchCart,
  addCartItem,
  processDispatch,
} from "../../services/DispatchService";

import { getUserId } from "../../auth/sessionAuth";
import FeedbackModal from "../../shared/FeedbackModal";
import AvailableProductsTable from "../Tables/AvailableProductTable";

export default function DispatchEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const dispatchId = id ? Number(id) : NaN;
  const isValidId = !Number.isNaN(dispatchId) && dispatchId > 0;

  const [items, setItems] = useState<CarritoDespachoResponse[]>([]);
  const [products, setProducts] = useState<InventarioData[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modal, setModal] = useState({
    open: false,
    type: "success" as "success" | "error" | "warning",
    message: "",
  });

  function showMessage(type: "success" | "error" | "warning", message: string) {
    setModal({ open: true, type, message });
  }

  useEffect(() => {
    if (!isValidId) navigate("/dispatch");
  }, [isValidId, navigate]);

  useEffect(() => {
    if (!isValidId) return;

    async function load() {
      try {
        const [carrito, inventario] = await Promise.all([
          getDispatchCart(dispatchId),
          getInventory(),
        ]);

        setItems(carrito);
        setProducts(inventario.filter((p) => p.cantidadInventario > 0));
      } catch (error) {
        console.error(error);
        navigate("/dispatch");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [dispatchId, isValidId, navigate]);

  async function reloadCart() {
    const updated = await getDispatchCart(dispatchId);
    setItems(updated);
  }

  async function handleAddProduct(productId: number, quantity: number) {
    if (!isValidId) return;

    const product = products.find((p) => p.productoId === productId);
    if (!product) return;

    if (quantity <= 0) {
      showMessage("warning", "Cantidad inválida");
      return;
    }

    if (quantity > product.cantidadInventario) {
      showMessage(
        "warning",
        `Stock insuficiente (${product.cantidadInventario})`,
      );
      return;
    }

    try {
      setSaving(true);

      await addCartItem({
        despachoId: dispatchId,
        productoId: productId,
        cantidadSolicitada: quantity,
      });

      await reloadCart();

      showMessage("success", "Producto agregado");
    } catch (error) {
      console.error(error);
      showMessage("error", "No se pudo agregar el producto");
    } finally {
      setSaving(false);
    }
  }

  async function handleProcess() {
    const userId = getUserId();

    if (!userId) {
      showMessage("error", "Sesión inválida");
      return;
    }

    if (items.length === 0) {
      showMessage("warning", "El despacho está vacío");
      return;
    }

    try {
      setSaving(true);

      const response = await processDispatch({
        despachoId: dispatchId,
        usuarioId: userId,
      });

      showMessage("success", response.mensaje);

      setTimeout(() => navigate("/dispatch"), 800);
    } catch (error) {
      console.error(error);
      showMessage("error", "Error al procesar despacho");
    } finally {
      setSaving(false);
    }
  }

  if (!isValidId || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Editar Despacho</h1>
        <p className="mt-1 text-slate-500">
          Agrega productos desde el inventario al despacho
        </p>
      </div>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* INVENTARIO */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Inventario disponible
          </h2>

          <AvailableProductsTable
            products={products}
            onAddProduct={handleAddProduct}
          />
        </div>

        {/* CARRITO MEJORADO */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Carrito del despacho
          </h2>

          {items.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-slate-500 text-sm">
                No hay productos agregados todavía
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.carritoId}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 hover:bg-slate-100 transition"
                >
                  {/* INFO */}
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-800">
                      {item.nombre}
                    </span>
                    <span className="text-xs text-slate-500">
                      Producto en despacho
                    </span>
                  </div>

                  {/* CANTIDAD */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Cant.</span>
                    <span className="px-3 py-1 rounded-lg bg-cyan-50 text-cyan-700 font-semibold min-w-[40px] text-center">
                      {item.cantidadSolicitada}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FOOTER */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={handleProcess}
              disabled={items.length === 0 || saving}
              className="w-full px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600
              text-white font-semibold disabled:bg-emerald-300 transition"
            >
              {saving ? "Procesando..." : "Procesar despacho"}
            </button>

            <p className="text-xs text-slate-400 text-center mt-2">
              El despacho solo puede procesarse con productos agregados
            </p>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <FeedbackModal
        isOpen={modal.open}
        type={modal.type}
        message={modal.message}
        onClose={() => setModal((p) => ({ ...p, open: false }))}
      />
    </div>
  );
}
