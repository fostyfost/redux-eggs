// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    domains: ['pics.avs.io'],
  },
  reactStrictMode: true,
  // TODO: WIP
  experimental: {
    swcFileReading: false,
    esmExternals: false,
  },
}

module.exports = withBundleAnalyzer(nextConfig)
