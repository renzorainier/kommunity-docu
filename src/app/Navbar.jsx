'use client';

import { FaArrowLeft } from 'react-icons/fa'; // Back icon
import { FaUser, FaPlusCircle } from 'react-icons/fa'; // Icons for navigation

export default function Navbar({ activeComponent, setActiveComponent }) {
  // Handle Back Button Logic
  const handleBackToFeed = () => {
    setActiveComponent('feed');
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md border-b border-gray-200 h-16 flex items-center justify-between px-4">
      {/* Back Button and Title */}
      {(activeComponent === 'profile' || activeComponent === 'createPost') ? (
        <div className="flex items-center justify-between w-full">
          <button
            onClick={handleBackToFeed}
            className="text-blue-500 flex items-center space-x-2"
          >
            <FaArrowLeft size={20} />
            <span className="text-lg font-medium">Back</span>
          </button>
          <h1 className="text-xl font-semibold">
            {activeComponent === 'profile' ? 'Profile' : 'Create Post'}
          </h1>
          <div className="w-10" /> {/* Empty space to balance layout */}
        </div>
      ) : (
        /* Navigation Buttons for Post and Profile */
        <div className="flex justify-around w-full">
          <button
            onClick={() => setActiveComponent('createPost')}
            className={`flex flex-col items-center ${activeComponent === 'createPost' ? 'text-blue-500' : 'text-gray-600'}`}
          >
            <FaPlusCircle size={24} />
            <span className="text-xs">Post</span>
          </button>
          <button
            onClick={() => setActiveComponent('profile')}
            className={`flex flex-col items-center ${activeComponent === 'profile' ? 'text-blue-500' : 'text-gray-600'}`}
          >
            <FaUser size={24} />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      )}
    </nav>
  );
}







// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
// import Image from "next/image";
// import { signOut } from "firebase/auth";
// import { auth } from "@/app/firebase/config";
// import teen from "./img.png";

// const Navbar = ({ activeComponent, setActiveComponent }) => {
//   const [nav, setNav] = useState(false);
//   const [shadow, setShadow] = useState(false);
//   const router = useRouter();

//   const handleNav = () => {
//     setNav(!nav);
//   };

//   const navigateTo = (path) => {
//     router.push(path);
//     setNav(false);
//   };

//   const handleSignOut = () => {
//     signOut(auth);
//     localStorage.removeItem("email");
//     localStorage.removeItem("password");
//     sessionStorage.removeItem("user");
//     router.push("/sign-in");
//   };

//   useEffect(() => {
//     const handleShadow = () => {
//       setShadow(window.scrollY >= 90);
//     };
//     window.addEventListener("scroll", handleShadow);

//     return () => window.removeEventListener("scroll", handleShadow); // Cleanup listener
//   }, []);

//   return (
//     <div className={shadow ? "fixed w-full h-14 shadow-xl shadow-[#031525] z-[100]" : "fixed w-full h-14 z-[100]"}>
//             <link rel="manifest" href="/manifest.json" />

//       <div className="flex justify-between items-center w-full h-full px-5 2xl:px-16 bg-white">
//         <div>
//           <Image src={teen} width="40" height="40" alt="/" />
//         </div>
//         <div>
//           <ul className="hidden md:flex">
//             <li
//               className={`ml-10 text-sm uppercase cursor-pointer ${
//                 activeComponent === "attendance" ? "bg-[#0587be] text-white px-3 py-2 rounded" : "hover:bg-gray-200 px-3 py-2 rounded"
//               }`}
//               onClick={() => {
//                 setActiveComponent("attendance");
//                 handleNav();
//               }}>
//               Attendance
//             </li>
//             <li
//               className={`ml-10 text-sm uppercase cursor-pointer ${
//                 activeComponent === "finance" ? "bg-[#0587be] text-white px-3 py-2 rounded" : "hover:bg-gray-200 px-3 py-2 rounded"
//               }`}
//               onClick={() => {
//                 setActiveComponent("finance");
//                 handleNav();
//               }}>
//               Finance
//             </li>
//             <li
//               className={`ml-10 text-sm uppercase cursor-pointer ${
//                 activeComponent === "profile" ? "bg-[#0587be] text-white px-3 py-2 rounded" : "hover:bg-gray-200 px-3 py-2 rounded"
//               }`}
//               onClick={() => {
//                 setActiveComponent("profile");
//                 handleNav();
//               }}>
//               Profile
//             </li>
//             <li
//               className="ml-10 text-sm uppercase cursor-pointer hover:bg-gray-200 px-3 py-2 rounded"
//               onClick={() => {
//                 setActiveComponent("attendance");
//                 handleSignOut();
//               }}>
//               Sign Out
//             </li>
//           </ul>
//           <div onClick={handleNav} className="md:hidden">
//             <AiOutlineMenu size={25} />
//           </div>
//         </div>
//       </div>

//       <div className={nav ? "md:hidden fixed left-0 top-0 w-full h-screen bg-black/70" : ""}>
//         <div className={nav ? "fixed left-0 top-0 w-[75%] sm:w-[60%] md:w-[45%] h-screen bg-white p-10 transform translate-x-0 transition-transform duration-500 ease-out" : "fixed left-0 top-0 w-[75%] sm:w-[60%] md:w-[45%] h-screen bg-white p-10 transform -translate-x-full transition-transform duration-500 ease-in"}>
//           <div>
//             <div className="flex w-full items-center justify-between">
//               <div>
//                 <Image src={teen} width="70" height="70" alt="/" />
//               </div>
//               <div onClick={handleNav} className="rounded-full shadow-lg shadow-[#0587be] p-3 cursor-pointer">
//                 <AiOutlineClose />
//               </div>
//             </div>
//             <div className="border-b border-black my-4">
//               <p className="w-[85%] md:w-[90%] py-4">Metroview Baptist Academy</p>
//             </div>
//           </div>
//           <div className="py-4 flex flex-col">
//             <ul className="uppercase">
//               <li
//                 onClick={() => {
//                   setActiveComponent("attendance");
//                   handleNav();
//                 }}
//                 className={`py-4 text-sm cursor-pointer ${
//                   activeComponent === "attendance" ? "bg-[#0587be] text-white px-3 py-2 rounded" : "hover:bg-gray-200 px-3 py-2 rounded"
//                 }`}>
//                 Attendance
//               </li>
//               <li
//                 onClick={() => {
//                   setActiveComponent("finance");
//                   handleNav();
//                 }}
//                 className={`py-4 text-sm cursor-pointer ${
//                   activeComponent === "finance" ? "bg-[#0587be] text-white px-3 py-2 rounded" : "hover:bg-gray-200 px-3 py-2 rounded"
//                 }`}>
//                 Finance
//               </li>
//               <li
//                 onClick={() => {
//                   setActiveComponent("profile");
//                   handleNav();
//                 }}
//                 className={`py-4 text-sm cursor-pointer ${
//                   activeComponent === "profile" ? "bg-[#0587be] text-white px-3 py-2 rounded" : "hover:bg-gray-200 px-3 py-2 rounded"
//                 }`}>
//                 Profile
//               </li>
//               <li
//                 onClick={handleSignOut}
//                 className="py-4 text-sm cursor-pointer hover:bg-gray-200 px-3 py-2 rounded">
//                 Sign Out
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;

// import Image from "next/image";
// import React, { useState, useEffect } from "react";
// import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
// import { useRouter } from "next/navigation";
// import teen from "./img.png";
// import { signOut } from 'firebase/auth';
// import { auth } from '@/app/firebase/config';
// import Attendance from './Attendance.jsx';
// import Finance from './Finance.jsx';

// const Navbar = () => {
//   const [nav, setNav] = useState(false);
//   const [shadow, setShadow] = useState(false);
//   const router = useRouter();

//   const handleNav = () => {
//     setNav(!nav);
//   };

//   const navigateTo = (path) => {
//     router.push(path);
//     setNav(false);
//   };

//   const handleSignOut = () => {
//     signOut(auth);
//     localStorage.removeItem('email');
//     localStorage.removeItem('password');
//     sessionStorage.removeItem('user');
//     router.push('/sign-in');
//   };

//   useEffect(() => {
//     const handleShadow = () => {
//       if (window.scrollY >= 90) {
//         setShadow(true);
//       } else {
//         setShadow(false);
//       }
//     };
//     window.addEventListener("scroll", handleShadow);
//   }, []);

//   return (
//     <div
//       className={
//         shadow
//           ? "fixed w-full h-14 shadow-xl shadow-[#031525] z-[100]"
//           : "fixed w-full h-14 z-[100]"
//       }
//     >
//       <div className="flex justify-between items-center w-full h-full px-5 2xl:px-16 bg-white">
//         <div>
//           <Image
//             src={teen}
//             width="40"
//             height="40"
//             alt="/"
//           />
//         </div>
//         <div>
//           <ul className="hidden md:flex">
//             <li
//               className="ml-10 text-sm uppercase hover:border-b cursor-pointer"
//               onClick={() => navigateTo('/')}
//             >
//               Home
//             </li>
//             <li
//               className="ml-10 text-sm uppercase hover:border-b cursor-pointer"
//               onClick={handleSignOut}
//             >
//               Sign Out
//             </li>
//           </ul>
//           <div onClick={handleNav} className="md:hidden">
//             <AiOutlineMenu size={25} />
//           </div>
//         </div>
//       </div>

//       <div
//         className={
//           nav ? "md:hidden fixed left-0 top-0 w-full h-screen bg-black/70" : ""
//         }
//       >
//         <div
//           className={
//             nav
//               ? "fixed left-0 top-0 w-[75%] sm:w-[60%] md:w-[45%] h-screen bg-white p-10 transform translate-x-0 transition-transform duration-500 ease-out"
//               : "fixed left-0 top-0 w-[75%] sm:w-[60%] md:w-[45%] h-screen bg-white p-10 transform -translate-x-full transition-transform duration-500 ease-in"
//           }
//         >
//           <div>
//             <div className="flex w-full items-center justify-between">
//               <div>
//                 <Image
//                   src={teen}
//                   width="70"
//                   height="70"
//                   alt="/"
//                 />
//               </div>

//               <div
//                 onClick={handleNav}
//                 className="rounded-full shadow-lg shadow-[#0587be] p-3 cursor-pointer"
//               >
//                 <AiOutlineClose />
//               </div>
//             </div>
//             <div className="border-b border-black my-4">
//               <p className="w-[85%] md:w-[90%] py-4">
//                 Metroview Baptist Academy
//               </p>
//             </div>
//           </div>
//           <div className="py-4 flex flex-col">
//             <ul className="uppercase">
//               <li
//                 onClick={() => navigateTo('/')}
//                 className="py-4 text-sm cursor-pointer"
//               >
//                 Home
//               </li>
//               <li
//                 onClick={handleSignOut}
//                 className="py-4 text-sm cursor-pointer"
//               >
//                 Sign Out
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//       <div>
//       {/* <Attendance userData={userData} /> */}
//       </div>
//     </div>
//   );
// };

// export default Navbar;

// import Image from "next/image";
// import Link from "next/link";
// import React, { useState, useEffect } from "react";
// import { AiOutlineClose, AiOutlineMenu, AiOutlineMail } from "react-icons/ai";
// import { FaFacebook, FaGithub } from "react-icons/fa";
// import { BsFillPersonLinesFill } from "react-icons/bs";
// import teen from "./teen.png"

// const Navbar = () => {
//   const [nav, setNav] = useState(false);
//   const [shadow, setShadow] = useState(false);

//   const handleNav = () => {
//     setNav(!nav);
//   };

//   useEffect(() => {
//     const handleShadow = () => {
//       if (window.scrollY >= 90) {
//         setShadow(true);
//       } else {
//         setShadow(false);
//       }
//     };
//     window.addEventListener("scroll", handleShadow);
//   }, []);

//   return (
//     <div
//       className={
//         shadow
//           ? "fixed w-full h-20 shadow-xl shadow-[#e8c284] z-[100]"
//           : "fixed w-full h-20  z-[100]"
//       }
//     >
//       <div className="flex justify-between items-center w-full h-full px-2 2xl:px-16 bg-[#f3efde]">
//         <div>
//           <Image
//             src={teen}
//             width="70"
//             height="70"
//             alt="/"
//           />
//         </div>
//         <div>
//           <ul className="hidden md:flex">
//             <Link href="/">
//               <li className="ml-10 text-sm uppercase hover:border-b">Home</li>
//             </Link>
//             <Link href="/#about">
//               <li className="ml-10 text-sm uppercase hover:border-b">About</li>
//             </Link>
//             <Link href="/#skills">
//               <li className="ml-10 text-sm uppercase hover:border-b">Skills</li>
//             </Link>
//             <Link href="/#projects">
//               <li className="ml-10 text-sm uppercase hover:border-b">
//                 Projects
//               </li>
//             </Link>
//             <Link href="/#contact">
//               <li className="ml-10 text-sm uppercase hover:border-b">
//                 Contact
//               </li>
//             </Link>
//           </ul>
//           <div onClick={handleNav} className="md:hidden">
//             <AiOutlineMenu size={25} />
//           </div>
//         </div>
//       </div>

//       <div
//         className={
//           nav ? "md:hidden fixed left-0 top-0 w-full h-screen bg-black/70" : ""
//         }
//       >
//         <div
//           className={
//             nav
//               ? "fixed left-0 top-0 w-[75%] sm:w-[60%] md:w-[45%] h-screen bg-gradient-to-tl from-[#FAF8F1] to-[#FAEAB1] p-10 ease-in duration-500"
//               : "fixed left-[-100%] top-0 p-10 ease-in duration-500"
//           }
//         >
//           <div>
//             <div className="flex w-full items-center justify-between">
//               <div>
//                 <Image
//                   src={teen}
//                   width="70"
//                   height="70"
//                   alt="/"
//                 />
//               </div>

//               <div
//                 onClick={handleNav}
//                 className="rounded-full shadow-lg shadow-[#e8c284] p-3 cursor-pointer"
//               >
//                 <AiOutlineClose />
//               </div>
//             </div>
//             <div className="border-b border-[#e8c284] my-4">
//               <p className="w-[85%] md:w-[90%] py-4">
//                 Join me build something legendary together
//               </p>
//             </div>
//           </div>
//           <div className="py-4 flex flex-col">
//             <ul className="uppercase">
//               <Link href="/">
//                 <li onClick={() => setNav(false)} className="py-4 text-sm">
//                   Home
//                 </li>
//               </Link>
//               <Link href="/#about">
//                 <li onClick={() => setNav(false)} className="py-4 text-sm">
//                   About
//                 </li>
//               </Link>
//               <Link href="/#skills">
//                 <li onClick={() => setNav(false)} className="py-4 text-sm">
//                   Skills
//                 </li>
//               </Link>
//               <Link href="/#projects">
//                 <li onClick={() => setNav(false)} className="py-4 text-sm">
//                   Projects
//                 </li>
//               </Link>
//               <Link href="/#contact">
//                 <li onClick={() => setNav(false)} className="py-4 text-sm">
//                   Contact
//                 </li>
//               </Link>
//             </ul>
//             <div className="py-4">
//               <p className="uppercase tracking-widest text-[#C58940]">
//                 Let us Connect
//               </p>
//               <div className="flex items-center justify-between my-4 w-full sm:w-[80%]">
//                 <div className="rounded-full shadow-lg shadow-[#e8c284] p-3 cursor-pointer hover:scale-105 ease-in duration-500">
//                   <FaFacebook />
//                 </div>
//                 <div className="rounded-full shadow-lg shadow-[#e8c284]  p-3 cursor-pointer hover:scale-105 ease-in duration-500">
//                   <FaGithub />
//                 </div>
//                 <div className="rounded-full shadow-lg shadow-[#e8c284] p-3 cursor-pointer hover:scale-105 ease-in duration-500">
//                   <AiOutlineMail />
//                 </div>
//                 <div className="rounded-full shadow-lg shadow-[#e8c284] p-3 cursor-pointer hover:scale-105 ease-in duration-500">
//                   <BsFillPersonLinesFill />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;
