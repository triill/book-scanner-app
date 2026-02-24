import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [], // Book cover URLs (e.g. from Amazon/Goodreads) use unoptimized Image
  },
};

export default nextConfig;
