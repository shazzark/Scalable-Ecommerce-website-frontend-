/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

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
        hostname: "**", // Allow all HTTPS domains
        pathname: "/img/products/**",
      },
      // Add your backend domain (if deployed)
      {
        protocol: "https",
        hostname: "your-backend.onrender.com", // Replace with your actual backend URL
        pathname: "/img/products/**",
      },
    ],
    unoptimized: true, // Disable Next.js image optimization for external images
  },

  // Remove rewrites if backend is deployed separately
  // async rewrites() {
  //   // Only use rewrites in development
  //   if (process.env.NODE_ENV === "development") {
  //     return [
  //       {
  //         source: "/api/:path*",
  //         destination: "http://localhost:5000/api/v1/:path*",
  //       },
  //     ];
  //   }
  //   return []; // No rewrites in production
  // },

  // Add environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
