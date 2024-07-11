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
  const [userSession, setUserSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionUser = sessionStorage.getItem('user');
      setUserSession(sessionUser);
    }
  }, []);

  useEffect(() => {
    // Function to fetch user data from Firestore
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.error('No user data found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Check if there's a logged-in user or a session user
    if (!user && !userSession) {
      router.push('/sign-in'); // Redirect to sign-in if no user is logged in
    } else if (user) {
      // Fetch user data if user is logged in
      fetchUserData();
    }
  }, [user, userSession, router]);

  // Handle logout function
  const handleLogout = () => {
    signOut(auth); // Sign out from Firebase Auth
    sessionStorage.removeItem('user'); // Remove session storage
    router.push('/sign-in'); // Redirect to sign-in page
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Display attendance and other components */}
      <Attendance userData={userData} />
      <MockAttendanceGenerator />

      {/* Logout button */}
      <button onClick={handleLogout}>Log out</button>
    </main>
  );
}
