"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { Loader, Avatar } from "@/components/Ui";

const MENUS = {
  vendor: [["/dashboard/vendor", "📊 Overview"], ["/dashboard/vendor/services", "🛍️ My Services"], ["/dashboard/vendor/add", "➕ Add Service"], ["/dashboard/vendor/bookings", "📩 Booking Requests"], ["/dashboard/vendor/subscription", "⭐ Subscription"], ["/dashboard/profile", "👤 Profile"]],
  customer: [["/dashboard/customer", "📊 Overview"], ["/dashboard/customer/bookings", "📅 My Bookings"], ["/dashboard/profile", "👤 Profile"]],
  admin: [["/dashboard/admin", "📊 Overview"], ["/dashboard/admin/users", "👥 Manage Users"], ["/dashboard/admin/services", "🛍️ Manage Services"], ["/dashboard/admin/transactions", "💳 Transactions"], ["/dashboard/profile", "👤 Profile"]],
};

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const role = user?.role || "customer";
  const pathname = usePathname();
  const router = useRouter();

  const home = `/dashboard/${role}`;
  const allowed = pathname === "/dashboard/profile" || pathname === home || pathname.startsWith(home + "/");

  useEffect(() => {
    if (isPending) return;
    if (!user) return router.replace("/signin");
    if (user.isBlocked) {
      toast.error("Your account has been blocked.");
      authClient.signOut().then(() => router.replace("/"));
      return;
    }
    if (!allowed) router.replace(home);
  }, [isPending, user, allowed, home, router]);

  if (isPending || !user || !allowed) return <Loader />;

  const menu = MENUS[role] || MENUS.customer;
  return (
    <div className="container-x grid gap-6 py-8 lg:grid-cols-[250px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="card p-4">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
            <Avatar user={user} size={44} />
            <div className="min-w-0">
              <p className="truncate font-semibold">{user.name}</p>
              <p className="text-xs capitalize text-brand-600">{role}</p>
            </div>
          </div>
          <nav className="mt-3 flex gap-1 overflow-x-auto lg:flex-col">
            {menu.map(([href, label]) => {
              const on = pathname === href;
              return (
                <Link key={href} href={href} className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition ${on ? "bg-brand-600 text-white" : "text-stone-600 hover:bg-brand-50"}`}>{label}</Link>
              );
            })}
          </nav>
        </div>
      </aside>
      <section className="min-w-0">{children}</section>
    </div>
  );
}
