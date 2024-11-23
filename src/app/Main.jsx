'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import success from './success.wav';
import CreatePost from './CreatePost';

export default function Main() {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [postData, setPostData] = useState(null);
  const router = useRouter();

  const handleUserCheck = useCallback(() => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    // Listen for user document changes in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribeUser = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setUserData(data);
        console.log("User data:", data);

        // Play success sound
        const audio = new Audio(success);
        audio.play().catch((err) => console.error("Failed to play sound:", err));
      } else {
        console.error('No user data found');
        router.push('/error');
      }
    });

    // Listen for post document changes in Firestore
    const postDocRef = doc(db, 'posts', 'posts');
    const unsubscribePost = onSnapshot(postDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setPostData(data);
        console.log("Posts data:", data);
      } else {
        console.error('No posts data found');
      }
    });

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeUser();
      unsubscribePost();
    };
  }, [user, router]);

  useEffect(() => {
    if (!loading && !error) {
      handleUserCheck();
    }
  }, [user, loading, error, handleUserCheck]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <main>
      <CreatePost userData={userData}  />
    </main>
  );
}




      {/* <Feed postData={postData} /> */}
