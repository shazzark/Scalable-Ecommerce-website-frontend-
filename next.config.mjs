/** @type {import('next').NextConfig} */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/img/products/**",
      },
      {
        protocol: "https",
        hostname: "scalable-ecommerce-website-backend.onrender.com",
        pathname: "/img/products/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
