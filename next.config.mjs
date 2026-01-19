/** @type {import('next').NextConfig} */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const nextConfig = {
  images: {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "scalable-ecommerce-website-backend-api.onrender.com",
          port: "", // empty for standard https
          pathname: "/img/products/**",
        },
      ],
    },
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
