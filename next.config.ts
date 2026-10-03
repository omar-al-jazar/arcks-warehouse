import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    // Equipment photos are uploaded through a Server Action, whose body limit
    // defaults to 1 MB — below a typical phone photo. Keep this above
    // MAX_PHOTO_BYTES (lib/schemas/equipment.ts) plus multipart overhead.
    serverActions: { bodySizeLimit: "10mb" },
  },
};

export default nextConfig;
