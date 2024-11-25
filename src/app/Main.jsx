'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import success from './success.wav';
import CreatePost from './CreatePost';
import Profile from './Profile';
import Feed from './Feed';
import Navbar from './Navbar';

export default function Main() {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [postData, setPostData] = useState(null);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false); // State for CreatePost modal
  const router = useRouter();

  const handleUserCheck = useCallback(() => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribeUser = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setUserData(data);

        // Play success sound
        const audio = new Audio(success);
        audio.play().catch((err) => console.error('Failed to play sound:', err));
      } else {
        console.error('No user data found');
        router.push('/error');
      }
    });

    const postDocRef = doc(db, 'posts', 'posts');
    const unsubscribePost = onSnapshot(postDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setPostData(data);
      } else {
        console.error('No posts data found');
      }
    });

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
    <div className="main-container relative min-h-screen">
      <Navbar />
      <main>
        <Feed postData={postData} userData={userData} />
        {isCreatePostOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <CreatePost userData={userData} />
              <button
                onClick={() => setIsCreatePostOpen(false)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Close
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCreatePostOpen(true)}
          className="fixed bottom-6 left-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 z-50">
          +
        </button>
      </main>
    </div>
  );
}


// 'use client';

// import { useEffect, useState, useCallback } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '@/app/firebase/config';
// import { useRouter } from 'next/navigation';
// import { doc, onSnapshot } from 'firebase/firestore';
// import success from './success.wav';
// import CreatePost from './CreatePost';
// import Profile from './Profile';
// import Feed from './Feed'

// export default function Main() {
//   const [user, loading, error] = useAuthState(auth);
//   const [userData, setUserData] = useState(null);
//   const [postData, setPostData] = useState(null);
//   const router = useRouter();

//   const handleUserCheck = useCallback(() => {
//     if (!user) {
//       router.push('/sign-in');
//       return;
//     }

//     // Listen for user document changes in Firestore
//     const userDocRef = doc(db, 'users', user.uid);
//     const unsubscribeUser = onSnapshot(userDocRef, (docSnapshot) => {
//       if (docSnapshot.exists()) {
//         const data = docSnapshot.data();
//         setUserData(data);
//         console.log("User data from Firestore:", data);

//         // Play success sound
//         const audio = new Audio(success);
//         audio.play().catch((err) => console.error("Failed to play sound:", err));
//       } else {
//         console.error('No user data found');
//         router.push('/error');
//       }
//     });


//     // Listen for post document changes in Firestore
//     const postDocRef = doc(db, 'posts', 'posts');
//     const unsubscribePost = onSnapshot(postDocRef, (docSnapshot) => {
//       if (docSnapshot.exists()) {
//         const data = docSnapshot.data();
//         setPostData(data);
//         console.log("Posts data:", data);
//       } else {
//         console.error('No posts data found');
//       }
//     });

//     // Cleanup subscriptions on unmount
//     return () => {
//       unsubscribeUser();
//       unsubscribePost();
//     };
//   }, [user, router]);

//   useEffect(() => {
//     if (!loading && !error) {
//       handleUserCheck();
//     }
//   }, [user, loading, error, handleUserCheck]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   return (
//     <main>
//             <Feed postData={postData} userData={userData} />
//             <Profile postData={postData} userData={userData} />
//             <CreatePost userData={userData}  />

//     </main>
//   );
// }




      {/* <Feed postData={postData} /> */}
