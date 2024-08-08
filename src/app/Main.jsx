'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import Attendance from './Attendance.jsx';
import Finance from './Finance.jsx';
import Profile from './Profile.jsx'; // Import the new component
import { Analytics } from "@vercel/analytics/react"
// Import more components as needed

export default function Main({ activeComponent }) {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  const handleUserCheck = useCallback(() => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);

    // Set up listener for real-time updates
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setUserData(docSnapshot.data());
        console.log(docSnapshot.data()); // Initial log when listener is set up
      } else {
        console.error('No user data found');
        router.push('/error'); // Redirect to error page if no user data found
      }
    });

    return () => unsubscribe(); // Cleanup function to unsubscribe when component unmounts
  }, [user, router]);

  useEffect(() => {
    if (!loading && !error) {
      handleUserCheck();
    }
  }, [user, loading, error, handleUserCheck]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#031525] items-center justify-between">
      {activeComponent === 'profile' && <Profile userData={userData} userId={user?.uid} />}
      {activeComponent === 'attendance' && <Attendance userData={userData} />}
      {activeComponent === 'finance' && <Finance userData={userData} />}
    </main>
  );
}



//works aug 1, just not sure about the bug on the sign in

// 'use client';

// import { useEffect, useState, useCallback, useMemo } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/app/firebase/config';
// import { useRouter } from 'next/navigation';
// import { doc, onSnapshot } from 'firebase/firestore';
// import Attendance from './Attendance.jsx';
// import Finance from './Finance.jsx';
// import Profile from './Profile.jsx'; // Import the new component
// import MockAttendanceGenerator from "./MockAttendanceGenerator.jsx"

// // Import more components as needed

// export default function Main({ activeComponent }) {
//   const [user] = useAuthState(auth);
//   const [userData, setUserData] = useState(null);
//   const router = useRouter();
//   const userSession = useMemo(() => (typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('user')) : null), []);

//   const handleUserCheck = useCallback(() => {
//     if (!user && !userSession) {
//       router.push('/sign-in');
//       return;
//     }

//     if (user) {
//       sessionStorage.setItem('user', JSON.stringify(user));
//       const userDocRef = doc(db, 'users', user.uid);

//       // Set up listener for real-time updates
//       const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
//         if (docSnapshot.exists()) {
//           setUserData(docSnapshot.data());
//           console.log(docSnapshot.data()); // Initial log when listener is set up
//           // console.log(user);
//         } else {
//           console.error('No user data found');
//           router.push('/error'); // Redirect to error page if no user data found
//         }
//       });

//       return () => unsubscribe(); // Cleanup function to unsubscribe when component unmounts
//     }
//   }, [user, userSession, router]);

//   useEffect(() => {
//     handleUserCheck();
//   }, [handleUserCheck]);

//   return (
//     <main className="flex min-h-screen flex-col bg-[#031525] items-center justify-between">
//       {activeComponent === 'profile' && <Profile userData={userData} userId={user.uid} />}
//       {activeComponent === 'attendance' && <Attendance userData={userData} />}
//       {activeComponent === 'finance' && <Finance userData={userData} />}
//       {/* <MockAttendanceGenerator/> */}
//     </main>
//   );
// }



//working 29 before the user photos
// 'use client';

// import { useEffect, useState, useCallback, useMemo } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/app/firebase/config';
// import { useRouter } from 'next/navigation';
// import { doc, onSnapshot } from 'firebase/firestore';
// import Attendance from './Attendance.jsx';
// import Finance from './Finance.jsx';
// // Import more components as needed

// export default function Main({ activeComponent }) {
//   const [user] = useAuthState(auth);
//   const [userData, setUserData] = useState(null);
//   const router = useRouter();
//   const userSession = useMemo(() => (typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('user')) : null), []);

//   const handleUserCheck = useCallback(() => {
//     if (!user && !userSession) {
//       router.push('/sign-in');
//       return;
//     }

//     if (user) {
//       sessionStorage.setItem('user', JSON.stringify(user));
//       const userDocRef = doc(db, 'users', user.uid);

//       // Set up listener for real-time updates
//       const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
//         if (docSnapshot.exists()) {
//           setUserData(docSnapshot.data());
//           console.log(docSnapshot.data()); // Initial log when listener is set up
//         console.log(user);
//         } else {
//           console.error('No user data found');
//           router.push('/error'); // Redirect to error page if no user data found
//         }
//       });

//       return () => unsubscribe(); // Cleanup function to unsubscribe when component unmounts
//     }
//   }, [user, userSession, router]);

//   useEffect(() => {
//     handleUserCheck();
//   }, [handleUserCheck]);

//   return (
//     <main className="flex min-h-screen flex-col bg-[#031525] items-center justify-between">
//       {activeComponent === 'attendance' && <Attendance userData={userData} />}
//       {activeComponent === 'finance' && <Finance userData={userData} />}
//       {/* {activeComponent === 'mockAttendance' && <MockAttendanceGenerator />} */}
//       {/* Add more conditional renderings for other components */}
//     </main>
//   );
// }

//keeps on console logging butt works 29
// 'use client';

// import { useEffect, useState } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/app/firebase/config';
// import { useRouter } from 'next/navigation';
// import { doc, onSnapshot } from 'firebase/firestore';
// import Attendance from './Attendance.jsx';
// import Finance from './Finance.jsx';
// // Import more components as needed

// export default function Main({ activeComponent }) {
//   const [user] = useAuthState(auth);
//   const [userData, setUserData] = useState(null);
//   const router = useRouter();
//   const userSession = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('user')) : null;

//   useEffect(() => {
//     const handleUserCheck = () => {
//       if (!user && !userSession) {
//         router.push('/sign-in');
//         return;
//       }

//       if (user) {
//         sessionStorage.setItem('user', JSON.stringify(user));
//         const userDocRef = doc(db, 'users', user.uid);

//         // Set up listener for real-time updates
//         const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
//           if (docSnapshot.exists()) {
//             setUserData(docSnapshot.data());
//             console.log(docSnapshot.data());
//           } else {
//             console.error('No user data found');
//             router.push('/error'); // Redirect to error page if no user data found
//           }
//         });

//         return () => unsubscribe(); // Cleanup function to unsubscribe when component unmounts
//       }
//     };

//     handleUserCheck();
//   }, [user, userSession, router]);

//   return (
//     <main className="flex min-h-screen flex-col bg-[#031525] items-center justify-between">
//       {activeComponent === 'attendance' && <Attendance userData={userData} />}
//       {activeComponent === 'finance' && <Finance userData={userData} />}
//       {/* {activeComponent === 'mockAttendance' && <MockAttendanceGenerator />} */}
//       {/* Add more conditional renderings for other components */}
//     </main>
//   );
// }

//working before sync 27
// 'use client';

// import { useEffect, useState } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/app/firebase/config';
// import { useRouter } from 'next/navigation';
// import { doc, onSnapshot } from 'firebase/firestore';
// import Attendance from './Attendance.jsx';
// import Finance from './Finance.jsx';
// import MockAttendanceGenerator from './MockAttendanceGenerator.jsx';
// // Import more components as needed

// export default function Main({ activeComponent }) {
//   const [user] = useAuthState(auth);
//   const [userData, setUserData] = useState(null);
//   const router = useRouter();
//   const userSession = typeof window !== 'undefined' ? sessionStorage.getItem('user') : null;

//   useEffect(() => {
//     if (!user && !userSession) {
//       router.push('/sign-in');
//     } else if (user) {
//       const userDocRef = doc(db, 'users', user.uid);

//       // Set up listener for real-time updates
//       const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
//         if (docSnapshot.exists()) {
//           setUserData(docSnapshot.data());
//           console.log(docSnapshot.data());
//         } else {
//           console.error('No user data found');
//           router.push('/error'); // Redirect to error page if no user data found
//         }
//       });

//       return () => unsubscribe(); // Cleanup function to unsubscribe when component unmounts
//     }
//   }, [user, userSession, router]);

//   return (
//     <main className="flex min-h-screen flex-col bg-[#031525] items-center justify-between">
//       {activeComponent === 'attendance' && <Attendance userData={userData} />}
//       {activeComponent === 'finance' && <Finance userData={userData} />}
//       {/* {activeComponent === 'mockAttendance' && <MockAttendanceGenerator />} */}
//       {/* Add more conditional renderings for other components */}
//     </main>
//   );
// }


// import { useEffect, useState } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/app/firebase/config';
// import { useRouter } from 'next/navigation';
// import { doc, onSnapshot } from 'firebase/firestore';
// import { useUserData } from './UserDataContext';
// import Attendance from './Attendance.jsx';
// import Finance from './Finance.jsx';
// import MockAttendanceGenerator from './MockAttendanceGenerator.jsx';

// export default function Main() {
//   const [user] = useAuthState(auth);
//   const { setUserData } = useUserData();
//   const router = useRouter();
//   const userSession = typeof window !== 'undefined' ? sessionStorage.getItem('user') : null;

//   useEffect(() => {
//     if (!user && !userSession) {
//       router.push('/sign-in');
//     } else if (user) {
//       const userDocRef = doc(db, 'users', user.uid);

//       // Set up listener for real-time updates
//       const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
//         if (docSnapshot.exists()) {
//           const data = docSnapshot.data();
//           setUserData(data);
//           console.log(docSnapshot.data());
//           router.push('/attendance'); // Navigate to the Attendance page after setting the data
//         } else {
//           console.error('No user data found');
//           router.push('/error'); // Redirect to error page if no user data found
//         }
//       });

//       return () => unsubscribe(); // Cleanup function to unsubscribe when component unmounts
//     }
//   }, [user, userSession, router, setUserData]);

//   return (
//     <main className="flex min-h-screen flex-col bg-[#031525] items-center justify-between">
//       <h1>Loading...</h1>
//     </main>
//   );
// }



//working thursday 4:23

// 'use client';
// import { useEffect, useState } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/app/firebase/config';
// import { useRouter } from 'next/navigation.js';
// import { signOut } from 'firebase/auth';
// import { doc, getDoc } from 'firebase/firestore';
// import Attendance from './Attendance.jsx';
// import MockAttendanceGenerator from './MockAttendanceGenerator.jsx';

// export default function Main() {
//   const [user] = useAuthState(auth);
//   const [userData, setUserData] = useState(null);
//   const router = useRouter();
//   const userSession = sessionStorage.getItem('user');

//   useEffect(() => {
//     if (!user && !userSession) {
//       router.push('/sign-in');
//     } else if (user) {
//       const fetchUserData = async () => {
//         try {
//           const userDocRef = doc(db, 'users', user.uid);
//           const userDoc = await getDoc(userDocRef);
//           if (userDoc.exists()) {
//             setUserData(userDoc.data());
//           } else {
//             console.error('No user data found');
//           }
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//         }
//       };

//       fetchUserData();
//     }
//   }, [user, userSession, router]);

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between">
//       <Attendance userData={userData} />
//       <MockAttendanceGenerator />
//       <button
//         onClick={() => {
//           signOut(auth);
//           sessionStorage.removeItem('user');
//           router.push('/sign-in');
//         }}
//       >
//         Log out
//       </button>
//     </main>
//   );
// }






































// 'use client';

// import { useEffect, useState } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/app/firebase/config';
// import { useRouter } from 'next/navigation.js';
// import { signOut } from 'firebase/auth';
// import { doc, getDoc } from 'firebase/firestore';
// import Attendance from './Attendance.jsx';
// import MockAttendanceGenerator from './MockAttendanceGenerator.jsx';

// export default function Main() {
//   const [user] = useAuthState(auth);
//   const [userData, setUserData] = useState(null);
//   const [userSession, setUserSession] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const sessionUser = sessionStorage.getItem('user');
//       setUserSession(sessionUser);
//     }
//   }, []);

//   useEffect(() => {
//     if (!user && !userSession) {
//       router.push('/sign-in');
//     } else if (user) {
//       const fetchUserData = async () => {
//         try {
//           const userDocRef = doc(db, 'users', user.uid);
//           const userDoc = await getDoc(userDocRef);
//           if (userDoc.exists()) {
//             setUserData(userDoc.data());
//           } else {
//             console.error('No user data found');
//           }
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//         }
//       };

//       fetchUserData();
//     }
//   }, [user, userSession, router]);

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between">
//       <Attendance userData={userData} />
//       <MockAttendanceGenerator />
//       <button
//         onClick={() => {
//           signOut(auth);
//           sessionStorage.removeItem('user');
//           router.push('/sign-in');
//         }}
//       >
//         Log out
//       </button>
//     </main>
//   );
// }
