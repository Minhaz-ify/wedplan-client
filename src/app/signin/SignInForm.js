"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { resetToken } from "@/lib/api";

export default function SignInForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirect = sp.get("redirect");
  const target = redirect && redirect.startsWith("/") ? redirect : "/dashboard";
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await authClient.signIn.email({ email: form.email, password: form.password });
    setBusy(false);
    if (error) return toast.error(error.message || "Invalid email or password");
    resetToken();
    toast.success("Welcome back!");
    router.push(target);
    router.refresh();
  };

  const google = async () => {
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: target });
    if (error) toast.error(error.message || "Google sign-in failed");
  };

  return (
    <div className="container-x flex justify-center py-14">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-center text-3xl font-bold">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-stone-500">Sign in to manage your wedding plans</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="label">Email</label>
            <input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" required className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          </div>
          <button disabled={busy} className="btn-primary w-full">{busy ? "Signing in..." : "Sign In"}</button>
        </form>
        <div className="my-5 flex items-center gap-3 text-xs text-stone-400"><span className="h-px flex-1 bg-stone-200" />OR<span className="h-px flex-1 bg-stone-200" /></div>
        <button onClick={google} className="btn-outline w-full">
          <span className="font-bold text-blue-600">G</span> Continue with Google
        </button>
        <p className="mt-6 text-center text-sm text-stone-500">
          New to WedPlan? <Link href="/signup" className="font-semibold text-brand-600 hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
