// Import the PWA configuration
const withPWA = require('next-pwa')({
    dest: 'public'
  });

  // Define your Next.js configuration
  const nextConfig = {
    // Add any other Next.js config options here
  };

  // Export the combined configuration
  module.exports = withPWA(nextConfig);



// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
