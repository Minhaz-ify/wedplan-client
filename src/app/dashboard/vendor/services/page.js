"use client";
import Link from "next/link";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { money } from "@/lib/constants";
import { Loader, Empty, ErrorBox, StatusBadge, PageTitle, ConfirmButton } from "@/components/Ui";

export default function Page() {
  const { data, loading, error, reload } = useApi("/api/vendor/services");

  const act = async (fn, msg) => {
    try { await fn(); toast.success(msg); reload(); } catch (e) { toast.error(e.message); }
  };

  return (
    <>
      <PageTitle title="My Services"><Link href="/dashboard/vendor/add" className="btn-primary btn-sm">+ Add Service</Link></PageTitle>
      {loading ? <Loader /> : error ? <ErrorBox error={error} onRetry={reload} /> : !data.length ? (
        <Empty title="No services yet" text="Add your first service to start receiving booking requests." />
      ) : (
        <div className="space-y-4">
          {data.map((s) => (
            <div key={s._id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.images?.[0]} alt="" className="h-28 w-full rounded-xl object-cover sm:w-40" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-lg font-semibold">{s.serviceName}</h3>
                  <StatusBadge status={s.status} />
                  {s.isActive === false && <StatusBadge status="cancelled" />}
                </div>
                <p className="mt-1 text-sm text-stone-500">{s.category} · {s.location} · {money(s.price)}</p>
                {s.status === "rejected" && <p className="mt-1 text-xs text-red-600">Rejected by admin — edit and contact support.</p>}
                {s.isActive === false && <p className="mt-1 text-xs text-stone-500">Unavailable (hidden from customers)</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="btn-outline btn-sm" onClick={() => act(() => api(`/api/vendor/services/${s._id}`, { method: "PUT", body: { isActive: s.isActive === false } }), s.isActive === false ? "Service is available again" : "Service marked unavailable")}>
                  {s.isActive === false ? "Make available" : "Mark unavailable"}
                </button>
                <Link href={`/dashboard/vendor/services/${s._id}`} className="btn-outline btn-sm">Edit</Link>
                <ConfirmButton onConfirm={() => act(() => api(`/api/vendor/services/${s._id}`, { method: "DELETE" }), "Service deleted")}>Delete</ConfirmButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
