import type { ClientListItem } from "../../data/client";

interface Props {
  clients: ClientListItem[];
  selectedClients: string[];
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function ClientTable({
  clients,
  selectedClients,
  onSelect,
  onEdit,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-6 py-4 text-left font-semibold">Nombre</th>
            <th className="px-6 py-4 text-left font-semibold">Rol</th>
            <th className="px-6 py-4 text-left font-semibold">Teléfono</th>
            <th className="px-6 py-4 text-left font-semibold">Estado</th>
            <th className="px-6 py-4 text-center font-semibold">Seleccionar</th>
            <th className="px-6 py-4 text-center font-semibold">Acciones</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {clients.map((c) => {
            const isSelected = selectedClients.includes(c.clienteResourceId);

            return (
              <tr
                key={c.clienteResourceId}
                className="hover:bg-slate-50 transition"
              >
                <td className="px-6 py-4 font-medium text-slate-800">
                  {c.nombre}
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    {c.rol_cliente}
                  </span>
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {c.telefono ?? "-"}
                </td>

                <td className="px-6 py-4">
                  {c.activo ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                      Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
                      Inactivo
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect(c.clienteResourceId)}
                    className="h-4 w-4 accent-cyan-600 cursor-pointer"
                  />
                </td>

                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onEdit(c.clienteResourceId)}
                    className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium text-cyan-600 hover:bg-cyan-50 transition"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
