interface Props {
  status: string;
}
//Sirve para mostrar visualmente el estado del despacho
//Si es procesado = verde, pendiente = amarillo, cancelado = rojo, sino gris
export default function DispatchStatusBadge({ status }: Props) {
  const getStatusStyle = () => {
    switch (status) {
      case "PROCESADO":
        return "bg-green-500 text-white";
      case "PENDIENTE":
        return "bg-yellow-500 text-white";
      case "CANCELADO":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle()}`}
    >
      {status}
    </span>
  );
}
