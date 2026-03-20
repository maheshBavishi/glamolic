/** @type {import('next').NextConfig} */
const remoteImagePatterns = [
  {
    protocol: "https",
    hostname: "**.supabase.co",
  },
  {
    protocol: "https",
    hostname: "**",
  },
];

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  try {
    const parsedSupabaseUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
    remoteImagePatterns.push({
      protocol: parsedSupabaseUrl.protocol.replace(":", ""),
      hostname: parsedSupabaseUrl.hostname,
    });
  } catch {
    // Keep default wildcard pattern if the env URL cannot be parsed.
  }
}

const nextConfig = {
  images: {
    remotePatterns: remoteImagePatterns,
  },
  async redirects() {
    return [
      {
        source: "/about",
        destination: "/about-us",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/contact-us",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
