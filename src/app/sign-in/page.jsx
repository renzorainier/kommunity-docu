'use client';

import { useState, useEffect } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    
    if (savedEmail && savedPassword) {
      signInWithEmailAndPassword(savedEmail, savedPassword);
    }
  }, [signInWithEmailAndPassword]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
      sessionStorage.setItem('user', true);
      router.push('/');
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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-5">Sign In</h1>
        {error && <p className="text-red-500 mb-4">Error Logging in</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <button
          onClick={handleSignIn}
          className="w-full p-3 bg-[#0587be] rounded text-white hover:bg-indigo-500"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
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
