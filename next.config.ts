import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Prevent Next.js from bundling native Node.js modules
  serverExternalPackages: ["better-sqlite3", "bcryptjs"],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.githubusercontent.com' },
      { protocol: 'https', hostname: '**.cloudinary.com' },
    ],
  },
  turbopack: {
    // Fix workspace root detection — point to the project root
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
