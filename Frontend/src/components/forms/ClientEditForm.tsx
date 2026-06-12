import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ClientListItem } from "../../data/client";
import { getClientes } from "../../services/ClientService";

type ClientFormData = {
  clienteResourceId: string;
  nombre: string;
  rol_cliente: "ORIGEN" | "DESTINO" | "AMBOS";
  telefono?: string;
  activo: boolean;
};

export default function ClientEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<ClientFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClient() {
      const clients: ClientListItem[] = await getClientes();

      const found = clients.find((c) => c.clienteResourceId === id);

      if (!found) {
        navigate("/clients");
        return;
      }

      setForm({
        clienteResourceId: found.clienteResourceId,
        nombre: found.nombre,
        rol_cliente: found.rol_cliente,
        telefono: found.telefono,
        activo: found.activo,
      });

      setLoading(false);
    }

    loadClient();
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!form) return;

    const { name, value, type } = e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("CLIENTE EDITADO:", form);

    navigate("/clients");
  };

  if (loading || !form) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Cargando cliente...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">Editar Cliente</h2>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-600">Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Rol Cliente
            </label>
            <select
              name="rol_cliente"
              value={form.rol_cliente}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
            >
              <option value="ORIGEN">ORIGEN</option>
              <option value="DESTINO">DESTINO</option>
              <option value="AMBOS">AMBOS</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Teléfono
            </label>
            <input
              name="telefono"
              value={form.telefono ?? ""}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="activo"
              checked={form.activo}
              onChange={handleChange}
              className="w-4 h-4 accent-orange-500"
            />
            <label className="text-slate-600">Activo</label>
          </div>
        </div>

        <div className="px-8 py-6 bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/clients")}
            className="px-6 py-3 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-orange-500 text-white"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}