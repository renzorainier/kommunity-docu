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

export default function Main() {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [postData, setPostData] = useState(null);
  const [activeComponent, setActiveComponent] = useState('feed'); // Default to Feed
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

        const audio = new Audio(success);
        audio.play().catch((err) => console.error('Failed to play sound:', err));
      } else {
        router.push('/error');
      }
    });

    const postDocRef = doc(db, 'posts', 'posts');
    const unsubscribePost = onSnapshot(postDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setPostData(data);
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

  const renderComponent = () => {
    switch (activeComponent) {
      case 'profile':
        return <Profile postData={postData} userData={userData} />;
      case 'createPost':
        return <CreatePost userData={userData} />;
      case 'feed':
      default:
        return <Feed postData={postData} userData={userData} />;
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 relative">
      {/* Navbar */}
      {activeComponent === 'feed' && (
        <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-10 flex justify-around py-4">
          <button
            onClick={() => setActiveComponent('profile')}
            className={`text-lg ${activeComponent === 'profile' ? 'font-bold' : ''}`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveComponent('createPost')}
            className={`text-lg ${activeComponent === 'createPost' ? 'font-bold' : ''}`}
          >
            Create Post
          </button>
        </nav>
      )}

      {/* Floating Back Button */}
      {activeComponent !== 'feed' && (
        <button
          onClick={() => setActiveComponent('feed')}
          className="fixed top-4 left-4 bg-blue-500 text-white p-2 rounded-full shadow-lg z-20"
        >
          ← Back
        </button>
      )}

      {/* Active Component */}
      <section className={`${activeComponent === 'feed' ? 'pt-16' : ''}`}>{renderComponent()}</section>
    </main>
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
// import Feed from './Feed';
// import Navbar from './Navbar';
// import Search from './Search'

// export default function Main() {
//   const [user, loading, error] = useAuthState(auth);
//   const [userData, setUserData] = useState(null);
//   const [postData, setPostData] = useState(null);
//   const [activeComponent, setActiveComponent] = useState('feed'); // Default to Feed
//   const router = useRouter();

//   const handleUserCheck = useCallback(() => {
//     if (!user) {
//       router.push('/sign-in');
//       return;
//     }

//     const userDocRef = doc(db, 'users', user.uid);
//     const unsubscribeUser = onSnapshot(userDocRef, (docSnapshot) => {
//       if (docSnapshot.exists()) {
//         const data = docSnapshot.data();
//         setUserData(data);

//         const audio = new Audio(success);
//         audio.play().catch((err) => console.error('Failed to play sound:', err));
//       } else {
//         router.push('/error');
//       }
//     });

//     const postDocRef = doc(db, 'posts', 'posts');
//     const unsubscribePost = onSnapshot(postDocRef, (docSnapshot) => {
//       if (docSnapshot.exists()) {
//         const data = docSnapshot.data();
//         setPostData(data);
//       }
//     });

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

//   const renderComponent = () => {
//     switch (activeComponent) {
//       case 'profile':
//         return <Profile postData={postData} userData={userData} />;
//       case 'createPost':
//         return <CreatePost userData={userData} />;
//       case 'feed':
//       default:
//         return <Feed postData={postData} userData={userData} />;
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gray-100">
//       {/* Navbar */}
//       <Navbar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />

//       {/* Active Component */}
//       <section className="pt-16 ">{renderComponent()}</section>
//     </main>
//   );
// }



      {/* <Search postData={postData} userData={userData}/> */}





      {/* <Feed postData={postData} /> */}
