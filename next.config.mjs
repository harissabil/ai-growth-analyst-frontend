/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {ignoreDuringBuilds: true},     // don’t fail build on ESLint errors
    typescript: {ignoreBuildErrors: true},  // (optional) don’t fail build on TS errors
};

export default nextConfig;