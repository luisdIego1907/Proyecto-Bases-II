import { getRoles } from "../../auth/sessionAuth";

export default function PageGreeting() {
  const fecha = new Date().toLocaleDateString("es-CR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hora = new Date().getHours();

  const saludo =
    hora < 12
      ? "Buenos días"
      : hora < 18
        ? "Buenas tardes"
        : "Buenas noches";

  const rol = getRoles()[0];

  const getRoleLabel = () => {
    switch (rol) {
      case "ADMIN":
        return "Administrador";

      case "SUPERVISOR":
        return "Supervisor";

      case "OPERARIO":
        return "Operario";

      default:
        return "Usuario";
    }
  };

  return (
    <section className="mb-10">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        {saludo},{" "}
        <span className="text-blue-600">
          {getRoleLabel()}
        </span>
        <span className="ml-2"></span>
      </h1>

      <p className="mt-2 capitalize text-slate-500">
        {fecha}
      </p>
    </section>
  );
}