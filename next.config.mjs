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


// next.config.mjs
import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  dest: 'public',
  // Add your Next.js config options here
});

export default nextConfig;
