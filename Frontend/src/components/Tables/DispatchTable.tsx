import type { DispatchSummary } from "../../data/dispatch/DispatchResponses";
import DispatchStatusBadge from "../forms/DispatchStatusBadge";

interface Props {
  dispatches: DispatchSummary[];
  onViewDetail: (id: number) => void;
}

export default function DispatchTable({ dispatches, onViewDetail }: Props) {
  return (
    <div className="max-h-[550px] overflow-y-auto overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full text-sm">
        {/* Header */}
        <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600 shadow-sm">
          <tr>
            <th className="w-20 px-4 py-3 text-left font-semibold">ID</th>

            <th className="w-36 px-4 py-3 text-left font-semibold">Fecha</th>

            <th className="px-4 py-3 text-left font-semibold">Cliente</th>

            <th className="w-36 px-4 py-3 text-left font-semibold">Estado</th>

            <th className="px-4 py-3 text-left font-semibold">Operario</th>

            <th className="w-32 px-4 py-3 text-left font-semibold">Acción</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-slate-100">
          {dispatches.map((dispatch) => (
            <tr
              key={dispatch.despachoId}
              className="transition hover:bg-slate-50"
            >
              <td className="px-4 py-3 font-medium text-slate-800">
                {dispatch.despachoId}
              </td>

              <td className="px-4 py-3 font-medium text-slate-800">
                {new Date(dispatch.fechaDespacho).toLocaleDateString()}
              </td>

              <td className="max-w-[220px] truncate px-4 py-3 font-medium text-slate-800">
                {dispatch.cliente}
              </td>

              <td className="px-4 py-3">
                <DispatchStatusBadge status={dispatch.estado} />
              </td>

              <td className="max-w-[220px] truncate px-4 py-3 font-medium text-slate-800">
                {dispatch.operario}
              </td>

              <td className="px-4 py-3">
                {dispatch.estado === "PROCESADO" ? (
                  <button
                    onClick={() => onViewDetail(dispatch.despachoId)}
                    className="rounded-lg bg-cyan-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-cyan-700"
                  >
                    Ver detalle
                  </button>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
