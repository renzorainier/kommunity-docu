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
  const [userSession, setUserSession] = useState(null); // Manage user session state
  const router = useRouter();

  useEffect(() => {
    // Check if running in the client-side (browser) environment
    if (typeof window !== 'undefined') {
      const sessionUser = sessionStorage.getItem('user');
      setUserSession(sessionUser); // Set user session state from sessionStorage
    }
  }, []);

  useEffect(() => {
    // Check if either user is authenticated or user session exists in sessionStorage
    if (!user && !userSession) {
      router.push('/sign-in'); // Redirect to sign-in page if not authenticated
    } else if (user) {
      const fetchUserData = async () => {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data()); // Set user data state if user document exists
          } else {
            console.error('No user data found');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData(); // Fetch user data on user authentication
    }
  }, [user, userSession, router]); // Depend on user, userSession, and router

  // Render main content
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Render components based on user data */}
      <Attendance userData={userData} />
      <MockAttendanceGenerator />

      {/* Log out button */}
      <button
        onClick={() => {
          signOut(auth); // Sign out user from Firebase auth
          sessionStorage.removeItem('user'); // Remove user session from sessionStorage
          router.push('/sign-in'); // Redirect to sign-in page after logout
        }}
      >
        Log out
      </button>
    </main>
  );
}
