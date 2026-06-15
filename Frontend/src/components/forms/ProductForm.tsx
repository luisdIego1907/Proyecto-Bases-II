import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { Product } from "../../data/product";

import {
  getProductById,
  createProduct,
  updateProduct,
} from "../../services/ProductService";

type ProductFormData = {
  codigo: string;
  nombre: string;
  detalle: string;
  stockCritico: number;
  cantidadInventario: number;
  activo: boolean;

  bodega: string;
  pasillo: string;
  estante: string;
};

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const [form, setForm] = useState<ProductFormData>({
    codigo: "",
    nombre: "",
    detalle: "",
    stockCritico: 0,
    cantidadInventario: 0,
    activo: true,

    bodega: "",
    pasillo: "",
    estante: "",
  });

  const [loading, setLoading] = useState(isEdit);

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function load() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const found = await getProductById(Number(id));

        setProduct(found);

        setForm({
          codigo: found.codigo,
          nombre: found.nombre,
          detalle: found.detalle ?? "",
          stockCritico: found.stockCritico,
          cantidadInventario: found.cantidadInventario,
          activo: found.activo,

          bodega: found.bodega ?? "",
          pasillo: found.pasillo ?? "",
          estante: found.estante ?? "",
        });
      } catch (error) {
        console.error(error);
        navigate("/products");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && product) {
        await updateProduct({
          ...product,
          nombre: form.nombre,
          stockCritico: form.stockCritico,
        });
      } else {
        await createProduct({
          codigo: form.codigo,
          nombre: form.nombre,
          detalle: form.detalle,
          stockCritico: form.stockCritico,
          bodega: form.bodega,
          pasillo: form.pasillo,
          estante: form.estante,
        });
      }

      navigate("/products");
    } catch (error) {
      console.error(error);
      alert("Error al guardar el producto.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-7">
            <h2 className="text-3xl font-bold text-white">
              {isEdit ? "Editar Producto" : "Registro de Producto"}
            </h2>

            <p className="text-emerald-50 mt-2">
              Complete la información del producto
            </p>
          </div>

          <div className="p-8 space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Código
                </label>
                <input
                  name="codigo"
                  value={form.codigo}
                  onChange={handleChange}
                  disabled={isEdit}
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">
                  Nombre
                </label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
              <label className="text-sm font-medium text-slate-600">
                Stock crítico
              </label>

              <input
                type="number"
                name="stockCritico"
                value={form.stockCritico}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
              />
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-700 mb-4">
                Ubicación en almacén
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input
                  name="bodega"
                  value={form.bodega}
                  onChange={handleChange}
                  placeholder="Bodega"
                  className="px-4 py-3 rounded-xl border border-slate-200"
                />

                <input
                  name="pasillo"
                  value={form.pasillo}
                  onChange={handleChange}
                  placeholder="Pasillo"
                  className="px-4 py-3 rounded-xl border border-slate-200"
                />

                <input
                  name="estante"
                  value={form.estante}
                  onChange={handleChange}
                  placeholder="Estante"
                  className="px-4 py-3 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">
                Detalle
              </label>

              <textarea
                name="detalle"
                value={form.detalle}
                onChange={handleChange}
                rows={4}
                className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="px-6 py-3 rounded-xl border border-slate-300"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold"
            >
              {isEdit ? "Actualizar Producto" : "Guardar Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}