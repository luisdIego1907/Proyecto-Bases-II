import type { RecepcionProducto } from "../../data/reception";

type ReceptionTableProps = {
  recepciones: RecepcionProducto[];
};

export default function ReceptionTable({
  recepciones,
}: ReceptionTableProps) {
  if (recepciones.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="max-w-lg rounded-3xl border border-slate-200 bg-white px-10 py-12 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-slate-700">
            No existen recepciones registradas
          </h2>

          <p className="mt-2 text-slate-500">
            El producto seleccionado aún no posee ingresos al almacén.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="max-h-[70vh] overflow-auto">
        <table className="min-w-full">
          <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Fecha
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Cliente
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Lote
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                Cantidad
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Usuario
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {recepciones.map((recepcion) => (
              <tr
                key={recepcion.recepcionResourceId}
                className="transition hover:bg-slate-50"
              >
                <td className="px-6 py-4 text-sm text-slate-700">
                  {new Date(
                    recepcion.fechaRecepcion
                  ).toLocaleDateString("es-CR")}
                </td>

                <td className="px-6 py-4 text-sm text-slate-700">
                  {recepcion.cliente}
                </td>

                <td className="px-6 py-4 text-sm text-slate-700">
                  {recepcion.numeroLote}
                </td>

                <td className="px-6 py-4 text-center font-semibold text-slate-700">
                  {recepcion.cantidad}
                </td>

                <td className="px-6 py-4 text-sm text-slate-700">
                  {recepcion.usuario}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}