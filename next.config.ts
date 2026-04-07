import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Prevent Next.js from bundling native Node.js modules
  serverExternalPackages: ["better-sqlite3", "bcryptjs"],
  turbopack: {
    // Fix workspace root detection — point to the project root
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
