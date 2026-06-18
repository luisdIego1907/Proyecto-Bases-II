import type { ProductMovement } from "../../data/audit/ProductMovement";

interface Props {
  movements: ProductMovement[];
  maxHeight?: string;
}

export default function MovementTable({
  movements,
  maxHeight = "450px",
}: Props) {
  function getRowStyle(tipoMovimiento: string) {
    if (tipoMovimiento.toUpperCase() === "RECEPCION") {
      return "bg-blue-50 hover:bg-blue-100";
    }

    return "bg-orange-50 hover:bg-orange-100";
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Historial de Movimientos
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Recepciones y despachos del producto seleccionado
        </p>
      </div>

      {/* Empty state */}
      {movements.length === 0 ? (
        <div className="flex items-center justify-center rounded-xl bg-slate-50 py-12">
          <p className="text-slate-400">No se encontraron movimientos</p>
        </div>
      ) : (
        <div
          style={{ maxHeight }}
          className="overflow-y-auto rounded-xl border border-slate-200"
        >
          <table className="w-full text-sm">
            {/* Header */}
            <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600 shadow-sm">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Fecha</th>

                <th className="px-4 py-3 text-left font-semibold">Tipo</th>

                <th className="px-4 py-3 text-left font-semibold">Cliente</th>

                <th className="px-4 py-3 text-left font-semibold">Cantidad</th>

                <th className="px-4 py-3 text-left font-semibold">Usuario</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-slate-100">
              {movements.map((movement, index) => (
                <tr
                  key={index}
                  className={`transition ${getRowStyle(
                    movement.tipoMovimiento,
                  )}`}
                >
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {new Date(movement.fecha).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 font-medium text-slate-800">
                    {movement.tipoMovimiento}
                  </td>

                  <td className="px-4 py-3 text-slate-800">
                    {movement.cliente}
                  </td>

                  <td className="px-4 py-3 font-medium text-slate-800">
                    {movement.cantidad}
                  </td>

                  <td className="px-4 py-3 text-slate-800">
                    {movement.usuario}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
