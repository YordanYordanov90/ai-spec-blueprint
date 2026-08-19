import type { NextConfig } from "next";

import { AI_MAX_REQUEST_BYTES } from "./src/lib/ai/limits";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: AI_MAX_REQUEST_BYTES,
    },
  },
};

export default nextConfig;
