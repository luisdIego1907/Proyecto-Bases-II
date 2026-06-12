import { Trash2 } from "lucide-react";
import { useState } from "react";

type DeleteButtonProps = {
  label?: string;
  loadingLabel?: string;
  disabled?: boolean;
  confirmMessage?: string;
  onDelete: () => Promise<void> | void;
};

export default function DeleteButton({
  label = "Eliminar",
  loadingLabel = "Eliminando...",
  disabled = false,
  confirmMessage = "¿Está seguro de que desea eliminar este elemento?",
  onDelete,
}: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = async () => {
    const confirmDelete = window.confirm(confirmMessage);

    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isDeleting}
      className={`
        flex items-center gap-2 rounded-xl px-5 py-3 font-medium transition-colors
        ${
          disabled || isDeleting
            ? "cursor-not-allowed bg-slate-200 text-slate-400"
            : "cursor-pointer bg-red-600 text-white hover:bg-red-700"
        }
      `}
    >
      <Trash2 size={18} />
      {isDeleting ? loadingLabel : label}
    </button>
  );
}