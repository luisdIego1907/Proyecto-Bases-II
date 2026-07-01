import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  label?: string;
}

export default function BackButton({
  label = "Volver",
}: Props) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="mb-6 inline-flex items-center gap-2 text-slate-600 hover:text-cyan-600 transition-colors"
    >
      <ArrowLeft size={18} />
      <span className="font-medium">{label}</span>
    </button>
  );
}