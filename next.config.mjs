import { URL } from "url";

const endpoint = process.env.IMAGEKIT_URL_ENDPOINT;
const hostname = endpoint ? new URL(endpoint).hostname : "ik.imagekit.io";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [hostname],
  },
};

export default nextConfig;
