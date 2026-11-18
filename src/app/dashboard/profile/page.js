"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { api, uploadImage } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { Loader, ErrorBox, PageTitle, Avatar, StatusBadge } from "@/components/Ui";

export default function Page() {
  const { refetch } = authClient.useSession();
  const { data: me, loading, error, reload } = useApi("/api/me");
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [image, setImage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (me) { setName(me.name || ""); setBusinessName(me.businessName || ""); setImage(me.image || ""); }
  }, [me]);

  const pick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try { setImage(await uploadImage(file)); toast.success("Photo uploaded — remember to save"); }
    catch (err) { toast.error(err.message); }
    finally { setBusy(false); }
  };

  const save = async (e) => {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error("Name must be at least 2 characters");
    setBusy(true);
    try {
      await api("/api/me", { method: "PATCH", body: { name, image, ...(me.role === "vendor" && { businessName }) } });
      await refetch?.();
      toast.success("Profile updated");
      reload();
    } catch (err) { toast.error(err.message); }
    finally { setBusy(false); }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorBox error={error} onRetry={reload} />;

  return (
    <>
      <PageTitle title="Profile Settings" />
      <form onSubmit={save} className="card max-w-xl space-y-5 p-6">
        <div className="flex items-center gap-4">
          <Avatar user={{ name, image }} size={72} />
          <label className="btn-outline btn-sm cursor-pointer">Change photo<input type="file" accept="image/*" hidden onChange={pick} /></label>
        </div>
        <div><label className="label">Full name</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} required /></div>
        <div><label className="label">Email</label><input className="input bg-stone-50" value={me.email} disabled /></div>
        {me.role === "vendor" && (
          <div><label className="label">Business name</label><input className="input" value={businessName} onChange={(e) => setBusinessName(e.target.value)} /></div>
        )}
        <div className="flex items-center gap-2 text-sm text-stone-500">Role: <StatusBadge status={me.role === "vendor" ? "premium" : "free"} /><span className="capitalize">{me.role}</span></div>
        <button disabled={busy} className="btn-primary">{busy ? "Saving..." : "Save Changes"}</button>
      </form>
    </>
  );
}
