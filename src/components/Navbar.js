"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { resetToken } from "@/lib/api";
import { Avatar } from "./Ui";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  const links = [["/", "Home"], ["/services", "Browse Services"]];
  const logout = async () => {
    await authClient.signOut();
    resetToken();
    setMenu(false);
    router.push("/");
    router.refresh();
  };
  const active = (h) => (h === "/" ? pathname === "/" : pathname.startsWith(h));

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/85 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-bold text-brand-700">Wed<span className="text-gold-500">Plan</span> 💍</Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map(([h, l]) => (
            <Link key={h} href={h} className={`text-sm font-medium transition hover:text-brand-600 ${active(h) ? "text-brand-700" : "text-stone-600"}`}>{l}</Link>
          ))}
          {user && <Link href="/dashboard" className={`text-sm font-medium hover:text-brand-600 ${active("/dashboard") ? "text-brand-700" : "text-stone-600"}`}>Dashboard</Link>}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-stone-100" />
          ) : user ? (
            <div className="relative">
              <button onClick={() => setMenu(!menu)} className="flex items-center gap-2 rounded-full border border-stone-200 py-1 pl-1 pr-3 hover:border-brand-300">
                <Avatar user={user} size={30} />
                <span className="max-w-[110px] truncate text-sm font-medium">{user.name}</span>
              </button>
              {menu && (
                <div className="card absolute right-0 mt-2 w-56 p-2" onMouseLeave={() => setMenu(false)}>
                  <div className="border-b border-stone-100 px-3 py-2">
                    <p className="truncate text-sm font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-stone-500">{user.email}</p>
                    <p className="mt-1 text-xs capitalize text-brand-600">{user.role}</p>
                  </div>
                  <Link onClick={() => setMenu(false)} href="/dashboard" className="block rounded-lg px-3 py-2 text-sm hover:bg-brand-50">Dashboard</Link>
                  <Link onClick={() => setMenu(false)} href="/dashboard/profile" className="block rounded-lg px-3 py-2 text-sm hover:bg-brand-50">Profile Settings</Link>
                  <button onClick={logout} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/signin" className="btn-outline btn-sm">Sign In</Link>
              <Link href="/signup" className="btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          <span className="text-2xl">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-stone-200 bg-white px-4 py-3 md:hidden" onClick={() => setOpen(false)}>
          <div className="flex flex-col gap-1">
            {links.map(([h, l]) => <Link key={h} href={h} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-brand-50">{l}</Link>)}
            {user ? (
              <>
                <Link href="/dashboard" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-brand-50">Dashboard</Link>
                <Link href="/dashboard/profile" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-brand-50">Profile Settings</Link>
                <button onClick={logout} className="rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50">Logout</button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link href="/signin" className="btn-outline btn-sm flex-1">Sign In</Link>
                <Link href="/signup" className="btn-primary btn-sm flex-1">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
