import type { NextConfig } from "next";
/** @type {import('next').NextConfig} } */

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // النطاق الذي تطلبه الرسالة
        port: '',
        pathname: '/**', // السماح بجميع المسارات داخل هذا النطاق
      },
    ],
  },
};

export default nextConfig;
