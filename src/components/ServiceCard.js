"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { CATEGORY_ICONS, money } from "@/lib/constants";

export default function ServiceCard({ service, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.07 }}
      className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={service.images?.[0]} alt={service.serviceName} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold backdrop-blur">
          {CATEGORY_ICONS[service.category]} {service.category}
        </span>
        {service.vendor?.premium && <span className="absolute right-3 top-3 rounded-full bg-gold-500 px-2.5 py-1 text-xs font-bold text-white">★ Premium</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-lg font-semibold">{service.serviceName}</h3>
        <p className="mt-1 text-sm text-stone-500">📍 {service.location} · by {service.vendor?.businessName || service.vendor?.name || "Vendor"}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <p className="font-serif text-xl font-bold text-brand-700">{money(service.price)}</p>
          <Link href={`/services/${service._id}`} className="btn-primary btn-sm">View Details</Link>
        </div>
      </div>
    </motion.div>
  );
}
