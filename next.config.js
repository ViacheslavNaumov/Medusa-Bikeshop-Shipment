/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  server: {
    host: '0.0.0.0',
    allowedHosts: ['work-2-jafetlshqwpgxbpj.prod-runtime.all-hands.dev', 'app.all-hands.dev'],
  },
  images: {
    domains: [
      "medusa-public-images.s3.eu-west-1.amazonaws.com",
      "localhost",
      "work-1-jafetlshqwpgxbpj.prod-runtime.all-hands.dev",
      "work-2-jafetlshqwpgxbpj.prod-runtime.all-hands.dev",
    ],
  },
  transpilePackages: ["@medusajs/ui", "@medusajs/icons"],
}

module.exports = nextConfig
