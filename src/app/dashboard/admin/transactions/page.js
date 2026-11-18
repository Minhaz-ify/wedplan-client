"use client";
import { useApi } from "@/lib/hooks";
import { fmtDate } from "@/lib/constants";
import { Loader, Empty, ErrorBox, StatusBadge, PageTitle } from "@/components/Ui";

export default function Page() {
  const { data, loading, error, reload } = useApi("/api/admin/transactions");
  return (
    <>
      <PageTitle title="Transactions" />
      {loading ? <Loader /> : error ? <ErrorBox error={error} onRetry={reload} /> : !data.length ? <Empty title="No transactions yet" text="Premium subscription payments will appear here." /> : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
              <tr><th className="p-4">Vendor</th><th className="p-4">Plan</th><th className="p-4">Amount</th><th className="p-4">Status</th><th className="p-4">Date</th></tr>
            </thead>
            <tbody>
              {data.map((t) => (
                <tr key={t._id} className="border-b border-stone-100 last:border-0">
                  <td className="p-4"><p className="font-medium">{t.vendor?.businessName || t.vendor?.name || "—"}</p><p className="text-xs text-stone-500">{t.vendor?.email}</p></td>
                  <td className="p-4 capitalize">{t.plan}</td>
                  <td className="p-4">${Number(t.amount).toFixed(2)} {String(t.currency || "").toUpperCase()}</td>
                  <td className="p-4"><StatusBadge status={t.status} /></td>
                  <td className="p-4">{fmtDate(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
