import type { Metadata } from "next";
import { Geist_Mono, Instrument_Sans } from "next/font/google";
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

// Geist Mono backs the small uppercase meta labels (homepage card services/year).
// Only 500 is used, so we pin that single static instance instead of pulling the
// full variable axis. Note the variable name: unlike --font-display/--font-button
// (custom Tailwind theme keys), --font-mono is a Tailwind v4 *built-in* key, so
// next/font gets its own --font-geist-mono and app/globals.css points --font-mono
// at it — self-referencing a built-in key inside @theme would be circular.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["500"],
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
      className={`${interDisplay.variable} ${instrumentSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-base font-display text-white">
        {/* These <Script>s live inside <body> per the next/script docs — as
            direct children of <html> they're invalid DOM nesting, which
            React 19 rejects ("<script> cannot be a child of <html>") and
            which risks hydration errors. Placement doesn't change behavior:
            beforeInteractive is always injected into the served <head>
            regardless of where the component sits, so the datafast script
            still lands there. Only valid in the root layout. */}
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
        <DisableImageDrag />
        {/* Caps the site at 1800px and centers it — on very large monitors the
            page was stretching edge-to-edge, which broke the intended layout
            proportions. Only binds above 1800px; no effect at smaller sizes.
            The hairline side borders only kick in past that same breakpoint
            (min-[1800px]:) — below it the div already spans the full
            viewport, so a border there would just be a stray line glued to
            the screen edge instead of framing the centered column. */}
        <div className="mx-auto max-w-[1800px] min-[1800px]:border-x-[0.5px] min-[1800px]:border-hairline">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
