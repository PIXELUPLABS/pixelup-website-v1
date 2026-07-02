import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import localFont from "next/font/local";
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
  metadataBase: new URL("https://pixeluplabs.com"),
  title: "PIXELUP LABS - Premium Brands and Websites",
  description:
    "We build brands, websites and products that command enterprise trust.",
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
      <body className="min-h-full bg-base font-display text-white">
        {/* Site-wide content clamp: background stays full-bleed, content stops growing at 1920px. */}
        <div className="mx-auto w-full max-w-[1920px]">{children}</div>
      </body>
    </html>
  );
}
