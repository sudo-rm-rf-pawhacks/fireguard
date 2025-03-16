import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Ensures static export if you don’t use server functions
  trailingSlash: true, // Helps with some static route issues
};

export default nextConfig;
