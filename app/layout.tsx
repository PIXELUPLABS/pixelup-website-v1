import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { DisableImageDrag } from "@/components/DisableImageDrag";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

// Inter Display — the real display face from the original Framer site,
// self-hosted (not on Google Fonts). Only 400/500 are used; the sole 600
// on the page (button labels) is Instrument Sans.
const interDisplay = localFont({
  variable: "--font-display",
  src: [
    { path: "./fonts/InterDisplay-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/InterDisplay-Medium.ttf", weight: "500", style: "normal" },
  ],
  display: "swap",
});

// Instrument Sans is used only for button labels.
const instrumentSans = Instrument_Sans({
  variable: "--font-button",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  // www is the canonical host: Vercel 308-redirects the apex to www, so every
  // absolute URL we emit (canonicals, og:url, sitemap, JSON-LD) must match it.
  // Pointing these at the apex made canonicals resolve to a redirect, which
  // Google discards — that split GSC reporting across both hosts.
  metadataBase: new URL("https://www.pixeluplabs.com"),
  title: "PIXELUP LABS - Premium Brands and Websites",
  description:
    "We build brands, websites and products that command enterprise trust.",
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${interDisplay.variable} ${instrumentSans.variable} h-full antialiased`}
    >
      {/* beforeInteractive is the only next/script strategy Next.js injects
          into the initial HTML <head> — required here since the request was
          for this script to live in <head>, not just load early. Only valid
          in the root layout. */}
      <Script
        defer
        data-website-id="dfid_swcipYZ3Rc55HGLL1A7A4"
        data-domain="pixeluplabs.com"
        src="https://datafa.st/js/script.js"
        strategy="beforeInteractive"
      />
      {/* Google Analytics (gtag.js) — afterInteractive is Next.js's own
          documented pattern for GA: it doesn't need to block the initial
          render like the head-scoped script above does. */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-M4JV6HF683"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-M4JV6HF683');
        `}
      </Script>
      <body className="min-h-full bg-base font-display text-white">
        <DisableImageDrag />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
