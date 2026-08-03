import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 78 is used for the full-bleed hero photos (best size/quality trade-off
    // for large background images); 75 is next/image's default elsewhere.
    qualities: [75, 78],
  },
};

export default nextConfig;
