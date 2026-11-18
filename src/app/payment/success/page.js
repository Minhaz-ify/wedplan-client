"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { Loader } from "@/components/Ui";

function Inner() {
  const sessionId = useSearchParams().get("session_id");
  const { refetch } = authClient.useSession();
  const [status, setStatus] = useState("checking");

  // Premium is activated ONLY by the Stripe webhook; here we just poll the result.
  useEffect(() => {
    if (!sessionId) return setStatus("missing");
    let tries = 0;
    let stop = false;
    const tick = async () => {
      try {
        const r = await api(`/api/payments/session/${sessionId}`);
        if (r.status === "paid") { if (!stop) { setStatus("paid"); refetch?.(); } return; }
        if (r.status === "failed") return !stop && setStatus("failed");
      } catch { /* keep polling */ }
      if (++tries >= 15) return !stop && setStatus("slow");
      setTimeout(tick, 2000);
    };
    tick();
    return () => { stop = true; };
  }, [sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const view = {
    checking: ["⏳", "Confirming your payment...", "Please wait a moment while we verify it with Stripe."],
    paid: ["🎉", "You're Premium now!", "Payment confirmed. You can add unlimited services."],
    slow: ["🕐", "Payment received — activation pending", "Stripe is still confirming. Refresh your dashboard in a minute."],
    failed: ["⚠️", "Payment was not completed", "No charge was made. You can try again."],
    missing: ["❓", "No payment session found", "Open this page from the checkout flow."],
  }[status];

  return (
    <div className="container-x flex justify-center py-20">
      <div className="card max-w-md p-10 text-center">
        <p className="text-6xl">{view[0]}</p>
        <h1 className="mt-4 text-2xl font-bold">{view[1]}</h1>
        <p className="mt-2 text-stone-500">{view[2]}</p>
        {status === "checking" && <Loader label="" />}
        <Link href="/dashboard/vendor/subscription" className="btn-primary mt-6">Go to Subscription</Link>
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<Loader />}><Inner /></Suspense>;
}
