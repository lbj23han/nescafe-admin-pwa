import type { NextConfig } from "next";
import withPWA from "next-pwa";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactCompiler: true,
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  // 개발 모드에서는 PWA 비활성화
  disable: !isProd,
})(nextConfig);
