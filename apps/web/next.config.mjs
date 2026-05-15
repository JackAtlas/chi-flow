import createNextIntlPlugin from 'next-intl/plugin'

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@workspace/ui'],
  experimental: {
    trustHostHeader: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/9.x/avataaars-neutral/webp'
      }
    ]
  }
}

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
