import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false,
  },
  async rewrites() {
    return [
      {
        source: '/rubi/:path*',
        destination: 'http://localhost:5178/rubi/:path*',
      },
      {
        source: '/natural-mystic/:path*',
        destination: 'http://localhost:5174/natural-mystic/:path*',
      },
      {
        source: '/aura-fit/:path*',
        destination: 'http://localhost:5175/aura-fit/:path*',
      },
      {
        source: '/vertice-extremo/:path*',
        destination: 'http://localhost:5176/vertice-extremo/:path*',
      },
      {
        source: '/luxe-bite/:path*',
        destination: 'http://localhost:5177/luxe-bite/:path*',
      },
    ];
  },
};

export default nextConfig;
