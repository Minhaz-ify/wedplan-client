"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { fmtDate } from "@/lib/constants";
import { Loader, Empty, ErrorBox, StatusBadge, PageTitle, Avatar } from "@/components/Ui";

export default function Page() {
  const { data, loading, error, reload } = useApi("/api/vendor/bookings");
  const [busyId, setBusyId] = useState(null);

  const respond = async (id, status) => {
    setBusyId(id);
    try { await api(`/api/vendor/bookings/${id}`, { method: "PATCH", body: { status } }); toast.success(`Request ${status}`); reload(); }
    catch (e) { toast.error(e.message); reload(); }
    finally { setBusyId(null); }
  };

  return (
    <>
      <PageTitle title="Booking Requests" />
      {loading ? <Loader /> : error ? <ErrorBox error={error} onRetry={reload} /> : !data.length ? (
        <Empty title="No booking requests yet" text="When customers book your services, they'll show up here." />
      ) : (
        <div className="space-y-4">
          {data.map((b) => (
            <div key={b._id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar user={b.customer} size={42} />
                  <div>
                    <p className="font-semibold">{b.customer?.name || "Customer"}</p>
                    <p className="text-xs text-stone-500">{b.customer?.email}</p>
                  </div>
                </div>
                <StatusBadge status={b.status} />
              </div>
              <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                <p><span className="text-stone-500">Service:</span> <b>{b.service?.serviceName || "Deleted service"}</b></p>
                <p><span className="text-stone-500">Event date:</span> <b>{fmtDate(b.eventDate)}</b></p>
                <p><span className="text-stone-500">Location:</span> <b>{b.eventLocation}</b></p>
              </div>
              {b.message && <p className="mt-3 rounded-xl bg-stone-50 p-3 text-sm text-stone-600">“{b.message}”</p>}
              {b.status === "pending" && (
                <div className="mt-4 flex gap-2">
                  <button disabled={busyId === b._id} onClick={() => respond(b._id, "accepted")} className="btn-primary btn-sm">Accept</button>
                  <button disabled={busyId === b._id} onClick={() => respond(b._id, "rejected")} className="btn-outline btn-sm">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
