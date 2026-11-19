import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-stone-200 bg-white">
      <div className="container-x grid gap-8 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="font-serif text-2xl font-bold text-brand-700">Wed<span className="text-gold-500">Plan</span> 💍</p>
          <p className="mt-3 max-w-xs text-sm text-stone-500">Discover and book trusted photographers, venues, florists, caterers and more for your perfect day.</p>
        </div>
        <div>
          <p className="font-semibold">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-stone-600">
            <li><Link href="/services" className="hover:text-brand-600">Browse Services</Link></li>
            <li><Link href="/signup" className="hover:text-brand-600">Become a Vendor</Link></li>
            <li><Link href="/signin" className="hover:text-brand-600">Sign In</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-stone-600">
            <li>✉️ minhajabc23@gmail.com</li>
            <li>📞 +880 1885-221084</li>
            <li>📍 Chattogram, Bangladesh</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">Follow us</p>
          <ul className="mt-3 space-y-2 text-sm text-stone-600">
            <li><a href="https://www.instagram.com/minhazify" target="_blank" rel="noopener noreferrer" className="hover:text-brand-600">Instagram</a></li>
            <li><a href="https://www.linkedin.com/in/minhazify/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-600">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-stone-100 py-4 text-center text-xs text-stone-400">© {new Date().getFullYear()} WedPlan. All rights reserved.</p>
    </footer>
  );
}