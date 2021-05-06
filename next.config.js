// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  images: {
    domains: ['pics.avs.io'],
  },
  reactStrictMode: true,
  future: {
    webpack5: true,
  },
}

module.exports = withBundleAnalyzer(nextConfig)
