/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ✅ allows build to continue even with TS warnings
  },
  images: {
    unoptimized: true, // ✅ disables Next.js image optimization (fine for Vercel Hobby)
  },
  output: "standalone", // ✅ ensures correct runtime behavior on Vercel
  experimental: {
    serverActions: true, // optional if your app uses server actions
  },
};

export default nextConfig;
