/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['haliat-next-ecommerce.s3.amazonaws.com'],
  },
};

export default nextConfig;

