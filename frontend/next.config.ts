import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disable during builds
    dirs: [], // Disable linting in development
  },
  // ...rest of your config
}

export default nextConfig