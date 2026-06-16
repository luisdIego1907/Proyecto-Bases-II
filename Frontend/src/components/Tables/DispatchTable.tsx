import type { DispatchSummary } from "../../data/dispatch/DispatchResponses";
import DispatchStatusBadge from "../forms/DispatchStatusBadge";

interface Props {
  dispatches: DispatchSummary[];
  onViewDetail: (id: number) => void;
}

export default function DispatchTable({ dispatches, onViewDetail }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-6 py-4 text-left font-semibold">ID</th>

            <th className="px-6 py-4 text-left font-semibold">Fecha</th>

            <th className="px-6 py-4 text-left font-semibold">Cliente</th>

            <th className="px-6 py-4 text-left font-semibold">Estado</th>

            <th className="px-6 py-4 text-left font-semibold">Operario</th>

            <th className="px-6 py-4 text-left font-semibold">Acción</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {dispatches.map((dispatch) => (
            <tr
              key={dispatch.despachoId}
              className="transition hover:bg-slate-50"
            >
              <td className="px-6 py-4 font-medium text-slate-800">
                {dispatch.despachoId}
              </td>

              <td className="px-6 py-4 font-medium text-slate-800">
                {new Date(dispatch.fechaDespacho).toLocaleDateString()}
              </td>

              <td className="px-6 py-4 font-medium text-slate-800">
                {dispatch.cliente}
              </td>

              <td className="px-6 py-4">
                <DispatchStatusBadge status={dispatch.estado} />
              </td>

              <td className="px-6 py-4 font-medium text-slate-800">
                {dispatch.operario}
              </td>

              <td className="px-6 py-4">
                {dispatch.estado === "PROCESADO" ? (
                  <button
                    className="rounded-lg bg-cyan-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-cyan-700"
                    onClick={() => onViewDetail(dispatch.despachoId)}
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
