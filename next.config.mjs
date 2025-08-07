/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'unpkg.com',
      },
      {
        protocol: 'https',
        hostname: 'tile.openstreetmap.org',
      },
      {
        protocol: 'https',
        hostname: 'assets.example.com', // Example for remote images
      },
      {
        protocol: 'https',
        hostname: 'blob.v0.dev', // Allow images from v0 blob storage
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
