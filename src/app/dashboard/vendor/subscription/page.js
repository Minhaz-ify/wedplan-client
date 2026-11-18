"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { fmtDate } from "@/lib/constants";
import { Loader, ErrorBox, StatusBadge, PageTitle, ConfirmButton } from "@/components/Ui";

export default function Page() {
  const { data: me, loading, error, reload } = useApi("/api/me");
  const [busy, setBusy] = useState(false);

  const upgrade = async () => {
    setBusy(true);
    try { const { url } = await api("/api/payments/checkout", { method: "POST" }); window.location.href = url; }
    catch (e) { toast.error(e.message); setBusy(false); }
  };
  const cancel = async () => {
    try { const r = await api("/api/payments/cancel", { method: "POST" }); toast.success(r.message); reload(); } catch (e) { toast.error(e.message); }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorBox error={error} onRetry={reload} />;
  const premium = me.subscriptionPlan === "premium";

  const Plan = ({ title, price, items, current, children }) => (
    <div className={`card p-7 ${current ? "border-2 border-brand-500" : ""}`}>
      <div className="flex items-center justify-between"><h3 className="text-xl font-semibold">{title}</h3>{current && <StatusBadge status="active" />}</div>
      <p className="mt-3 font-serif text-4xl font-bold text-brand-700">{price}</p>
      <ul className="mt-5 space-y-2 text-sm text-stone-600">{items.map((i) => <li key={i}>✓ {i}</li>)}</ul>
      <div className="mt-6">{children}</div>
    </div>
  );

  return (
    <>
      <PageTitle title="Subscription"><StatusBadge status={me.subscriptionPlan} /></PageTitle>
      <div className="grid gap-6 md:grid-cols-2">
        <Plan title="Free" price="$0" current={!premium} items={["Up to 3 active services", "Booking requests", "Vendor dashboard"]}>
          {!premium && <p className="text-sm text-stone-500">Your current plan.</p>}
        </Plan>
        <Plan title="Premium" price="$19.99/mo" current={premium} items={["Unlimited services", "Premium badge on listings", "Priority visibility"]}>
          {premium ? (
            <div className="space-y-3">
              <p className="text-sm text-stone-600">Active until <b>{fmtDate(me.subscriptionExpiresAt)}</b></p>
              <ConfirmButton className="btn-outline btn-sm" onConfirm={cancel}>Cancel subscription</ConfirmButton>
            </div>
          ) : (
            <button disabled={busy} onClick={upgrade} className="btn-primary w-full">{busy ? "Redirecting to Stripe..." : "Upgrade to Premium"}</button>
          )}
        </Plan>
      </div>
      <p className="mt-6 text-xs text-stone-500">Payments are processed securely by Stripe (test mode). Premium is activated automatically once Stripe confirms your payment.</p>
    </>
  );
}
