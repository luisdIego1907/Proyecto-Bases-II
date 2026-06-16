interface Props {
  selectedClient: string;
  onChange: (value: string) => void;
  onCreate: () => void;
}

export default function ClientSelector({
  selectedClient,
  onChange,
  onCreate,
}: Props) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      <div className="flex-1">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Cliente
        </label>

        <select
          value={selectedClient}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500"
        >
          <option value="">Seleccione un cliente</option>

          {/* Mock temporal */}
          <option value="1">Empresa ABC</option>
          <option value="2">Cliente XYZ</option>
          <option value="3">Tech Solutions</option>
        </select>
      </div>

      <button
        onClick={onCreate}
        disabled={!selectedClient}
        className="rounded-xl bg-cyan-600 px-5 py-3 font-medium text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        Crear despacho
      </button>
    </div>
  );
}
