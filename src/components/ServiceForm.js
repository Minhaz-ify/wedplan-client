"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api, uploadImage } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";

export default function ServiceForm({ initial }) {
  const router = useRouter();
  const editing = Boolean(initial?._id);
  const [f, setF] = useState({
    serviceName: initial?.serviceName || "", category: initial?.category || CATEGORIES[0],
    price: initial?.price ?? "", location: initial?.location || "", description: initial?.description || "",
  });
  const [images, setImages] = useState(initial?.images || []);
  const [busy, setBusy] = useState(false);
  const [limit, setLimit] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const addFiles = async (e) => {
    const files = [...(e.target.files || [])].slice(0, 6 - images.length);
    if (!files.length) return;
    setBusy(true);
    try {
      const urls = await Promise.all(files.map(uploadImage));
      setImages((p) => [...p, ...urls]);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (f.serviceName.trim().length < 3) return toast.error("Service name must be at least 3 characters");
    if (!(Number(f.price) > 0)) return toast.error("Enter a valid price");
    if (f.description.trim().length < 20) return toast.error("Description must be at least 20 characters");
    if (!images.length) return toast.error("Upload at least one image");
    setBusy(true);
    try {
      const body = { ...f, price: Number(f.price), images };
      await api(editing ? `/api/vendor/services/${initial._id}` : "/api/vendor/services", { method: editing ? "PUT" : "POST", body });
      toast.success(editing ? "Service updated" : "Service submitted for approval");
      router.push("/dashboard/vendor/services");
    } catch (err) {
      if (err.code === "LIMIT") setLimit(true);
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card max-w-3xl space-y-5 p-6">
      {limit && (
        <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          Free plan limit reached. <a href="/dashboard/vendor/subscription" className="font-semibold underline">Upgrade to Premium</a> for unlimited services.
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><label className="label">Service name</label><input className="input" value={f.serviceName} onChange={set("serviceName")} required /></div>
        <div><label className="label">Category</label><select className="input" value={f.category} onChange={set("category")}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
        <div><label className="label">Price (USD)</label><input type="number" min="1" step="any" className="input" value={f.price} onChange={set("price")} required /></div>
        <div className="sm:col-span-2"><label className="label">Location</label><input className="input" value={f.location} onChange={set("location")} required /></div>
        <div className="sm:col-span-2"><label className="label">Description</label><textarea rows={5} className="input" value={f.description} onChange={set("description")} required /></div>
      </div>
      <div>
        <label className="label">Images (up to 6)</label>
        <div className="flex flex-wrap gap-3">
          {images.map((u, i) => (
            <div key={u} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="" className="h-24 w-32 rounded-xl object-cover" />
              <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))} className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-600 text-xs text-white" aria-label="Remove">×</button>
            </div>
          ))}
          {images.length < 6 && (
            <label className="flex h-24 w-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 text-xs text-stone-500 hover:border-brand-400">
              <span className="text-2xl">＋</span>{busy ? "Uploading..." : "Add images"}
              <input type="file" accept="image/*" multiple hidden onChange={addFiles} />
            </label>
          )}
        </div>
      </div>
      <div className="flex gap-3">
        <button disabled={busy} className="btn-primary">{busy ? "Please wait..." : editing ? "Save Changes" : "Submit Service"}</button>
        <button type="button" onClick={() => router.back()} className="btn-outline">Cancel</button>
      </div>
    </form>
  );
}
