/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["www.olx.com.lb", "apollo-singapore.akamaized.net"],
    unoptimized: true,
  },
}

module.exports = nextConfig
