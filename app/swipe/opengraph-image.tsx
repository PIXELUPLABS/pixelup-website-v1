import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { swipeCreators } from "@/lib/swipe/creators";
import { compactNumber } from "@/lib/swipe/format";
import { swipePosts } from "@/lib/swipe/posts";

// Share image for /swipe. Tool directories scrape og:image for their listing
// thumbnails, and the page's own openGraph metadata stops the root image from
// being inherited, so the route ships its own. Colors are the @theme tokens
// from app/globals.css written out, since ImageResponse can't read CSS vars.
const BASE = "#000000";
const WHITE = "#ffffff";
const MUTED_65 = "rgba(255, 255, 255, 0.65)";
const MUTED_40 = "rgba(255, 255, 255, 0.4)";
const HAIRLINE = "rgba(255, 255, 255, 0.1)";
const ACCENT = "#004aeb";

export const alt =
  "Swipe by PIXELUP LABS: the design swipe file for X and LinkedIn, with a prompt to write your own version of every post.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [regular, medium] = await Promise.all([
    readFile(join(process.cwd(), "app/fonts/InterDisplay-Regular.ttf")),
    readFile(join(process.cwd(), "app/fonts/InterDisplay-Medium.ttf")),
  ]);

  const totalLikes = swipePosts.reduce((sum, post) => sum + post.likes, 0);
  const stats = [
    { value: String(swipeCreators.length), label: "Creators" },
    { value: String(swipePosts.length), label: "Posts" },
    { value: compactNumber(totalLikes), label: "Likes" },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: BASE,
          padding: 40,
          fontFamily: "Inter Display",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: `1px solid ${HAIRLINE}`,
            padding: 56,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
              <span style={{ fontSize: 44, fontWeight: 500, color: WHITE, letterSpacing: "-0.03667em", lineHeight: 1 }}>
                Swipe
              </span>
              <span style={{ width: 10, height: 10, background: ACCENT, marginBottom: 8 }} />
            </div>
            <span style={{ fontSize: 20, fontWeight: 500, color: MUTED_40, letterSpacing: "0.04em" }}>
              BY PIXELUP LABS
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <span
              style={{
                fontSize: 76,
                fontWeight: 500,
                color: WHITE,
                letterSpacing: "-0.03667em",
                lineHeight: 1.02,
                maxWidth: 900,
              }}
            >
              The design swipe file for X and LinkedIn
            </span>
            <span style={{ fontSize: 28, fontWeight: 400, color: MUTED_65, letterSpacing: "-0.02em" }}>
              Open any post to read it in full, then copy a prompt to write your own.
            </span>
          </div>

          <div style={{ display: "flex", borderTop: `1px solid ${HAIRLINE}`, paddingTop: 28, gap: 64 }}>
            {stats.map((stat) => (
              <div key={stat.label} style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                <span style={{ fontSize: 40, fontWeight: 500, color: WHITE, letterSpacing: "-0.03667em" }}>
                  {stat.value}
                </span>
                <span style={{ fontSize: 22, fontWeight: 400, color: MUTED_65 }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter Display", data: regular, style: "normal", weight: 400 },
        { name: "Inter Display", data: medium, style: "normal", weight: 500 },
      ],
    },
  );
}
