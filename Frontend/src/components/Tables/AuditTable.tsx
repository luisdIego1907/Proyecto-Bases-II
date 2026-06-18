import type { ProductAudit } from "../../data/audit/ProductAudit";

interface Props {
  audits: ProductAudit[];
}

export default function AuditTable({ audits }: Props) {
  function getRowStyle(tipoMovimiento: string) {
    switch (tipoMovimiento) {
      case "INCREMENTO":
        return "bg-green-50 hover:bg-green-100";

      case "REDUCCION":
        return "bg-red-50 hover:bg-red-100";

      default:
        return "hover:bg-slate-50";
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Auditoría de Inventario
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Historial de cambios realizados sobre el inventario del producto
        </p>
      </div>

      {/* Tabla */}
      <div className="max-h-[500px] overflow-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-slate-50 text-slate-600">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Fecha</th>

              <th className="px-6 py-4 text-left font-semibold">
                Cantidad Anterior
              </th>

              <th className="px-6 py-4 text-left font-semibold">
                Cantidad Nueva
              </th>

              <th className="px-6 py-4 text-left font-semibold">Movimiento</th>

              <th className="px-6 py-4 text-left font-semibold">Usuario</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {audits.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-slate-400"
                >
                  No hay registros de auditoría
                </td>
              </tr>
            ) : (
              audits.map((audit, index) => (
                <tr
                  key={index}
                  className={`transition ${getRowStyle(audit.tipoMovimiento)}`}
                >
                  <td className="px-6 py-4">
                    {new Date(audit.fechaCambio).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">{audit.cantidadAnterior}</td>

                  <td className="px-6 py-4">{audit.cantidadNueva}</td>

                  <td className="px-6 py-4 font-medium">
                    {audit.tipoMovimiento}
                  </td>

                  <td className="px-6 py-4">{audit.usuario}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
