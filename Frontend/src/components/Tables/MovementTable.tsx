import type { ProductMovement } from "../../data/audit/ProductMovement";

interface Props {
  movements: ProductMovement[];
}

export default function MovementTable({ movements }: Props) {
  function getRowStyle(tipoMovimiento: string) {
    if (tipoMovimiento.toUpperCase() === "RECEPCION") {
      return "bg-blue-50";
    }

    return "bg-orange-50";
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
        <div className="max-h-[450px] overflow-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Fecha</th>

                <th className="px-6 py-4 text-left font-semibold">Tipo</th>

                <th className="px-6 py-4 text-left font-semibold">Cliente</th>

                <th className="px-6 py-4 text-left font-semibold">Cantidad</th>

                <th className="px-6 py-4 text-left font-semibold">Usuario</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {movements.map((movement, index) => (
                <tr
                  key={index}
                  className={`${getRowStyle(
                    movement.tipoMovimiento,
                  )} hover:opacity-90 transition`}
                >
                  <td className="px-6 py-4">
                    {new Date(movement.fecha).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    {movement.tipoMovimiento}
                  </td>

                  <td className="px-6 py-4">{movement.cliente}</td>

                  <td className="px-6 py-4">{movement.cantidad}</td>

                  <td className="px-6 py-4">{movement.usuario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
