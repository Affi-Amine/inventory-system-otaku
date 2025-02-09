import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@radix-ui/react-alert-dialog", "@radix-ui"],
  // Optionally, you can add more Radix UI packages here if you're using them
  swcMinify: true,
  // Add any other config options you need
};

export default nextConfig;