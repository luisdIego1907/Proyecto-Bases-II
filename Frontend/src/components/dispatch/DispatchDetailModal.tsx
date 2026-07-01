import type { DispatchDetail } from "../../data/dispatch/DispatchDetailResponse";

interface Props {
  details: DispatchDetail[];
  isOpen: boolean;
  onClose: () => void;
}

export default function DispatchDetailModal({
  details,
  isOpen,
  onClose,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Detalle del despacho
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Productos incluidos en la salida
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Código</th>

                  <th className="px-6 py-4 text-left font-semibold">
                    Producto
                  </th>

                  <th className="px-6 py-4 text-left font-semibold">
                    Cantidad
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {details.map((item) => (
                  <tr
                    key={item.codigo}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {item.codigo}
                    </td>

                    <td className="px-6 py-4 text-slate-700">
                      {item.producto}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-cyan-100 px-3 py-1 text-sm font-medium text-cyan-700">
                        {item.cantidadDespachada}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-200 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-200 px-5 py-2 font-medium text-slate-700 transition hover:bg-slate-300"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
