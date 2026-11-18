"use client";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useApi } from "@/lib/hooks";
import { Loader, ErrorBox, StatCard, PageTitle } from "./Ui";

const CONFIG = {
  vendor: [["totalServices", "Total services", "🛍️"], ["activeServices", "Live services", "✅"], ["pendingRequests", "Pending requests", "⏳"], ["acceptedBookings", "Accepted bookings", "🎉"], ["plan", "Current plan", "⭐"]],
  customer: [["total", "Total requests", "📅"], ["pending", "Pending", "⏳"], ["accepted", "Accepted", "✅"], ["rejected", "Rejected", "❌"]],
  admin: [["totalUsers", "Total users", "👥"], ["totalVendors", "Vendors", "🏪"], ["totalCustomers", "Customers", "💑"], ["totalServices", "Services", "🛍️"], ["pendingServices", "Awaiting approval", "⏳"], ["totalTransactions", "Transactions", "💳"]],
};
const LINKS = {
  vendor: [["/dashboard/vendor/add", "Add a service"], ["/dashboard/vendor/bookings", "View requests"]],
  customer: [["/services", "Browse services"], ["/dashboard/customer/bookings", "My bookings"]],
  admin: [["/dashboard/admin/services", "Review services"], ["/dashboard/admin/users", "Manage users"]],
};

export default function StatsOverview({ role }) {
  const { data: session } = authClient.useSession();
  const { data, loading, error, reload } = useApi("/api/stats");
  return (
    <>
      <PageTitle title={`Welcome, ${session?.user?.name?.split(" ")[0] || ""} 👋`} />
      {loading ? <Loader /> : error ? <ErrorBox error={error} onRetry={reload} /> : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {CONFIG[role].map(([k, l, i]) => <StatCard key={k} label={l} icon={i} value={k === "plan" ? String(data[k]).toUpperCase() : data[k]} />)}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {LINKS[role].map(([h, l]) => <Link key={h} href={h} className="btn-outline">{l} →</Link>)}
          </div>
        </>
      )}
    </>
  );
}
