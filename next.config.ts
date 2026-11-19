import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  // Netlify builds are the tester preview (*.netlify.app). netlify.toml marks
  // static files noindex; pages come from the Next.js server, so they get the
  // header here. Remove both if Netlify ever serves lvbeautyworld.de.
  async headers() {
    if (process.env.NETLIFY !== "true") return [];
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
