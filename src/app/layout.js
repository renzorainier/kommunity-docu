// layout.js
// import "./globals.css";
// import { Urbanist } from 'next/font/google';
// import { UserDataProvider } from './UserDataContext.jsx';

// const inter = Urbanist({ subsets: ['latin'] });

// export const metadata = {
//   title: "MVBA",
//   description: "Metro View Baptist Academy",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <UserDataProvider>
//           {children}
//         </UserDataProvider>
//       </body>
//     </html>
//   );
// }


import "./globals.css";
import { Urbanist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';
const inter = Urbanist({ subsets: ['latin'] })

export const metadata = {
  title: "MVBA",
  description: "Metro View Baptist Academy",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} >{children}</body>
      <Analytics />
    </html>
  );
}
