import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const nextConfig = {
  webpack: (config: any) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
  // CRITICAL: Add allowedDevOrigins at the root level
  allowedDevOrigins: ["167.86.118.9:8080", "167.86.118.9", "localhost:8080", "localhost"],

  // Allow Server Actions
  experimental: {
    serverActions: {
      allowedOrigins: ["167.86.118.9:8080", "167.86.118.9", "localhost:8080", "localhost"],
    },
  },

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: "http://backend:9000/api/:path*", // Proxy to backend
        },
      ],
    };
  },

  // CORS headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
