import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { Product } from "../../data/product";

import {
  
  getProductById,
  createProduct,
  updateProduct,
} from "../../services/ProductService";

import {
  validateProductForm,
  type ProductFormErrors,
} from "./validations/ProductValidation";

import FeedbackModal from "../../shared/FeedbackModal";
import BackButton from "../../shared/BackButton";

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
  console.log("ID recibido:", id);
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

  const [errors, setErrors] = useState<ProductFormErrors>({});

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const [product, setProduct] = useState<Product | null>(null);

  const [modal, setModal] = useState({
    open: false,
    type: "success" as "success" | "error" | "warning",
    message: "",
  });

  function showMessage(
    type: "success" | "error" | "warning",
    message: string
  ) {
    setModal({
      open: true,
      type,
      message,
    });
  }

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

    let newValue: string | number | boolean = value;

    if (type === "checkbox") {
      newValue = (e.target as HTMLInputElement).checked;
    } else if (type === "number") {
      newValue = value === "" ? 0 : Number(value);
    }

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateProductForm({
      codigo: form.codigo,
      nombre: form.nombre,
      detalle: form.detalle,
      stockCritico: form.stockCritico,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setSaving(true);

      if (isEdit && product) {
        await updateProduct({
          ...product,
          nombre: form.nombre.trim(),
          detalle: form.detalle.trim(),
          stockCritico: form.stockCritico,

          productoResourceId: product.productoResourceId,

          bodega: form.bodega.trim(),
          pasillo: form.pasillo.trim(),
          estante: form.estante.trim(),
        });
      } else {
        await createProduct({
          codigo: form.codigo.trim(),
          nombre: form.nombre.trim(),
          detalle: form.detalle.trim(),
          stockCritico: form.stockCritico,
          bodega: form.bodega.trim(),
          pasillo: form.pasillo.trim(),
          estante: form.estante.trim(),
        });
      }

      navigate("/products");
    } catch (error) {
      console.error(error);
      showMessage(
        "error",
        "Error al guardar el producto"
      );
    } finally {
      setSaving(false);
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
     
        <div className="mx-auto w-full max-w-5xl">
        
                <div className="mb-5">
                  <BackButton />
                </div>
        
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

              {!isEdit && (
                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Código
                  </label>

                  <input
                    name="codigo"
                    value={form.codigo}
                    onChange={handleChange}
                    maxLength={50}
                    className={`mt-2 w-full px-4 py-3 rounded-xl border ${errors.codigo
                      ? "border-red-500"
                      : "border-slate-200"
                      } focus:outline-none focus:ring-2 focus:ring-emerald-300`}
                  />

                  <p
                    className={`text-sm mt-1 ${form.codigo.length === 50
                      ? "text-green-600 font-medium"
                      : "text-slate-500"
                      }`}
                  >
                    {form.codigo.length}/50 caracteres
                  </p>

                  {errors.codigo && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.codigo}
                    </p>
                  )}
                </div>
              )}

              <div className={isEdit ? "md:col-span-2" : ""}>
                <label className="text-sm font-medium text-slate-600">
                  Nombre
                </label>

                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  maxLength={100}
                  className={`mt-2 w-full px-4 py-3 rounded-xl border ${errors.nombre
                    ? "border-red-500"
                    : "border-slate-200"
                    } focus:outline-none focus:ring-2 focus:ring-emerald-300`}
                />

                <p
                  className={`text-sm mt-1 ${form.nombre.length === 100
                    ? "text-green-600 font-medium"
                    : "text-slate-500"
                    }`}
                >
                  {form.nombre.length}/100 caracteres
                </p>

                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.nombre}
                  </p>
                )}
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
                min={0}
                onChange={handleChange}
                className={`mt-2 w-full px-4 py-3 rounded-xl border ${errors.stockCritico
                  ? "border-red-500"
                  : "border-slate-200"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-300`}
              />

              {errors.stockCritico && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.stockCritico}
                </p>
              )}
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
            {!isEdit && (
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Detalle
                </label>

                <textarea
                  name="detalle"
                  value={form.detalle}
                  onChange={handleChange}
                  rows={4}
                  maxLength={255}
                  className={`mt-2 w-full px-4 py-3 rounded-xl border ${errors.detalle
                    ? "border-red-500"
                    : "border-slate-200"
                    } focus:outline-none focus:ring-2 focus:ring-emerald-300`}
                />

                <p
                  className={`text-sm mt-1 ${form.detalle.length === 255
                    ? "text-green-600 font-medium"
                    : "text-slate-500"
                    }`}
                >
                  {form.detalle.length}/255 caracteres
                </p>

                {errors.detalle && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.detalle}
                  </p>
                )}
              </div>
            )}

          </div>

          <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-semibold transition"
            >
              {saving
                ? "Guardando..."
                : isEdit
                  ? "Actualizar Producto"
                  : "Guardar Producto"}
            </button>
          </div>
        </form>
      </div>
      <FeedbackModal
        isOpen={modal.open}
        type={modal.type}
        message={modal.message}
        onClose={() =>
          setModal((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />
    </div>
  );
}