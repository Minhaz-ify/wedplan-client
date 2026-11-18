"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { fmtDate } from "@/lib/constants";
import { Loader, Empty, ErrorBox, StatusBadge, PageTitle, Avatar, Modal, ConfirmButton } from "@/components/Ui";

export default function Page() {
  const [q, setQ] = useState("");
  const [dq, setDq] = useState("");
  const [role, setRole] = useState("");
  const [sel, setSel] = useState(null);
  useEffect(() => { const t = setTimeout(() => setDq(q), 350); return () => clearTimeout(t); }, [q]);

  const params = new URLSearchParams();
  if (dq) params.set("q", dq);
  if (role) params.set("role", role);
  const { data, loading, error, reload } = useApi(`/api/admin/users?${params}`);

  const toggle = async (u) => {
    try { const r = await api(`/api/admin/users/${u.id}/block`, { method: "PATCH", body: { blocked: !u.isBlocked } }); toast.success(r.message); reload(); }
    catch (e) { toast.error(e.message); }
  };

  return (
    <>
      <PageTitle title="Manage Users" />
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <input className="input sm:col-span-2" placeholder="🔍 Search by name or email" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All roles</option><option value="vendor">Vendors</option><option value="customer">Customers</option><option value="admin">Admins</option>
        </select>
      </div>
      {loading ? <Loader /> : error ? <ErrorBox error={error} onRetry={reload} /> : !data.length ? <Empty title="No users found" /> : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
              <tr><th className="p-4">User</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {data.map((u) => (
                <tr key={u.id} className="border-b border-stone-100 last:border-0">
                  <td className="p-4"><div className="flex items-center gap-3"><Avatar user={u} size={36} /><div><p className="font-medium">{u.name}</p><p className="text-xs text-stone-500">{u.email}</p></div></div></td>
                  <td className="p-4 capitalize">{u.role}</td>
                  <td className="p-4"><StatusBadge status={u.isBlocked ? "blocked" : "active"} /></td>
                  <td className="p-4"><div className="flex justify-end gap-2">
                    <button onClick={() => setSel(u)} className="btn-outline btn-sm">Details</button>
                    {u.role !== "admin" && (u.isBlocked
                      ? <button onClick={() => toggle(u)} className="btn-primary btn-sm">Unblock</button>
                      : <ConfirmButton onConfirm={() => toggle(u)}>Block</ConfirmButton>)}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {sel && (
        <Modal title="User details" onClose={() => setSel(null)}>
          <div className="flex items-center gap-4"><Avatar user={sel} size={64} /><div><p className="text-lg font-semibold">{sel.name}</p><p className="text-sm text-stone-500">{sel.email}</p></div></div>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <dt className="text-stone-500">Role</dt><dd className="capitalize">{sel.role}</dd>
            <dt className="text-stone-500">Status</dt><dd>{sel.isBlocked ? "Blocked" : "Active"}</dd>
            {sel.role === "vendor" && <><dt className="text-stone-500">Business</dt><dd>{sel.businessName || "—"}</dd><dt className="text-stone-500">Plan</dt><dd className="capitalize">{sel.subscriptionPlan}</dd></>}
            <dt className="text-stone-500">Joined</dt><dd>{fmtDate(sel.createdAt)}</dd>
          </dl>
        </Modal>
      )}
    </>
  );
}
