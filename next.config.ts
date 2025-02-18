import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@radix-ui/react-alert-dialog", "@radix-ui"],
  // Since Next.js 13, swcMinify is enabled by default and the option can be removed
  // Optionally, you can add more Radix UI packages here if you're using them
};

export default nextConfig;