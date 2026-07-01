import {
  Package,
  Warehouse,
  Boxes,
  MapPinned,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import type { Product } from "../../data/product";

import { getProductById } from "../../services/ProductService";

import BackButton from "../../shared/BackButton";

export default function ProductProfile() {
  const { id } = useParams();

  const [product, setProduct] = useState<Product>();

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const found = await getProductById(Number(id));

        setProduct(found);
      } catch (err) {
        console.error("Error cargando producto:", err);

        setError(
          "No se pudo cargar la información del producto."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />

        <h2 className="mt-6 text-xl font-semibold text-slate-700">
          Cargando producto...
        </h2>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center py-24">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-xl font-semibold text-red-700">
            {error}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-6">

      <div className="mx-auto max-w-6xl">

        <div className="mb-5">
          <BackButton />
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-10 py-10">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-center gap-6">

                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/15 shadow-xl backdrop-blur">

                  <Package
                    size={52}
                    strokeWidth={2.2}
                    className="text-white"
                  />

                </div>

                <div>

                  <p className="text-sm font-medium uppercase tracking-widest text-green-100">
                    Producto
                  </p>

                  <h1 className="mt-1 text-4xl font-bold text-white">
                    {product.nombre}
                  </h1>

                  <p className="mt-2 text-green-100">
                    Código:
                    <span className="ml-2 font-semibold">
                      {product.codigo}
                    </span>
                  </p>

                </div>

              </div>

              <div className="flex flex-col items-start gap-2 lg:items-end">

                <p className="text-sm font-medium text-green-100">
                  Estado del producto
                </p>

                {product.activo ? (
                  <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    Activo
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                    Inactivo
                  </span>
                )}

              </div>

            </div>

          </div>

          <div className="grid gap-8 p-10 lg:grid-cols-2">

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

              <div className="mb-6 flex items-center gap-3">

                <div className="rounded-xl bg-emerald-100 p-3">
                  <Package
                    className="text-emerald-700"
                    size={22}
                  />
                </div>

                <h2 className="text-xl font-bold text-slate-800">
                  Información General
                </h2>

              </div>

              <div className="space-y-6">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Nombre
                  </p>

                  <p className="mt-1 text-lg font-semibold text-slate-800">
                    {product.nombre}
                  </p>

                </div>

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Código
                  </p>

                  <p className="mt-1 text-slate-700">
                    {product.codigo}
                  </p>

                </div>

              </div>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

              <div className="mb-6 flex items-center gap-3">

                <div className="rounded-xl bg-emerald-100 p-3">
                  <Boxes
                    className="text-emerald-700"
                    size={22}
                  />
                </div>

                <h2 className="text-xl font-bold text-slate-800">
                  Información del producto
                </h2>

              </div>

              <div className="space-y-6">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Stock crítico
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-orange-600">
                    {product.stockCritico}
                  </p>

                </div>

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Detalle
                  </p>

                  <p className="mt-1 text-slate-700">
                    {product.detalle || "-"}
                  </p>

                </div>

              </div>

            </div>

                        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

              <div className="mb-6 flex items-center gap-3">

                <div className="rounded-xl bg-emerald-100 p-3">
                  <Warehouse
                    className="text-emerald-700"
                    size={22}
                  />
                </div>

                <h2 className="text-xl font-bold text-slate-800">
                  Ubicación en el almacén
                </h2>

              </div>

              <div className="grid gap-6 md:grid-cols-3">

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

                  <div className="mb-3 flex items-center gap-2">

                    <Warehouse
                      size={18}
                      className="text-emerald-600"
                    />

                    <span className="text-sm font-semibold text-slate-500">
                      Bodega
                    </span>

                  </div>

                  <p className="text-xl font-bold text-slate-800">
                    {product.bodega}
                  </p>

                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

                  <div className="mb-3 flex items-center gap-2">

                    <MapPinned
                      size={18}
                      className="text-emerald-600"
                    />

                    <span className="text-sm font-semibold text-slate-500">
                      Pasillo
                    </span>

                  </div>

                  <p className="text-xl font-bold text-slate-800">
                    {product.pasillo}
                  </p>

                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

                  <div className="mb-3 flex items-center gap-2">

                    <Boxes
                      size={18}
                      className="text-emerald-600"
                    />

                    <span className="text-sm font-semibold text-slate-500">
                      Estante
                    </span>

                  </div>

                  <p className="text-xl font-bold text-slate-800">
                    {product.estante}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}