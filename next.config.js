import withBundleAnalyzer from '@next/bundle-analyzer'

const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}

module.exports = withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })(nextConfig)
