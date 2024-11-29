"use client";

import React, { useState, useEffect } from "react";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "./firebase"; // Ensure correct Firebase configuration
import { CgProfile } from "react-icons/cg";
import Header from "./Header";

export default function Profile({ postData, userData }) {
  const [profileImages, setProfileImages] = useState({});
  const [postImages, setPostImages] = useState({});
  const [error, setError] = useState({});
  const [visiblePosts, setVisiblePosts] = useState(5);

  const getUserPosts = () => {
    if (!postData || !userData?.userID) return [];
    const allPosts = Object.entries(postData)
      .flatMap(([date, posts]) =>
        Object.entries(posts).map(([postId, postDetails]) => ({
          postId,
          ...postDetails,
        }))
      )
      .filter((post) => post.userID === userData.userID && post.date?.seconds) // Filter for user's posts only
      .sort((a, b) => b.date.seconds - a.date.seconds);
    return allPosts;
  };

  const fetchImages = async (posts) => {
    const profileImagePromises = [];
    const postImagePromises = [];

    posts.forEach((post) => {
      const { postId, userProfileRef, postPicRef } = post;

      if (userProfileRef) {
        const profileImageRef = ref(storage, `images/${userProfileRef}/`);
        const profilePromise = listAll(profileImageRef)
          .then((response) => {
            if (response.items.length === 0) {
              setError((prev) => ({ ...prev, [postId]: true }));
              return { postId, url: null };
            }
            return getDownloadURL(response.items[0]).then((url) => ({
              postId,
              url,
            }));
          })
          .catch(() => {
            setError((prev) => ({ ...prev, [postId]: true }));
            return { postId, url: null };
          });
        profileImagePromises.push(profilePromise);
      }

      if (postPicRef) {
        const postImageRef = ref(storage, `posts/${postPicRef}/`);
        const postPromise = listAll(postImageRef)
          .then((response) => {
            if (response.items.length === 0) {
              setError((prev) => ({ ...prev, [postId]: true }));
              return { postId, url: null };
            }
            return getDownloadURL(response.items[0]).then((url) => ({
              postId,
              url,
            }));
          })
          .catch(() => {
            setError((prev) => ({ ...prev, [postId]: true }));
            return { postId, url: null };
          });
        postImagePromises.push(postPromise);
      }
    });

    const [resolvedProfileImages, resolvedPostImages] = await Promise.all([
      Promise.all(profileImagePromises),
      Promise.all(postImagePromises),
    ]);

    const profileImageMap = resolvedProfileImages.reduce(
      (acc, { postId, url }) => {
        if (url) acc[postId] = url;
        return acc;
      },
      {}
    );
    const postImageMap = resolvedPostImages.reduce((acc, { postId, url }) => {
      if (url) acc[postId] = url;
      return acc;
    }, {});

    setProfileImages((prev) => ({ ...prev, ...profileImageMap }));
    setPostImages((prev) => ({ ...prev, ...postImageMap }));
  };

  const visibleUserPosts = getUserPosts().slice(0, visiblePosts);

  useEffect(() => {
    fetchImages(visibleUserPosts);
  }, [postData, visiblePosts]);

  if (!postData) {
    return <div className="text-center text-gray-600">No posts available.</div>;
  }

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) {
      return "Unknown Date";
    }
    const dateObj = new Date(timestamp.seconds * 1000);
    return dateObj.toLocaleString();
  };

  const allUserPosts = getUserPosts();

  return (
    <div>
      {/* Header Section */}
      <Header userData={userData} />

      {/* Profile Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center">

      </div>

      {/* Posts Section */}
      {visibleUserPosts.length === 0 ? (
        <div className="text-center text-gray-600">No posts to display.</div>
      ) : (
        visibleUserPosts.map((post) => (
          <div
            key={post.postId}
            className="post bg-[#E0EAF6] p-6 rounded-lg shadow-lg mb-6 overflow-hidden"
          >
            <div className="flex items-center space-x-4 mb-4">
              {profileImages[post.postId] ? (
                <img
                  src={profileImages[post.postId]}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-md"
                />
              ) : error[post.postId] ? (
                <CgProfile size={48} className="text-gray-400" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Loading...</span>
                </div>
              )}
              <div>
                <p className="text-lg text-gray-700 font-medium">{post.name}</p>
                <p className="text-sm text-gray-500">{formatDate(post.date)}</p>
              </div>
            </div>

            {/* Badges Section */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {post.category && (
                <span className="bg-[#5856D6] text-white font-bold py-1 px-3 rounded-full">
                  {post.category}
                </span>
              )}
              <span
                className={`py-1 px-3 rounded-full ${
                  post.isAvailable
                    ? "bg-[#B3BBC5] text-white font-bold"
                    : "bg-red-100 text-red-800 font-bold"
                }`}
              >
                {post.isAvailable ? "Available" : "Not Available"}
              </span>
              <span
                className={`py-1 px-3 rounded-full ${
                  post.isVolunteer
                    ? "bg-[#FBBC2E] text-black font-bold"
                    : "bg-[#FF3B30] text-white font-bold"
                }`}
              >
                {post.isVolunteer ? "Volunteer" : "Paid"}
              </span>
            </div>

            {/* Caption Section */}
            <p className="mt-4 text-gray-800">{post.caption}</p>

            {/* Post Image */}
            {post.postPicRef && postImages[post.postId] ? (
              <div className="mt-6">
                <img
                  src={postImages[post.postId]}
                  alt="Post"
                  className="w-full rounded-lg shadow-md object-cover"
                />
              </div>
            ) : (
              post.postPicRef && (
                <p className="text-gray-500 mt-4">Loading post image...</p>
              )
            )}
          </div>
        ))
      )}

      {visibleUserPosts.length < allUserPosts.length && (
        <div className="text-center mt-8">
          <button
            onClick={() => setVisiblePosts((prev) => prev + 5)}
            className="px-6 py-3 bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Load More Posts
          </button>
        </div>
      )}
    </div>
  );
}





// "use client";

// import React, { useState, useEffect } from "react";
// import { ref, getDownloadURL, listAll } from "firebase/storage";
// import { storage } from "./firebase"; // Ensure correct Firebase configuration
// import { CgProfile } from "react-icons/cg";

// export default function Profile({ postData, userData }) {
//   const [profileImages, setProfileImages] = useState({});
//   const [postImages, setPostImages] = useState({});
//   const [error, setError] = useState({});
//   const [visiblePosts, setVisiblePosts] = useState(5);

//   const getUserPosts = () => {
//     if (!postData || !userData?.userID) return [];
//     const allPosts = Object.entries(postData)
//       .flatMap(([date, posts]) =>
//         Object.entries(posts).map(([postId, postDetails]) => ({
//           postId,
//           ...postDetails,
//         }))
//       )
//       .filter(
//         (post) => post.userID === userData.userID && post.date?.seconds
//       ) // Filter for user's posts only
//       .sort((a, b) => b.date.seconds - a.date.seconds);
//     return allPosts.slice(0, visiblePosts);
//   };

//   const fetchImages = async (posts) => {
//     const profileImagePromises = [];
//     const postImagePromises = [];

//     posts.forEach((post) => {
//       const { postId, userProfileRef, postPicRef } = post;

//       if (userProfileRef) {
//         const profileImageRef = ref(storage, `images/${userProfileRef}/`);
//         const profilePromise = listAll(profileImageRef)
//           .then((response) => {
//             if (response.items.length === 0) {
//               setError((prev) => ({ ...prev, [postId]: true }));
//               return { postId, url: null };
//             }
//             return getDownloadURL(response.items[0]).then((url) => ({
//               postId,
//               url,
//             }));
//           })
//           .catch(() => {
//             setError((prev) => ({ ...prev, [postId]: true }));
//             return { postId, url: null };
//           });
//         profileImagePromises.push(profilePromise);
//       }

//       if (postPicRef) {
//         const postImageRef = ref(storage, `posts/${postPicRef}/`);
//         const postPromise = listAll(postImageRef)
//           .then((response) => {
//             if (response.items.length === 0) {
//               setError((prev) => ({ ...prev, [postId]: true }));
//               return { postId, url: null };
//             }
//             return getDownloadURL(response.items[0]).then((url) => ({
//               postId,
//               url,
//             }));
//           })
//           .catch(() => {
//             setError((prev) => ({ ...prev, [postId]: true }));
//             return { postId, url: null };
//           });
//         postImagePromises.push(postPromise);
//       }
//     });

//     const [resolvedProfileImages, resolvedPostImages] = await Promise.all([
//       Promise.all(profileImagePromises),
//       Promise.all(postImagePromises),
//     ]);

//     const profileImageMap = resolvedProfileImages.reduce(
//       (acc, { postId, url }) => {
//         if (url) acc[postId] = url;
//         return acc;
//       },
//       {}
//     );
//     const postImageMap = resolvedPostImages.reduce((acc, { postId, url }) => {
//       if (url) acc[postId] = url;
//       return acc;
//     }, {});

//     setProfileImages((prev) => ({ ...prev, ...profileImageMap }));
//     setPostImages((prev) => ({ ...prev, ...postImageMap }));
//   };

//   useEffect(() => {
//     const userPosts = getUserPosts();
//     fetchImages(userPosts);
//   }, [postData, visiblePosts]);

//   if (!postData) {
//     return <div className="text-center text-gray-600">No posts available.</div>;
//   }

//   const formatDate = (timestamp) => {
//     if (!timestamp || !timestamp.seconds) {
//       return "Unknown Date";
//     }
//     const dateObj = new Date(timestamp.seconds * 1000);
//     return dateObj.toLocaleString();
//   };

//   const userPosts = getUserPosts();

//   return (
//     <div className="profile max-w-3xl mx-auto p-6 bg-gray-50">
//       <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
//         My Posts
//       </h2>
//       {userPosts.length === 0 ? (
//         <div className="text-center text-gray-600">No posts to display.</div>
//       ) : (
//         userPosts.map((post) => (
//           <div
//             key={post.postId}
//             className="post bg-white p-6 rounded-lg shadow-xl transition-all duration-300 mb-6">
//             <div className="flex items-center space-x-4">
//               {profileImages[post.postId] ? (
//                 <img
//                   src={profileImages[post.postId]}
//                   alt="Profile"
//                   className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-md"
//                 />
//               ) : error[post.postId] ? (
//                 <CgProfile size={48} className="text-gray-400" />
//               ) : (
//                 <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
//                   <span className="text-gray-500">Loading...</span>
//                 </div>
//               )}
//               <div>
//                 <p className="text-lg text-gray-700 font-medium">{post.name}</p>
//                 <p className="text-sm text-gray-500">{formatDate(post.date)}</p>
//               </div>
//             </div>
//             <p className="text-gray-800 mt-4 text-base">{post.caption}</p>

//             <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
//               {post.category && (
//                 <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full">
//                   {post.category}
//                 </span>
//               )}
//               <span
//                 className={`py-1 px-3 rounded-full ${
//                   post.isAvailable
//                     ? "bg-green-100 text-green-800"
//                     : "bg-red-100 text-red-800"
//                 }`}>
//                 {post.isAvailable ? "Available" : "Not Available"}
//               </span>
//             </div>

//             {post.postPicRef && postImages[post.postId] ? (
//               <div className="mt-6">
//                 <img
//                   src={postImages[post.postId]}
//                   alt="Post"
//                   className="w-full rounded-lg shadow-md object-cover"
//                 />
//               </div>
//             ) : (
//               post.postPicRef && (
//                 <p className="text-gray-500 mt-4">Loading post image...</p>
//               )
//             )}
//           </div>
//         ))
//       )}
//       {userPosts.length < Object.keys(postData).length && (
//         <div className="text-center mt-8">
//           <button
//             onClick={() => setVisiblePosts((prev) => prev + 5)}
//             className="px-6 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-200">
//             Load More Posts
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
