/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep development and production webpack artifacts separate. Running
  // `next build` while the dev server is active can otherwise leave the dev
  // runtime with a module table from a different compilation.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  images: {
    domains: ['i.ibb.co','lh3.googleusercontent.com','res.cloudinary.com'],
  },
}

module.exports = nextConfig
