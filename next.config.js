const urlPrefix = process.env.GITHUB_ACTIONS ? "/example-generate-image-share" : "";


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: urlPrefix,
  basePath: urlPrefix,
  reactStrictMode: true,
  basePath: process.env.GITHUB_ACTIONS && "/example-generate-image-share",
  publicRuntimeConfig: { urlPrefix },
}

module.exports = nextConfig
