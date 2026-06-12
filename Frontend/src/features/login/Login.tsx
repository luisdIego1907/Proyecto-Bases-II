import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/AuthService";


type LoginData = {
  username: string;
  password: string;
};

export default function LoginForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginData>({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await loginUser({
        username: form.username,
        password: form.password,
      });

      navigate("/clients");
    } catch {
      setError("Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-500 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">
            Iniciar Sesión
          </h2>
          <p className="text-cyan-100 text-sm mt-1">
            Acceso a SGID
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-600">
              Usuario
            </label>

            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Contraseña
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}