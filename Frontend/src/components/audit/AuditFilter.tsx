import type { InventarioData } from "../../data/Stock";

interface Props {
  products: InventarioData[];

  selectedProduct: number | null;
  startDate: string;
  endDate: string;

  onProductChange: (value: number) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;

  onSearch: () => void;
  onClear: () => void;
}

export default function AuditFilter({
  products,
  selectedProduct,
  startDate,
  endDate,
  onProductChange,
  onStartDateChange,
  onEndDateChange,
  onSearch,
  onClear,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-end gap-4">
        {/* Producto */}
        <div className="flex min-w-[280px] flex-1 flex-col">
          <label className="mb-2 text-sm font-medium text-slate-700">
            Producto
          </label>

          <select
            value={selectedProduct ?? ""}
            onChange={(e) =>
              onProductChange(e.target.value ? Number(e.target.value) : 0)
            }
            className="rounded-lg border border-slate-300 px-4 py-2 focus:border-cyan-500 focus:outline-none"
          >
            <option value="">Seleccione un producto</option>

            {products.map((product) => (
              <option key={product.productoId} value={product.productoId}>
                {product.codigo} - {product.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha inicio */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-slate-700">
            Fecha inicio
          </label>

          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-2 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Fecha final */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-slate-700">
            Fecha final
          </label>

          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-2 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Buscar */}
        <button
          onClick={onSearch}
          className="rounded-lg bg-cyan-600 px-5 py-2 font-medium text-white transition hover:bg-cyan-700"
        >
          Buscar
        </button>

        {/* Limpiar */}
        <button
          onClick={onClear}
          className="rounded-lg bg-slate-200 px-5 py-2 font-medium text-slate-700 transition hover:bg-slate-300"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}
