import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ThemeScript } from "@/components/ThemeScript";
import { cormorant, manrope } from "@/lib/fonts";
import { site } from "@/lib/site";
import { getActiveSkin, resolveEffects } from "@/skins";
import "./globals.css";

const skin = getActiveSkin();
const effects = resolveEffects(skin);

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: "Schönheitssalon in Dortmund-Hörde.",
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/brand/favicon.ico" },
    ],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f3f4" },
    { media: "(prefers-color-scheme: dark)", color: "#070708" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="de"
      data-skin={skin.id}
      data-photo={effects.photoGrayscale ? "mono" : "color"}
      data-book={effects.bookHover ? "on" : "off"}
      data-reveal={effects.reveal ? "on" : "off"}
      suppressHydrationWarning
    >
      {/*
        The theme script opens <body> instead of sitting in <head>: hosts edit
        <head> (Netlify adds a newline and a comment after the charset meta),
        and React fails to hydrate past a stray text node there. The failed
        hydration re-renders the page and wipes the attributes this script set
        on <html> (data-svc, .js), which left every service panel open. It
        still runs before any content is parsed, so the theme does not flash.
      */}
      <body className={`${manrope.variable} ${cormorant.variable} antialiased`}>
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}
