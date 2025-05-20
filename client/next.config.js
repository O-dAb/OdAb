/** @type {import('next').NextConfig} */
const nextConfig = {

  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 메모리 사용량 줄이기 위한 설정
  experimental: {
    largePageDataBytes: 128 * 1000, // 기본값 보다 작게 설정
  },
  // 청크 최적화 설정
  webpack: (config) => {
    // 불필요한 것들 제외
    if (!config.isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'fs': false,
        'path': false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;