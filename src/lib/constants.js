export const CATEGORIES = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];
export const CATEGORY_ICONS = { "Photography & Videography": "📸", "Wedding Venues": "🏰", "Decoration & Florist": "💐", "Catering Services": "🍽️", "Makeup & Styling": "💄", "Wedding Fashion": "👗" };
export const money = (n) => `$${Number(n || 0).toLocaleString()}`;
export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—");
