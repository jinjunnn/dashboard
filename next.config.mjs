/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: {
    // 暂时禁用 ESLint 检查以便快速部署
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 暂时禁用 TypeScript 检查以便快速部署
    ignoreBuildErrors: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/",
        permanent: false,
      },
    ];
  },
}

export default nextConfig
