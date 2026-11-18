"use client";
import Link from "next/link";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { fmtDate, money } from "@/lib/constants";
import { Loader, Empty, ErrorBox, StatusBadge, PageTitle, ConfirmButton } from "@/components/Ui";

export default function Page() {
  const { data, loading, error, reload } = useApi("/api/bookings/mine");

  const cancel = async (id) => {
    try { await api(`/api/bookings/${id}/cancel`, { method: "PATCH" }); toast.success("Booking cancelled"); } catch (e) { toast.error(e.message); }
    reload();
  };

  return (
    <>
      <PageTitle title="My Bookings" />
      {loading ? <Loader /> : error ? <ErrorBox error={error} onRetry={reload} /> : !data.length ? (
        <div className="space-y-4 text-center">
          <Empty title="No bookings yet" text="Find a service you love and send your first request." />
          <Link href="/services" className="btn-primary">Browse services</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((b) => (
            <div key={b._id} className="card flex flex-col gap-4 p-4 sm:flex-row">
              {b.service?.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.service.image} alt="" className="h-28 w-full rounded-xl object-cover sm:w-40" />
              )}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold">{b.service?.serviceName || "Service no longer available"}</h3>
                  <StatusBadge status={b.status} />
                </div>
                <p className="mt-1 text-sm text-stone-500">Vendor: {b.vendor?.businessName || b.vendor?.name || "—"}{b.service && ` · ${money(b.service.price)}`}</p>
                <p className="mt-2 text-sm">📅 <b>{fmtDate(b.eventDate)}</b> · 📍 {b.eventLocation}</p>
                {b.message && <p className="mt-2 text-sm text-stone-500">“{b.message}”</p>}
              </div>
              {b.status === "pending" && <div className="self-start"><ConfirmButton onConfirm={() => cancel(b._id)}>Cancel request</ConfirmButton></div>}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
