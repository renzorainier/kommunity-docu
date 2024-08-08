const withPWA = require('next-pwa')({
    dest: 'public'
  });

  /** @type {import('next').NextConfig} */
  const nextConfig = {
    // Other Next.js config options can go here
  };

  module.exports = withPWA(nextConfig);

// const withPWA = require('next-pwa')({
//     dest: 'public'
//   })

// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
