import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="container-x flex flex-col items-center py-28 text-center">
      <p className="text-6xl">💔</p>
      <h1 className="mt-4 text-4xl font-bold">404 — Page not found</h1>
      <p className="mt-2 text-stone-500">The page you are looking for doesn&apos;t exist or has moved.</p>
      <Link href="/" className="btn-primary mt-6">Back to Home</Link>
    </div>
  );
}
