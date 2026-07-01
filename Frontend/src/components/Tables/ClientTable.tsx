import { Eye, Pencil } from "lucide-react";
import type { ClientListItem } from "../../data/client";

interface Props {
  clients: ClientListItem[];
  selectedClients: string[];

  canDelete: boolean;
  canUpdate: boolean;

  onSelect: (id: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function ClientTable({
  clients,
  selectedClients,
  canDelete,
  canUpdate,
  onSelect,
  onView,
  onEdit,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="max-h-[70vh] overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">
                Nombre
              </th>

              <th className="px-6 py-4 text-left font-semibold">
                Rol
              </th>

              <th className="px-6 py-4 text-left font-semibold">
                Teléfono
              </th>

              <th className="px-6 py-4 text-left font-semibold">
                Estado
              </th>

              {canDelete && (
                <th className="px-6 py-4 text-center font-semibold">
                  Seleccionar
                </th>
              )}

              <th className="px-6 py-4 text-center font-semibold">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {clients.map((c) => {
              const isSelected = selectedClients.includes(
                c.clienteResourceId
              );

              return (
                <tr
                  key={c.clienteResourceId}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {c.nombre}
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {c.rolCliente}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {c.telefono ?? "-"}
                  </td>

                  <td className="px-6 py-4">
                    {c.activo ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                        Inactivo
                      </span>
                    )}
                  </td>

                  {canDelete && (
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          onSelect(c.clienteResourceId)
                        }
                        className="h-4 w-4 cursor-pointer accent-cyan-600"
                      />
                    </td>
                  )}

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="group relative">
                        <button
                          type="button"
                          onClick={() =>
                            onView(c.clienteResourceId)
                          }
                          className="rounded-lg p-2 text-cyan-600 transition hover:bg-cyan-50 hover:text-cyan-700"
                        >
                          <Eye size={18} />
                        </button>

                        <span className="pointer-events-none absolute -top-11 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100">
                          Ver perfil
                          <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-slate-800" />
                        </span>
                      </div>

                      {canUpdate && (
                        <div className="group relative">
                          <button
                            type="button"
                            onClick={() =>
                              onEdit(c.clienteResourceId)
                            }
                            className="rounded-lg p-2 text-emerald-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            <Pencil size={18} />
                          </button>

                          <span className="pointer-events-none absolute -top-11 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100">
                            Editar cliente
                            <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-slate-800" />
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}