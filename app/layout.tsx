import type { Metadata } from "next";
import { Inter, Instrument_Sans } from "next/font/google";
import "./globals.css";

// Inter stands in for Framer's "Inter Display" (all display + body text).
const inter = Inter({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
      className={`${inter.variable} ${instrumentSans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-base font-display text-white">
        {children}
      </body>
    </html>
  );
}
