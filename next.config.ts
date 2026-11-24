import type { NextConfig } from "next";
import { SECURITY_HEADERS } from "./lib/security/headers";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  experimental: {
    // Equipment photos are uploaded through a Server Action, whose body limit
    // defaults to 1 MB — below a typical phone photo. Keep this above
    // MAX_PHOTO_BYTES (lib/schemas/equipment.ts) plus multipart overhead.
    serverActions: { bodySizeLimit: "10mb" },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
