import type { CartItem } from "../../data/dispatch/CartItem";

interface Props {
  cart: CartItem[];
  onRemove: (productoId: number) => void;
  onProcess: () => void;
}

export default function DispatchCart({ cart, onRemove, onProcess }: Props) {
  const totalProducts = cart.reduce((total, item) => total + item.cantidad, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Productos Agregados
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Productos listos para despachar
        </p>
      </div>

      {/* Lista */}
      <div className="mb-6 min-h-64 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {cart.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-sm text-slate-400">No hay productos agregados</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.productoId}
                className="flex items-center justify-between rounded-lg bg-white px-3 py-3"
              >
                <span className="font-medium text-slate-700">
                  {item.nombre}
                </span>

                <span className="text-sm text-slate-500">x{item.cantidad}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total */}
      <div className="mb-4 border-t border-slate-200 pt-4">
        <p className="text-sm font-medium text-slate-600">
          Total productos: {totalProducts}
        </p>
      </div>

      {/* Botón */}
      <button
        onClick={onProcess}
        disabled={cart.length === 0}
        className="w-full rounded-xl bg-green-600 px-4 py-3 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        Procesar despacho
      </button>
    </div>
  );
}
