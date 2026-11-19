"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useApi } from "@/lib/hooks";
import { CATEGORIES, CATEGORY_ICONS } from "@/lib/constants";
import ServiceCard from "@/components/ServiceCard";
import { Loader, Empty, ErrorBox } from "@/components/Ui";
import WhyChoose from "@/components/WhyChoose";

const fade = { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

export default function Home() {
  const { data, loading, error, reload } = useApi("/api/services?limit=6", { auth: false });

  return (
    <>
      <section
        className="relative flex min-h-[78vh] items-center bg-stone-900 bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(110deg, rgba(60,10,25,.82), rgba(0,0,0,.35)), url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=70')" }}
      >
        <div className="container-x">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl text-white">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-gold-400">Your wedding, beautifully planned</p>
            <h1 className="text-4xl font-bold leading-tight sm:text-6xl">Find every vendor for your perfect day</h1>
            <p className="mt-5 max-w-xl text-lg text-white/85">Compare photographers, venues, florists, caterers and stylists — then send a booking request in minutes.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/services" className="btn-primary px-7 py-3">Explore Wedding Services</Link>
              <Link href="/signup" className="btn bg-white/15 px-7 py-3 text-white backdrop-blur hover:bg-white/25">Join as Vendor</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container-x py-20">
        <motion.div {...fade} className="mb-10 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Featured Services</h2>
          <p className="mt-2 text-stone-500">Hand-picked, admin-approved vendors ready for your date.</p>
        </motion.div>
        {loading ? <Loader /> : error ? <ErrorBox error={error} onRetry={reload} /> : !data?.items?.length ? (
          <Empty title="No services yet" text="Approved services will appear here." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.items.map((s, i) => <ServiceCard key={s._id} service={s} index={i} />)}</div>
        )}
        <div className="mt-10 text-center"><Link href="/services" className="btn-outline">View all services →</Link></div>
      </section>

      <section className="bg-brand-50 py-20">
        <div className="container-x">
          <motion.div {...fade} className="mb-10 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Browse by Category</h2>
          </motion.div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map((c, i) => (
              <motion.div key={c} {...fade} transition={{ duration: 0.4, delay: i * 0.06 }}>
                <Link href={`/services?category=${encodeURIComponent(c)}`} className="card flex h-full flex-col items-center gap-3 p-5 text-center transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-md">
                  <span className="text-4xl">{CATEGORY_ICONS[c]}</span>
                  <span className="text-sm font-semibold">{c}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WhyChoose />

      <section className="container-x py-20">
        <motion.h2 {...fade} className="mb-10 text-center text-3xl font-bold sm:text-4xl">How WedPlan Works</motion.h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[["1", "Discover", "Search by category, location and price to shortlist vendors you love."], ["2", "Request", "Send a booking request with your date, venue and a personal message."], ["3", "Celebrate", "Track responses from your dashboard and lock in your dream team."]].map(([n, t, d], i) => (
            <motion.div key={n} {...fade} transition={{ duration: 0.45, delay: i * 0.1 }} className="card p-7 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 font-serif text-xl font-bold text-white">{n}</div>
              <h3 className="mt-4 text-xl font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-stone-500">{d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container-x pb-4">
        <motion.div {...fade} className="rounded-3xl bg-gradient-to-r from-brand-700 to-brand-500 px-8 py-14 text-center text-white">
          <h2 className="text-3xl font-bold">Are you a wedding professional?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">List your services for free, reach couples across the country and upgrade to Premium for unlimited listings.</p>
          <Link href="/signup" className="btn mt-6 bg-white px-7 py-3 text-brand-700 hover:bg-brand-50">Start Selling</Link>
        </motion.div>
      </section>
    </>
  );
}