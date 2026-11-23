"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { money } from "@/lib/constants";
import { Loader, ErrorBox, Avatar } from "@/components/Ui";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function ServiceDetails() {
  const { id } = useParams();
  const { data: session } = authClient.useSession();
  const role = session?.user?.role;

  const { data: s, loading, error, reload } = useApi(
    `/api/services/${id}`
  );

  const [img, setImg] = useState(0);
  const [form, setForm] = useState({
    eventDate: "",
    eventLocation: "",
    message: "",
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  // Dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (loading) return <Loader />;

  if (error)
    return (
      <div className="container-x py-16 text-center">
        <ErrorBox
          error={
            error.status === 404
              ? new Error(
                  "This service was not found or is no longer available."
                )
              : error
          }
          onRetry={error.status === 404 ? undefined : reload}
        />

        <Link href="/services" className="btn-outline mt-6">
          ← Back to services
        </Link>
      </div>
    );

  const own = s.vendorId === session?.user?.id;
  const today = new Date().toISOString().slice(0, 10);

  // Validate form and open confirmation dialog
  const book = (e) => {
    e.preventDefault();

    if (!form.eventDate || !form.eventLocation.trim()) {
      return toast.error("Event date and location are required");
    }

    setConfirmOpen(true);
  };

  // Send booking request after confirmation
  const confirmBooking = async () => {
    setBusy(true);

    try {
      await api("/api/bookings", {
        method: "POST",
        body: { serviceId: s._id, ...form },
      });

      toast.success("Booking request sent!");
      setDone(true);
      setConfirmOpen(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-x py-10">
      <Link
        href="/services"
        className="text-sm text-stone-500 hover:text-brand-600"
      >
        ← Back to services
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="card overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.images[img]}
              alt={s.serviceName}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>

          {s.images.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto">
              {s.images.map((u, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={u + i}
                  src={u}
                  alt=""
                  onClick={() => setImg(i)}
                  className={`h-20 w-28 shrink-0 cursor-pointer rounded-xl object-cover ${
                    i === img
                      ? "ring-2 ring-brand-500"
                      : "opacity-70 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          )}

          <div className="mt-6">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              {s.category}
            </span>

            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
              {s.serviceName}
            </h1>

            <p className="mt-2 text-stone-500">
              📍 {s.location}
            </p>

            <h2 className="mt-6 text-xl font-semibold">
              About this service
            </h2>

            <p className="mt-2 whitespace-pre-line leading-relaxed text-stone-600">
              {s.description}
            </p>
          </div>
        </div>

        <aside className="space-y-5 lg:col-span-2">
          <div className="card p-6">
            <p className="text-sm text-stone-500">
              Starting price
            </p>

            <p className="font-serif text-4xl font-bold text-brand-700">
              {money(s.price)}
            </p>

            <div className="mt-5 flex items-center gap-3 border-t border-stone-100 pt-5">
              <Avatar user={s.vendor} size={44} />

              <div>
                <p className="font-semibold">
                  {s.vendor?.businessName || s.vendor?.name}
                </p>

                <p className="text-xs text-stone-500">
                  {s.vendor?.premium
                    ? "★ Premium vendor"
                    : "Vendor"}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold">
              Request a booking
            </h2>

            {done ? (
              <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
                Your request was sent. Track it in{" "}
                <Link
                  href="/dashboard/customer/bookings"
                  className="font-semibold underline"
                >
                  My Bookings
                </Link>.
              </div>
            ) : role !== "customer" ? (
              <p className="mt-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                {own
                  ? "This is your own service, so you can't book it."
                  : "Only customer accounts can send booking requests."}
              </p>
            ) : (
              <form onSubmit={book} className="mt-4 space-y-3">
                <div>
                  <label className="label">Event date</label>

                  <input
                    type="date"
                    min={today}
                    required
                    className="input"
                    value={form.eventDate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        eventDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="label">Event location</label>

                  <input
                    required
                    className="input"
                    value={form.eventLocation}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        eventLocation: e.target.value,
                      })
                    }
                    placeholder="Venue / city"
                  />
                </div>

                <div>
                  <label className="label">
                    Message{" "}
                    <span className="font-normal text-stone-400">
                      (optional)
                    </span>
                  </label>

                  <textarea
                    rows={3}
                    maxLength={1000}
                    className="input"
                    value={form.message}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        message: e.target.value,
                      })
                    }
                    placeholder="Tell the vendor about your day..."
                  />
                </div>

                <button
                  disabled={busy}
                  className="btn-primary w-full"
                >
                  Send Booking Request
                </button>
              </form>
            )}
          </div>
        </aside>
      </div>

      {/* Booking Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Booking</DialogTitle>

            <DialogDescription>
              Please review your booking details before sending
              the request.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 rounded-xl bg-stone-50 p-4 text-sm">
            <div>
              <p className="text-stone-500">Service</p>
              <p className="font-semibold text-stone-900">
                {s.serviceName}
              </p>
            </div>

            <div>
              <p className="text-stone-500">Event date</p>
              <p className="font-semibold text-stone-900">
                {form.eventDate}
              </p>
            </div>

            <div>
              <p className="text-stone-500">Event location</p>
              <p className="font-semibold text-stone-900">
                {form.eventLocation}
              </p>
            </div>

            {form.message && (
              <div>
                <p className="text-stone-500">Message</p>
                <p className="font-semibold text-stone-900">
                  {form.message}
                </p>
              </div>
            )}

            <div className="border-t border-stone-200 pt-3">
              <p className="text-stone-500">Starting price</p>
              <p className="text-lg font-bold text-brand-700">
                {money(s.price)}
              </p>
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              className="btn-outline"
              disabled={busy}
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn-primary"
              disabled={busy}
              onClick={confirmBooking}
            >
              {busy ? "Sending..." : "Confirm Booking"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}