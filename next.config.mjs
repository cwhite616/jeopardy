/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    OPENAI_API_KEY: process.env.API_KEY_OPENAI,
  },
}

export default nextConfig;
