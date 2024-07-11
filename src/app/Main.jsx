'use client';

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/app/firebase/config';
import { useRouter } from 'next/navigation.js';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Attendance from './Attendance.jsx';
import MockAttendanceGenerator from './MockAttendanceGenerator.jsx';

export default function Main() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true); // Track initial load
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionUser = sessionStorage.getItem('user');
      if (sessionUser) {
        setUserData(JSON.parse(sessionUser)); // Load user data from session storage
      }
      setInitialLoad(false); // Update initial load status
    }
  }, []);

  useEffect(() => {
    if (!user && !userData && !initialLoad) {
      router.push('/sign-in'); // Redirect to sign-in if no user data and not loading initially
    } else if (user) {
      const fetchUserData = async () => {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserData(userData); // Set user data
            sessionStorage.setItem('user', JSON.stringify(userData)); // Save user data to session storage
          } else {
            console.error('No user data found');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    }
  }, [user, userData, initialLoad, router]);

  const handleSignOut = () => {
    signOut(auth);
    sessionStorage.removeItem('user'); // Clear session storage on logout
    setUserData(null); // Clear user data state
    router.push('/sign-in');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Attendance userData={userData} />
      <MockAttendanceGenerator />
      <button onClick={handleSignOut}>
        Log out
      </button>
    </main>
  );
}
