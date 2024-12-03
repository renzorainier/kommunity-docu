/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ['firebasestorage.googleapis.com'], // Add this line
  },

  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(wav|mp3|ogg|mp4)$/, // Handle sound files
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/sounds/',
            outputPath: 'static/sounds/',
            name: '[name].[ext]',
            esModule: false,
          },
        },
      ],
    });

    return config;
  },
};

module.exports = nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,

//   webpack: (config, { isServer }) => {
//     config.module.rules.push({
//       test: /\.(wav|mp3|ogg|mp4)$/, // Handle sound files
//       use: [
//         {
//           loader: 'file-loader',
//           options: {
//             publicPath: '/_next/static/sounds/',
//             outputPath: 'static/sounds/',
//             name: '[name].[ext]',
//             esModule: false,
//           },
//         },
//       ],
//     });

//     return config;
//   },
// };

// module.exports = nextConfig;



// const withPWA = require('next-pwa')({
//   dest: 'public',
// });

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// };

// module.exports = withPWA(nextConfig);


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

// import withPWA from 'next-pwa';

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// };

// export default withPWA({
//   dest: 'public',
// })(nextConfig);



// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
