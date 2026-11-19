const items = [
  { icon: "✅", title: "Reviewed Vendors", text: "Every service is checked by an admin before it appears on the site." },
  { icon: "💰", title: "Clear Pricing", text: "See prices up front and compare vendors by category and location." },
  { icon: "📅", title: "Easy Booking", text: "Send a booking request with your date and venue in a few clicks." },
  { icon: "📊", title: "Track Everything", text: "Follow every request from your own dashboard in real time." },
];

export default function WhyChoose() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-center font-serif text-3xl font-bold md:text-4xl">Why Choose WedPlan?</h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-stone-600">
        One place to find trusted wedding vendors and manage every request.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.title} className="rounded-2xl border border-rose-100 bg-white p-6 text-center shadow-sm">
            <div className="text-4xl">{it.icon}</div>
            <h3 className="mt-4 font-semibold">{it.title}</h3>
            <p className="mt-2 text-sm text-stone-600">{it.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}