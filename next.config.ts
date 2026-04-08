import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/natural-mystic/:path*',
        destination: 'http://localhost:5174/:path*',
      },
      {
        source: '/aura-fit/:path*',
        destination: 'http://localhost:5175/:path*',
      },
      {
        source: '/vertice-extremo/:path*',
        destination: 'http://localhost:5176/:path*',
      },
    ];
  },
};

export default nextConfig;
