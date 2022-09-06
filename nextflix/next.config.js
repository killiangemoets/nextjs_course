/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // optimizeFonts: false,
  images: {
    domains: ["images.unsplash.com", "i.ytimg.com"],
  },
};

module.exports = nextConfig;
