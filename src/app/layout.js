import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const serif = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: { default: "WedPlan — Plan your perfect wedding", template: "%s | WedPlan" },
  description: "Browse and book trusted wedding vendors: photographers, venues, florists, caterers, makeup artists and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <Navbar />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
        <Toaster position="top-center" toastOptions={{ duration: 3500 }} />
      </body>
    </html>
  );
}
