import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getClientes,
  updateCliente,
  createCliente,
} from "../../services/ClientService";

import {
  validateClientForm,
  type ClientFormErrors,
} from "./validations/ClientValidation";

type ClientFormData = {
  nombre: string;
  rolCliente: "ORIGEN" | "DESTINO" | "AMBOS";
  telefono: string;
  correo: string;
  direccion: string;
  activo: boolean;
};

export default function ClientForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const [form, setForm] = useState<ClientFormData>({
    nombre: "",
    rolCliente: "ORIGEN",
    telefono: "",
    correo: "",
    direccion: "",
    activo: true,
  });

  const [errors, setErrors] = useState<ClientFormErrors>({});

  const [loading, setLoading] = useState(isEdit);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");

    if (numbers.length <= 4) {
      return numbers;
    }

    return `${numbers.slice(0, 4)}-${numbers.slice(4, 8)}`;
  };

  useEffect(() => {
    async function load() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const clientes = await getClientes();

        const found = clientes.find(
          (c) => c.clienteResourceId === id
        );

        if (!found) {
          navigate("/clients");
          return;
        }

        setForm({
          nombre: found.nombre,
          rolCliente: found.rolCliente,
          telefono: found.telefono ?? "",
          correo: found.correo ?? "",
          direccion: found.direccion ?? "",
          activo: found.activo,
        });
      } catch (error) {
        console.error("Error cargando cliente:", error);
        navigate("/clients");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));

      return;
    }

    if (name === "telefono") {
      const onlyNumbers = value.replace(/\D/g, "").slice(0, 8);

      setForm((prev) => ({
        ...prev,
        telefono: onlyNumbers,
      }));

      setErrors((prev) => ({
        ...prev,
        telefono: undefined,
      }));

      return;
    }

    let newValue = value;

    switch (name) {
      case "nombre":
        newValue = value.slice(0, 150);
        break;

      case "correo":
        newValue = value.slice(0, 120);
        break;

      case "direccion":
        newValue = value.slice(0, 250);
        break;
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

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const validationErrors = validateClientForm({
      nombre: form.nombre,
      telefono: form.telefono,
      correo: form.correo,
      direccion: form.direccion,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      if (isEdit && id) {
        await updateCliente(id, form);
      } else {
        await createCliente(form);
      }

      navigate("/clients");
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al guardar el cliente.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent" />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-6 py-10">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
      >

        <div className="bg-gradient-to-r from-cyan-600 to-cyan-500 px-10 py-8">
          <h2 className="text-3xl font-bold text-white">
            {isEdit ? "Editar Cliente" : "Nuevo Cliente"}
          </h2>

          <p className="text-cyan-100 text-sm mt-1">
            Complete la información del cliente
          </p>
        </div>

        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-7">

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-600">
              Nombre completo
            </label>

            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              maxLength={150}
              placeholder="Ej: Empresa ABC"
              className={`mt-2 w-full px-4 py-3 rounded-xl border transition
                ${errors.nombre
                  ? "border-red-400 focus:ring-2 focus:ring-red-200"
                  : "border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                }`}
            />

             <p
              className={`text-sm mt-1 ${form.nombre.length === 150
                  ? "text-green-600 font-medium"
                  : "text-slate-500"
                }`}
            >
              {form.nombre.length}/150 caracteres
            </p>

            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nombre}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600">
              Tipo de cliente
            </label>

            <select
              name="rolCliente"
              value={form.rolCliente}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            >
              <option value="ORIGEN">ORIGEN</option>
              <option value="DESTINO">DESTINO</option>
              <option value="AMBOS">AMBOS</option>
            </select>
          </div>

          {isEdit && (
            <div className="flex items-end">
              <label className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50">

                <span className="text-sm font-semibold text-slate-600">
                  Cliente activo
                </span>

                <input
                  type="checkbox"
                  name="activo"
                  checked={form.activo}
                  onChange={handleChange}
                  className="h-5 w-5 accent-cyan-600 cursor-pointer"
                />

              </label>
            </div>
          )}

          <div>
            <label className="text-sm font-semibold text-slate-600">
              Teléfono
            </label>

            <input
              name="telefono"
              type="text"
              value={formatPhone(form.telefono)}
              onChange={handleChange}
              maxLength={9}
              placeholder="8888-8888"
              className={`mt-2 w-full px-4 py-3 rounded-xl border transition
                ${errors.telefono
                  ? "border-red-400 focus:ring-2 focus:ring-red-200"
                  : "border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                }`}
            />

            <p
              className={`text-sm mt-1 ${form.telefono.length === 8
                  ? "text-green-600 font-medium"
                  : "text-slate-500"
                }`}
            >
              {form.telefono.length}/8 dígitos
            </p>

            {errors.telefono && (
              <p className="text-red-500 text-sm mt-1">
                {errors.telefono}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600">
              Correo
            </label>

            <input
              name="correo"
              type="email"
              value={form.correo}
              onChange={handleChange}
              maxLength={120}
              placeholder="correo@empresa.com"
              className={`mt-2 w-full px-4 py-3 rounded-xl border transition
                ${errors.correo
                  ? "border-red-400 focus:ring-2 focus:ring-red-200"
                  : "border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                }`}
            />

            {errors.correo && (
              <p className="text-red-500 text-sm mt-1">
                {errors.correo}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-600">
              Dirección
            </label>

            <input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              maxLength={250}
              placeholder="Dirección completa"
              className={`mt-2 w-full px-4 py-3 rounded-xl border transition
                ${errors.direccion
                  ? "border-red-400 focus:ring-2 focus:ring-red-200"
                  : "border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                }`}
            />

            <p className="text-slate-500 text-sm mt-1">
              {form.direccion.length}/250 caracteres
            </p>

            {errors.direccion && (
              <p className="text-red-500 text-sm mt-1">
                {errors.direccion}
              </p>
            )}
          </div>

        </div>

        <div className="px-10 py-6 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">

          <button
            type="button"
            onClick={() => navigate("/clients")}
            className="px-6 py-3 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold shadow-sm transition"
          >
            {isEdit
              ? "Actualizar cliente"
              : "Crear cliente"}
          </button>

        </div>

      </form>

    </div>
  );
}