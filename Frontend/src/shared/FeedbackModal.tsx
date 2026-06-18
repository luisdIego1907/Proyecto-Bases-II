import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface Props {
  isOpen: boolean;
  type: "success" | "error" | "warning";
  message: string;
  onClose: () => void;
}

export default function FeedbackModal({
  isOpen,
  type,
  message,
  onClose,
}: Props) {
  if (!isOpen) return null;

  function getConfig() {
    switch (type) {
      case "success":
        return {
          icon: CheckCircle,
          title: "Operación exitosa",
          accent: "bg-emerald-500",
          button: "bg-emerald-600 hover:bg-emerald-700",
        };

      case "error":
        return {
          icon: XCircle,
          title: "Ocurrió un error",
          accent: "bg-red-500",
          button: "bg-red-600 hover:bg-red-700",
        };

      default:
        return {
          icon: AlertTriangle,
          title: "Atención",
          accent: "bg-amber-500",
          button: "bg-amber-500 hover:bg-amber-600",
        };
    }
  }

  const config = getConfig();
  const Icon = config.icon;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-200 animate-[fadeIn_.2s_ease-out]"
      >
        {/* Barra superior */}
        <div className={`h-2 ${config.accent}`} />

        <div className="p-8 text-center">
          {/* Icono */}
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-white ${config.accent}`}
          >
            <Icon size={30} strokeWidth={2.5} />
          </div>

          {/* Título */}
          <h2 className="mt-5 text-2xl font-bold text-slate-800">
            {config.title}
          </h2>

          {/* Mensaje */}
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            {message}
          </p>

          {/* Botón */}
          <button
            onClick={onClose}
            className={`mt-8 w-full rounded-xl px-5 py-3 font-medium text-white transition ${config.button}`}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
