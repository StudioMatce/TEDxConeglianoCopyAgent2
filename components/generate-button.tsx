"use client";

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export function GenerateButton({ onClick, disabled, loading }: GenerateButtonProps) {
  const isInactive = disabled || loading;

  return (
    <button
      onClick={onClick}
      disabled={isInactive}
      className="w-full rounded-lg py-3.5 text-[13px] font-medium transition-colors"
      style={{
        background: isInactive ? "#f0f0ee" : "#222",
        color: isInactive ? "#bbb" : "white",
        cursor: isInactive ? "not-allowed" : "pointer",
        border: "none",
      }}
    >
      {loading ? "Generando..." : "Genera copy →"}
    </button>
  );
}
