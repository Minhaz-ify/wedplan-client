"use client";
import { useRef, useState } from "react";

export const Loader = ({ label = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-20 text-stone-500">
    <div className="h-9 w-9 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
    <p className="text-sm">{label}</p>
  </div>
);

export const Empty = ({ title = "Nothing here yet", text }) => (
  <div className="card flex flex-col items-center px-6 py-14 text-center">
    <div className="text-4xl">💍</div>
    <h3 className="mt-3 text-lg font-semibold">{title}</h3>
    {text && <p className="mt-1 max-w-sm text-sm text-stone-500">{text}</p>}
  </div>
);

export const ErrorBox = ({ error, onRetry }) => (
  <div className="card border-red-200 bg-red-50 px-6 py-8 text-center">
    <p className="font-medium text-red-700">{error?.message || "Something went wrong"}</p>
    {onRetry && <button onClick={onRetry} className="btn-outline btn-sm mt-3">Try again</button>}
  </div>
);

const COLORS = {
  pending: "bg-amber-100 text-amber-800", approved: "bg-emerald-100 text-emerald-800", accepted: "bg-emerald-100 text-emerald-800",
  paid: "bg-emerald-100 text-emerald-800", rejected: "bg-red-100 text-red-700", failed: "bg-red-100 text-red-700",
  cancelled: "bg-stone-200 text-stone-600", blocked: "bg-red-100 text-red-700", active: "bg-emerald-100 text-emerald-800",
  premium: "bg-gold-400/30 text-gold-600", free: "bg-stone-100 text-stone-600",
};
export const StatusBadge = ({ status }) => (
  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${COLORS[status] || "bg-stone-100 text-stone-600"}`}>{status}</span>
);

export const StatCard = ({ label, value, icon }) => (
  <div className="card p-5">
    <div className="flex items-center justify-between">
      <p className="text-sm text-stone-500">{label}</p>
      <span className="text-xl">{icon}</span>
    </div>
    <p className="mt-2 font-serif text-3xl font-bold text-brand-700">{value ?? "—"}</p>
  </div>
);

export const PageTitle = ({ title, children }) => (
  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
    <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
    {children}
  </div>
);

// Two-step confirm so destructive actions are never one accidental click
export function ConfirmButton({ children, onConfirm, className = "btn-danger btn-sm", disabled }) {
  const [armed, setArmed] = useState(false);
  const timer = useRef();
  return (
    <button
      disabled={disabled}
      className={className}
      onClick={() => {
        if (!armed) {
          setArmed(true);
          timer.current = setTimeout(() => setArmed(false), 3000);
        } else {
          clearTimeout(timer.current);
          setArmed(false);
          onConfirm();
        }
      }}
    >
      {armed ? "Click again to confirm" : children}
    </button>
  );
}

export const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
    <div className="card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">{title}</h3>
        <button onClick={onClose} className="text-2xl leading-none text-stone-400 hover:text-stone-700" aria-label="Close">×</button>
      </div>
      {children}
    </div>
  </div>
);

export const Avatar = ({ user, size = 36 }) =>
  user?.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={user.image} alt={user.name || "avatar"} width={size} height={size} className="rounded-full object-cover" style={{ width: size, height: size }} />
  ) : (
    <div className="flex items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700" style={{ width: size, height: size }}>
      {(user?.name || "?").charAt(0).toUpperCase()}
    </div>
  );
