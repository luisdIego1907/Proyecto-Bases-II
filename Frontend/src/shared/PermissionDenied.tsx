import { useNavigate } from "react-router-dom";

interface PermissionDeniedProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  compact?: boolean;
}

export function PermissionDenied({
  title = "Acceso denegado",
  message = "No tiene permisos suficientes para realizar esta acción.",
  showBackButton = true,
  showHomeButton = true,
  compact = false,
}: PermissionDeniedProps) {
  const navigate = useNavigate();

  return (
    <section
      className={
        compact
          ? "flex items-center justify-center"
          : "flex min-h-screen items-center justify-center bg-gray-100 px-6"
      }
    >
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white px-8 py-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-2xl font-extrabold text-red-700">
          403
        </div>

        <h1 className="mb-3 text-2xl font-bold text-gray-900">{title}</h1>

        <p className="text-base leading-relaxed text-gray-500">{message}</p>

        {(showBackButton || showHomeButton) && (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {showBackButton && (
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="h-11 rounded-lg bg-gray-200 px-6 font-semibold text-gray-700 transition hover:bg-gray-300"
              >
                Volver
              </button>
            )}

            {showHomeButton && (
              <button
                type="button"
                onClick={() => navigate("/")}
                className="h-11 rounded-lg bg-cyan-600 px-6 font-semibold text-white transition hover:bg-cyan-700"
              >
                Ir al inicio
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}