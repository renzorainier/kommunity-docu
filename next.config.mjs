// import withPWA from 'next-pwa';

// // Define your PWA configuration separately
// const pwaConfig = {
//   dest: 'public'
// };

// // Define your Next.js configuration
// const nextConfig = {
//   // Add any other Next.js config options here
// };

// // Export the combined configuration using withPWA
// export default withPWA(pwaConfig)(nextConfig);

import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Example of a valid Next.js config
  // Add other Next.js config options here if needed
};

export default withPWA({
  dest: 'public',
})(nextConfig);
