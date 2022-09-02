/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["images.unsplash.com"],
  },
  target: "severless",
};

module.exports = nextConfig;
