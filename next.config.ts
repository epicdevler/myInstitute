import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
  reactCompiler: true,

  compiler: {removeConsole: process.env.NODE_ENV == "production"},
  experimental: {
    turbopackFileSystemCacheForDev: false,
  }
};

export default nextConfig;
