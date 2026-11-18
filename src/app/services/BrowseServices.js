"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApi } from "@/lib/hooks";
import { CATEGORIES } from "@/lib/constants";
import ServiceCard from "@/components/ServiceCard";
import { Loader, Empty, ErrorBox } from "@/components/Ui";

export default function BrowseServices() {
  const sp = useSearchParams();
  const [q, setQ] = useState("");
  const [dq, setDq] = useState("");
  const [location, setLocation] = useState("");
  const [dLoc, setDLoc] = useState("");
  const [category, setCategory] = useState(sp.get("category") || "");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  // debounce text inputs
  useEffect(() => { const t = setTimeout(() => { setDq(q); setDLoc(location); setPage(1); }, 400); return () => clearTimeout(t); }, [q, location]);

  const params = new URLSearchParams({ page, limit: 9 });
  if (dq) params.set("q", dq);
  if (dLoc) params.set("location", dLoc);
  if (category) params.set("category", category);
  if (sort) params.set("sort", sort);
  const { data, loading, error, reload } = useApi(`/api/services?${params}`, { auth: false });

  const reset = () => { setQ(""); setLocation(""); setCategory(""); setSort(""); setPage(1); };

  return (
    <div className="container-x py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Browse Wedding Services</h1>
        <p className="mt-2 text-stone-500">Search, filter and sort to find your perfect match.</p>
      </div>

      <div className="card mb-8 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
        <input className="input lg:col-span-2" placeholder="🔍 Search by service name..." value={q} onChange={(e) => setQ(e.target.value)} />
        <input className="input" placeholder="📍 Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <select className="input" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="input" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
          <option value="">Newest first</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {loading ? <Loader label="Finding services..." /> : error ? <ErrorBox error={error} onRetry={reload} /> : !data.items.length ? (
        <div className="space-y-4 text-center">
          <Empty title="No services match your search" text="Try different keywords, or clear the filters." />
          <button onClick={reset} className="btn-outline">Clear filters</button>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-stone-500">{data.total} service{data.total !== 1 && "s"} found</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.items.map((s, i) => <ServiceCard key={s._id} service={s} index={i} />)}</div>
          {data.pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn-outline btn-sm">← Prev</button>
              <span className="text-sm text-stone-600">Page {data.page} of {data.pages}</span>
              <button disabled={page >= data.pages} onClick={() => setPage(page + 1)} className="btn-outline btn-sm">Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
