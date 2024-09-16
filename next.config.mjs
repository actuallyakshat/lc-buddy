/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["pexels.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.pexels.com",
      },
    ],
  },
};

export default nextConfig;
