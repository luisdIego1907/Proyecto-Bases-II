interface Props {
  startDate: string;
  endDate: string;

  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;

  onFilter: () => void;
  onClear: () => void;
}

export default function DispatchFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onFilter,
  onClear,
}: Props) {
  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow-lg">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-slate-700">
            Fecha inicio
          </label>

          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-slate-700">
            Fecha final
          </label>

          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-2"
          />
        </div>

        <button
          onClick={onFilter}
          className="rounded-lg bg-cyan-600 px-5 py-2 font-medium text-white hover:bg-cyan-700 transition"
        >
          Filtrar
        </button>

        <button
          onClick={onClear}
          className="rounded-lg bg-slate-200 px-5 py-2 font-medium text-slate-700 hover:bg-slate-300 transition"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}
