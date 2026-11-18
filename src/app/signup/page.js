"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { resetToken, uploadImage } from "@/lib/api";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer", businessName: "" });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    else if (!/[a-z]/.test(form.password) || !/[A-Z]/.test(form.password)) e.password = "Password needs an uppercase and a lowercase letter";
    if (form.role === "vendor" && !form.businessName.trim()) e.businessName = "Business name is required for vendors";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try {
      const image = file ? await uploadImage(file) : undefined;
      const { error } = await authClient.signUp.email({
        name: form.name.trim(), email: form.email, password: form.password, image,
        role: form.role, businessName: form.role === "vendor" ? form.businessName.trim() : undefined,
      });
      if (error) throw new Error(error.message || "Could not create account");
      resetToken();
      toast.success("Account created!");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" });
    if (error) toast.error(error.message || "Google sign-up failed");
  };

  const Err = ({ k }) => (errors[k] ? <p className="mt-1 text-xs text-red-600">{errors[k]}</p> : null);

  return (
    <div className="container-x flex justify-center py-12">
      <div className="card w-full max-w-lg p-8">
        <h1 className="text-center text-3xl font-bold">Create your account</h1>
        <p className="mt-1 text-center text-sm text-stone-500">Join WedPlan as a customer or a vendor</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {[["customer", "💑 Customer", "Book wedding services"], ["vendor", "🏪 Vendor", "List & sell services"]].map(([v, t, d]) => (
            <button type="button" key={v} onClick={() => setForm({ ...form, role: v })}
              className={`rounded-xl border-2 p-3 text-left transition ${form.role === v ? "border-brand-500 bg-brand-50" : "border-stone-200 hover:border-brand-200"}`}>
              <p className="font-semibold">{t}</p>
              <p className="text-xs text-stone-500">{d}</p>
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
          <div><label className="label">Full name</label><input className="input" value={form.name} onChange={set("name")} /><Err k="name" /></div>
          <div><label className="label">Email</label><input type="email" className="input" value={form.email} onChange={set("email")} /><Err k="email" /></div>
          {form.role === "vendor" && (
            <div><label className="label">Business name</label><input className="input" value={form.businessName} onChange={set("businessName")} /><Err k="businessName" /></div>
          )}
          <div><label className="label">Password</label><input type="password" className="input" value={form.password} onChange={set("password")} /><Err k="password" /></div>
          <div>
            <label className="label">Profile photo <span className="font-normal text-stone-400">(optional)</span></label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:font-semibold file:text-brand-700" />
          </div>
          <button disabled={busy} className="btn-primary w-full">{busy ? "Creating account..." : "Sign Up"}</button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-stone-400"><span className="h-px flex-1 bg-stone-200" />OR<span className="h-px flex-1 bg-stone-200" /></div>
        <button onClick={google} className="btn-outline w-full"><span className="font-bold text-blue-600">G</span> Sign up with Google (as Customer)</button>
        <p className="mt-6 text-center text-sm text-stone-500">Already have an account? <Link href="/signin" className="font-semibold text-brand-600 hover:underline">Sign in</Link></p>
      </div>
    </div>
  );
}
