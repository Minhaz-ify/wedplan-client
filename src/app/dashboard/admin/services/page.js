"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { CATEGORIES, money } from "@/lib/constants";
import { Loader, Empty, ErrorBox, StatusBadge, PageTitle, ConfirmButton } from "@/components/Ui";

export default function Page() {
  const [q, setQ] = useState("");
  const [dq, setDq] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  useEffect(() => { const t = setTimeout(() => setDq(q), 350); return () => clearTimeout(t); }, [q]);

  const params = new URLSearchParams();
  if (dq) params.set("q", dq);
  if (status) params.set("status", status);
  if (category) params.set("category", category);
  const { data, loading, error, reload } = useApi(`/api/admin/services?${params}`);

  const act = async (fn, msg) => { try { await fn(); toast.success(msg); reload(); } catch (e) { toast.error(e.message); } };
  const setSt = (id, s) => act(() => api(`/api/admin/services/${id}/status`, { method: "PATCH", body: { status: s } }), `Service ${s}`);

  return (
    <>
      <PageTitle title="Manage Services" />
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <input className="input" placeholder="🔍 Search by name" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
        </select>
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      {loading ? <Loader /> : error ? <ErrorBox error={error} onRetry={reload} /> : !data.length ? <Empty title="No services found" /> : (
        <div className="space-y-3">
          {data.map((s) => (
            <div key={s._id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.images?.[0]} alt="" className="h-24 w-full rounded-xl object-cover sm:w-36" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><h3 className="truncate font-semibold">{s.serviceName}</h3><StatusBadge status={s.status} /></div>
                <p className="mt-1 text-sm text-stone-500">{s.category} · {s.location} · {money(s.price)}</p>
                <p className="text-xs text-stone-400">Vendor: {s.vendor?.businessName || s.vendor?.name || "—"} ({s.vendor?.email})</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/services/${s._id}`} className="btn-outline btn-sm">View</Link>
                {s.status !== "approved" && <button onClick={() => setSt(s._id, "approved")} className="btn-primary btn-sm">Approve</button>}
                {s.status !== "rejected" && <button onClick={() => setSt(s._id, "rejected")} className="btn-outline btn-sm">Reject</button>}
                <ConfirmButton onConfirm={() => act(() => api(`/api/admin/services/${s._id}`, { method: "DELETE" }), "Service deleted")}>Delete</ConfirmButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
