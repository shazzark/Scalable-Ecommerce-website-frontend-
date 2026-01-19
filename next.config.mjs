/** @type {import('next').NextConfig} */

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `https://scalable-ecommerce-website-backend.onrender.com/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
