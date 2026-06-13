
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { Product } from "../../data/product";
import { getProducts } from "../../services/ProductService";

type ProductFormData = {
  codigo: string;
  nombre: string;
  detalle: string;
  stockCritico: number;
  cantidadInventario: number;
  activo: boolean;
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
  });

  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    async function load() {
      if (!id) return;

      try {
        const products: Product[] = await getProducts();

        const found = products.find(
          (p) =>
            p.productoId === Number(id) ||
            p.productoResourceId === id
        );

        if (!found) {
          navigate("/products");
          return;
        }

        setForm({
          codigo: found.codigo,
          nombre: found.nombre,
          detalle: found.detalle ?? "",
          stockCritico: found.stockCritico,
          cantidadInventario: found.cantidadInventario,
          activo: found.activo,
        });
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit) {
      console.log("EDITAR PRODUCTO:", id, form);
    } else {
      console.log("CREAR PRODUCTO:", form);
    }

    navigate("/products");
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
              Administre la información del producto dentro del inventario.
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
                  className="mt-2
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    focus:ring-2
                    focus:ring-emerald-200
                    focus:border-emerald-400
                    focus:outline-none"
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
                  className="
                    mt-2
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    focus:ring-2
                    focus:ring-emerald-200
                    focus:border-emerald-400
                    focus:outline-none"
                />
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-700 mb-4">
                Información de Inventario
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Stock crítico
                  </label>

                  <input
                    type="number"
                    name="stockCritico"
                    value={form.stockCritico}
                    onChange={handleChange}
                    className="
                      mt-2
                      w-full
                      px-4
                      py-3
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      focus:ring-2
                      focus:ring-emerald-200
                      focus:border-emerald-400
                      focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Cantidad inventario
                  </label>

                  <input
                    type="number"
                    name="cantidadInventario"
                    value={form.cantidadInventario}
                    onChange={handleChange}
                    className="
                      mt-2
                      w-full
                      px-4
                      py-3
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      focus:ring-2
                      focus:ring-emerald-200
                      focus:border-emerald-400
                      focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
              <label className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-700">
                    Producto activo
                  </p>

                </div>

                <input
                  type="checkbox"
                  name="activo"
                  checked={form.activo}
                  onChange={handleChange}
                  className="h-5 w-5 accent-emerald-600 cursor-pointer"
                />
              </label>
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
                className="
                  mt-2
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  focus:ring-2
                  focus:ring-emerald-200
                  focus:border-emerald-400
                  focus:outline-none"
              />
            </div>
          </div>

          <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="px-6 py-3 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="
                px-6
                py-3
                rounded-xl
                bg-emerald-500
                hover:bg-emerald-600
                text-white
                font-semibold
                transition"
            >
              {isEdit ? "Actualizar Producto" : "Guardar Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

