/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@neurao/shared'],
  agentRules: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
