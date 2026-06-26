import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { Product } from "../../data/product";
import type { ClientListItem } from "../../data/client";

import { getProductById } from "../../services/ProductService";
import { getClientes } from "../../services/ClientService";
import { registrarRecepcion } from "../../services/ReceptionService";

export default function ReceptionForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [clientes, setClientes] =useState<ClientListItem[]>([]);

  const [clienteId, setClienteId] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [lote, setLote] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [producto, listaClientes] = await Promise.all([
          getProductById(Number(id)),
          getClientes(),
        ]);

        setProduct(producto);

        setClientes(
          listaClientes.filter(
            (c) =>
              c.activo &&
              (c.rolCliente === "ORIGEN" ||
                c.rolCliente === "AMBOS")
          )
        );
      } catch (error) {
        console.error(error);
        navigate("/products");
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [id, navigate]);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!product) return;

    try {
      await registrarRecepcion({
        productoId: product.productoId,
        clienteId: Number(clienteId),
        cantidad,
        numeroLote: lote,
        usuarioId: 1, // Login simulado
      });

      alert("Recepción registrada correctamente");

      navigate("/products");
    } catch (error) {
      console.error(error);
      alert("Error al registrar la recepción.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Producto no encontrado
      </div>
    );
  }
    return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-6 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
      >
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-7">
          <h2 className="text-3xl font-bold text-white">
            Recepción de Mercancía
          </h2>

          <p className="text-emerald-100 text-sm mt-1">
            Registrar ingreso de producto al almacén
          </p>
        </div>

        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-7">
          <div className="md:col-span-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
            <h3 className="font-semibold text-emerald-700 mb-3">
              Información del producto
            </h3>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-slate-600">
                  Código:
                </span>{" "}
                {product.codigo}
              </div>

              <div>
                <span className="font-semibold text-slate-600">
                  Nombre:
                </span>{" "}
                {product.nombre}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-600">
              Cliente
            </label>

            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200
                         focus:outline-none focus:ring-2 focus:ring-emerald-300"
              required
            >
              <option value="">
                Seleccione un cliente
              </option>

              {clientes.map((cliente) => (
                <option
                  key={cliente.clienteResourceId}
                  value={cliente.clienteId}
                >
                  {cliente.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600">
              Número de lote
            </label>

            <input
              value={lote}
              onChange={(e) => setLote(e.target.value)}
              className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200
                         focus:outline-none focus:ring-2 focus:ring-emerald-300"
              placeholder="Ej: LOT-2026-001"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600">
              Cantidad recibida
            </label>

            <input
              type="number"
              min={1}
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200
                         focus:outline-none focus:ring-2 focus:ring-emerald-300"
              required
            />
          </div>
        </div>

        <div className="px-10 py-6 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="px-6 py-3 rounded-xl border border-slate-300
                       text-slate-600 hover:bg-slate-100 transition"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-700
                       text-white font-semibold shadow-sm transition"
          >
            Registrar recepción
          </button>
        </div>
      </form>
    </div>
  );
}