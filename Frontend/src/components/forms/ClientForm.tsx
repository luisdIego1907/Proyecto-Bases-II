import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ClientListItem } from "../../data/client";
import { getClientes } from "../../services/ClientService";

type ClientFormData = {
  nombre: string;
  rol_cliente: "ORIGEN" | "DESTINO" | "AMBOS";
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
    rol_cliente: "ORIGEN",
    telefono: "",
    correo: "",
    direccion: "",
    activo: true,
  });

  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    async function load() {
      if (!id) return;

      const clients: ClientListItem[] = await getClientes();
      const found = clients.find((c) => c.clienteResourceId === id);

      if (!found) {
        navigate("/clients");
        return;
      }

      setForm({
        nombre: found.nombre,
        rol_cliente: found.rol_cliente,
        telefono: found.telefono ?? "",
        correo: found.correo ?? "",
        direccion: found.direccion ?? "",
        activo: found.activo,
      });

      setLoading(false);
    }

    void load();
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(isEdit ? "EDITAR CLIENTE" : "CREAR CLIENTE", form);

    navigate("/clients");
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
              className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200
                         focus:outline-none focus:ring-2 focus:ring-cyan-300 transition"
              placeholder="Ej: Empresa ABC"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600">
              Tipo de cliente
            </label>
            <select
              name="rol_cliente"
              value={form.rol_cliente}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200
                         focus:outline-none focus:ring-2 focus:ring-cyan-300"
            >
              <option value="ORIGEN">ORIGEN</option>
              <option value="DESTINO">DESTINO</option>
              <option value="AMBOS">AMBOS</option>
            </select>
          </div>

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

          <div>
            <label className="text-sm font-semibold text-slate-600">
              Teléfono
            </label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200
                         focus:outline-none focus:ring-2 focus:ring-cyan-300"
              placeholder="8888-8888"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600">
              Correo
            </label>
            <input
              name="correo"
              value={form.correo}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200
                         focus:outline-none focus:ring-2 focus:ring-cyan-300"
              placeholder="correo@empresa.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-600">
              Dirección
            </label>
            <input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200
                         focus:outline-none focus:ring-2 focus:ring-cyan-300"
              placeholder="Dirección completa"
            />
          </div>
        </div>

        <div className="px-10 py-6 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate("/clients")}
            className="px-6 py-3 rounded-xl border border-slate-300
                       text-slate-600 hover:bg-slate-100 transition"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700
                       text-white font-semibold shadow-sm transition"
          >
            {isEdit ? "Actualizar cliente" : "Crear cliente"}
          </button>
        </div>
      </form>
    </div>
  );
}