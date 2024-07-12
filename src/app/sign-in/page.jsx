"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import teen from "../img.png";
const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");

    if (savedEmail && savedPassword) {
      signInWithEmailAndPassword(savedEmail, savedPassword);
    }
  }, [signInWithEmailAndPassword]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
      sessionStorage.setItem("user", true);
      router.push("/");
    }
  }, [user, email, password, router]);

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(email, password);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row w-full max-w-4xl">
        <div className="md:w-1/2 p-8 flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-lg">
          <div>
            <Image src={teen} width="260" height="260" alt="/" />
          </div>

        </div>
        <div className="md:w-1/2 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Sign In
          </h1>
          {error && <p className="text-red-500 mb-4">Error Logging in</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-100 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-100 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSignIn}
            className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
            disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

// 'use client';

// import { useState, useEffect } from 'react';
// import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
// import { auth } from '@/app/firebase/config';
// import { useRouter } from 'next/navigation';

// const SignIn = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
//   const router = useRouter();

//   useEffect(() => {
//     if (user) {
//       sessionStorage.setItem('user', true);
//       router.push('/');
//     }
//   }, [user, router]);

//   const handleSignIn = async () => {
//     try {
//       await signInWithEmailAndPassword(email, password);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white">
//       <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
//         <h1 className="text-white text-2xl mb-5">Sign In</h1>
//         {error && <p className="text-red-500 mb-4">Error Logging in</p>}
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
//         />
//         <button
//           onClick={handleSignIn}
//           className="w-full p-3 bg-[#0587be] rounded text-white hover:bg-indigo-500"
//           disabled={loading}
//         >
//           {loading ? 'Signing In...' : 'Sign In'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SignIn;
