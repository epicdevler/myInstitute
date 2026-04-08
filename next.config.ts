import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev: false
  }
};

export default nextConfig;
