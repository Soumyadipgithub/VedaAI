/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@veda/shared-types"],
  experimental: {
    typedRoutes: false,
  },
};

export default nextConfig;
