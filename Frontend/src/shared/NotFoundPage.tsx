import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  function handleGoHome() {
    navigate("/");
  }

  function handleGoBack() {
    navigate(-1);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <section className="w-full max-w-4xl">
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm md:p-16">
          {/* Número error */}
          <div className="mb-8">
            <h1 className="mb-4 text-8xl font-bold text-slate-900 md:text-9xl">
              404
            </h1>

            <div className="mx-auto mb-6 h-1 w-24 bg-cyan-600"></div>
          </div>

          {/* Mensaje */}
          <div className="mb-12">
            <h2 className="mb-4 text-3xl font-bold text-slate-800 md:text-4xl">
              Página no encontrada
            </h2>

            <p className="mx-auto max-w-2xl text-lg text-slate-500">
              La página que intenta acceder no existe, fue movida o la ruta no
              es válida dentro del sistema.
            </p>
          </div>

          {/* Botones */}
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={handleGoHome}
              className="rounded-xl bg-cyan-600 px-8 py-4 font-medium text-white transition hover:bg-cyan-700"
            >
              Ir al inicio
            </button>

            <button
              onClick={handleGoBack}
              className="rounded-xl border border-slate-300 bg-white px-8 py-4 font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Volver atrás
            </button>
          </div>

          {/* Extra */}
          <div className="mt-12 border-t border-slate-200 pt-8">
            <p className="text-sm text-slate-400">
              Sistema de Gestión de Inventario
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
