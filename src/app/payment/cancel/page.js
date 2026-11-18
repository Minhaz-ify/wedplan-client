import Link from "next/link";

export const metadata = { title: "Payment cancelled" };

export default function Page() {
  return (
    <div className="container-x flex justify-center py-20">
      <div className="card max-w-md p-10 text-center">
        <p className="text-6xl">🛑</p>
        <h1 className="mt-4 text-2xl font-bold">Payment cancelled</h1>
        <p className="mt-2 text-stone-500">You were not charged. You can upgrade any time.</p>
        <Link href="/dashboard/vendor/subscription" className="btn-primary mt-6">Back to Subscription</Link>
      </div>
    </div>
  );
}
