'use client';

import React, { useState, useEffect } from "react";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "./firebase"; // Ensure correct Firebase configuration
import { CgProfile } from "react-icons/cg";

export default function Feed({ postData }) {
  const [profileImages, setProfileImages] = useState({});
  const [postImages, setPostImages] = useState({});
  const [error, setError] = useState({});
  const [visiblePosts, setVisiblePosts] = useState(5);

  // Sort and slice postData to get the most recent posts
  const getRecentPosts = () => {
    if (!postData) return [];
    const allPosts = Object.entries(postData)
      .flatMap(([date, posts]) =>
        Object.entries(posts).map(([postId, postDetails]) => ({
          postId,
          ...postDetails,
        }))
      )
      .sort((a, b) => b.date.seconds - a.date.seconds); // Sort by date (most recent first)
    return allPosts.slice(0, visiblePosts); // Limit to currently visible posts
  };

  const fetchImages = async (posts) => {
    const profileImagePromises = [];
    const postImagePromises = [];
    const userProfileRefs = new Set(); // Track users we have already fetched profile images for

    posts.forEach((post) => {
      const { postId, userProfileRef, postPicRef } = post;

      // Fetch profile image only once per user
      if (userProfileRef && !userProfileRefs.has(userProfileRef)) {
        userProfileRefs.add(userProfileRef);
        const profileImageRef = ref(storage, `images/${userProfileRef}/`);
        const profilePromise = listAll(profileImageRef)
          .then((response) => {
            if (response.items.length === 0) {
              setError((prev) => ({ ...prev, [postId]: true }));
              return { postId, url: null };
            }
            return getDownloadURL(response.items[0]).then((url) => ({ userProfileRef, url }));
          })
          .catch(() => {
            setError((prev) => ({ ...prev, [postId]: true }));
            return { postId, url: null };
          });
        profileImagePromises.push(profilePromise);
      }

      // Fetch post image
      if (postPicRef) {
        const postImageRef = ref(storage, `posts/${postPicRef}/`);
        const postPromise = listAll(postImageRef)
          .then((response) => {
            if (response.items.length === 0) {
              setError((prev) => ({ ...prev, [postId]: true }));
              return { postId, url: null };
            }
            return getDownloadURL(response.items[0]).then((url) => ({ postId, url }));
          })
          .catch(() => {
            setError((prev) => ({ ...prev, [postId]: true }));
            return { postId, url: null };
          });
        postImagePromises.push(postPromise);
      }
    });

    // Wait for all images to load
    const [resolvedProfileImages, resolvedPostImages] = await Promise.all([
      Promise.all(profileImagePromises),
      Promise.all(postImagePromises),
    ]);

    const profileImageMap = resolvedProfileImages.reduce((acc, { userProfileRef, url }) => {
      if (url) acc[userProfileRef] = url; // Store the URL by userProfileRef (user ID)
      return acc;
    }, {});
    const postImageMap = resolvedPostImages.reduce((acc, { postId, url }) => {
      if (url) acc[postId] = url;
      return acc;
    }, {});

    setProfileImages((prev) => ({ ...prev, ...profileImageMap }));
    setPostImages((prev) => ({ ...prev, ...postImageMap }));
  };

  useEffect(() => {
    const recentPosts = getRecentPosts();
    fetchImages(recentPosts);
  }, [postData, visiblePosts]);

  if (!postData) {
    return <div className="text-center text-gray-600">No posts available.</div>;
  }

  const formatDate = (timestamp) => {
    const dateObj = new Date(timestamp.seconds * 1000);
    return dateObj.toLocaleString(); // Convert to a readable date string
  };

  const recentPosts = getRecentPosts();

  return (
    <div className="feed max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Posts Feed</h2>
      {recentPosts.map((post) => (
        <div key={post.postId} className="post border border-gray-200 rounded-lg p-4 bg-white shadow-md">
          <div className="flex items-center space-x-4">
            {profileImages[post.userProfileRef] ? (
              <img
                src={profileImages[post.userProfileRef]}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover shadow-md"
              />
            ) : error[post.postId] ? (
              <CgProfile size={48} className="text-gray-400" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Loading...</span>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">
                <strong>Posted by:</strong> {post.name}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Date:</strong> {formatDate(post.date)}
              </p>
            </div>
          </div>
          <p className="text-gray-700 mt-4">
            <strong>Caption:</strong> {post.caption}
          </p>
          {post.postPicRef && postImages[post.postId] ? (
            <div className="mt-4">
              <img
                src={postImages[post.postId]}
                alt="Post Image"
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          ) : (
            post.postPicRef && (
              <p className="text-gray-500 mt-4">Loading post image...</p>
            )
          )}
        </div>
      ))}
      {recentPosts.length < Object.keys(postData).length && (
        <div className="text-center mt-6">
          <button
            onClick={() => setVisiblePosts((prev) => prev + 5)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}



// 'use client';

// import React, { useState, useEffect } from "react";
// import { ref, getDownloadURL, listAll } from "firebase/storage";
// import { storage } from "./firebase"; // Ensure correct Firebase configuration
// import { CgProfile } from "react-icons/cg";

// export default function Feed({ postData }) {
//   const [profileImages, setProfileImages] = useState({});
//   const [postImages, setPostImages] = useState({});
//   const [error, setError] = useState({});
//   const [visiblePosts, setVisiblePosts] = useState(5);

//   // Sort and slice postData to get the most recent posts
//   const getRecentPosts = () => {
//     if (!postData) return [];
//     const allPosts = Object.entries(postData)
//       .flatMap(([date, posts]) =>
//         Object.entries(posts).map(([postId, postDetails]) => ({
//           postId,
//           ...postDetails,
//         }))
//       )
//       .sort((a, b) => b.date.seconds - a.date.seconds); // Sort by date (most recent first)
//     return allPosts.slice(0, visiblePosts); // Limit to currently visible posts
//   };

//   const fetchImages = async (posts) => {
//     const profileImagePromises = [];
//     const postImagePromises = [];

//     posts.forEach((post) => {
//       const { postId, userProfileRef, postPicRef } = post;

//       // Fetch profile image
//       if (userProfileRef) {
//         const profileImageRef = ref(storage, `images/${userProfileRef}/`);
//         const profilePromise = listAll(profileImageRef)
//           .then((response) => {
//             if (response.items.length === 0) {
//               setError((prev) => ({ ...prev, [postId]: true }));
//               return { postId, url: null };
//             }
//             return getDownloadURL(response.items[0]).then((url) => ({ postId, url }));
//           })
//           .catch(() => {
//             setError((prev) => ({ ...prev, [postId]: true }));
//             return { postId, url: null };
//           });
//         profileImagePromises.push(profilePromise);
//       }

//       // Fetch post image
//       if (postPicRef) {
//         const postImageRef = ref(storage, `posts/${postPicRef}/`);
//         const postPromise = listAll(postImageRef)
//           .then((response) => {
//             if (response.items.length === 0) {
//               setError((prev) => ({ ...prev, [postId]: true }));
//               return { postId, url: null };
//             }
//             return getDownloadURL(response.items[0]).then((url) => ({ postId, url }));
//           })
//           .catch(() => {
//             setError((prev) => ({ ...prev, [postId]: true }));
//             return { postId, url: null };
//           });
//         postImagePromises.push(postPromise);
//       }
//     });

//     // Wait for all images to load
//     const [resolvedProfileImages, resolvedPostImages] = await Promise.all([
//       Promise.all(profileImagePromises),
//       Promise.all(postImagePromises),
//     ]);

//     const profileImageMap = resolvedProfileImages.reduce((acc, { postId, url }) => {
//       if (url) acc[postId] = url;
//       return acc;
//     }, {});
//     const postImageMap = resolvedPostImages.reduce((acc, { postId, url }) => {
//       if (url) acc[postId] = url;
//       return acc;
//     }, {});

//     setProfileImages((prev) => ({ ...prev, ...profileImageMap }));
//     setPostImages((prev) => ({ ...prev, ...postImageMap }));
//   };

//   useEffect(() => {
//     const recentPosts = getRecentPosts();
//     fetchImages(recentPosts);
//   }, [postData, visiblePosts]);

//   if (!postData) {
//     return <div className="text-center text-gray-600">No posts available.</div>;
//   }

//   const formatDate = (timestamp) => {
//     const dateObj = new Date(timestamp.seconds * 1000);
//     return dateObj.toLocaleString(); // Convert to a readable date string
//   };

//   const recentPosts = getRecentPosts();

//   return (
//     <div className="feed max-w-3xl mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Posts Feed</h2>
//       {recentPosts.map((post) => (
//         <div key={post.postId} className="post border border-gray-200 rounded-lg p-4 bg-white shadow-md">
//           <div className="flex items-center space-x-4">
//             {profileImages[post.postId] ? (
//               <img
//                 src={profileImages[post.postId]}
//                 alt="Profile"
//                 className="w-12 h-12 rounded-full object-cover shadow-md"
//               />
//             ) : error[post.postId] ? (
//               <CgProfile size={48} className="text-gray-400" />
//             ) : (
//               <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
//                 <span className="text-gray-500 text-sm">Loading...</span>
//               </div>
//             )}
//             <div>
//               <p className="text-sm text-gray-500">
//                 <strong>Posted by:</strong> {post.name}
//               </p>
//               <p className="text-sm text-gray-500">
//                 <strong>Date:</strong> {formatDate(post.date)}
//               </p>
//             </div>
//           </div>
//           <p className="text-gray-700 mt-4">
//             <strong>Caption:</strong> {post.caption}
//           </p>
//           {post.postPicRef && postImages[post.postId] ? (
//             <div className="mt-4">
//               <img
//                 src={postImages[post.postId]}
//                 alt="Post Image"
//                 className="w-full h-auto rounded-lg shadow-md"
//               />
//             </div>
//           ) : (
//             post.postPicRef && (
//               <p className="text-gray-500 mt-4">Loading post image...</p>
//             )
//           )}
//         </div>
//       ))}
//       {recentPosts.length < Object.keys(postData).length && (
//         <div className="text-center mt-6">
//           <button
//             onClick={() => setVisiblePosts((prev) => prev + 5)}
//             className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
//           >
//             Load More
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }












// 'use client';

// import React, { useState, useEffect } from "react";
// import { ref, getDownloadURL, listAll } from "firebase/storage";
// import { storage } from "./firebase"; // Ensure correct Firebase configuration
// import { CgProfile } from "react-icons/cg";

// export default function Feed({ postData }) {
//   const [profileImages, setProfileImages] = useState({});
//   const [postImages, setPostImages] = useState({});
//   const [error, setError] = useState({});

//   useEffect(() => {
//     const fetchImages = async () => {
//       if (!postData) return;

//       const profileImagePromises = [];
//       const postImagePromises = [];

//       Object.entries(postData).forEach(([_, posts]) => {
//         Object.entries(posts).forEach(([postId, postDetails]) => {
//           // Fetch profile image
//           if (postDetails.userProfileRef) {
//             const profileImageRef = ref(storage, `images/${postDetails.userProfileRef}/`);
//             console.log("Fetching profile image from folder:", `images/${postDetails.userProfileRef}/`);

//             const profilePromise = listAll(profileImageRef)
//               .then((response) => {
//                 if (response.items.length === 0) {
//                   setError((prev) => ({ ...prev, [postId]: true }));
//                   return { postId, url: null };
//                 }
//                 return getDownloadURL(response.items[0]).then((url) => ({ postId, url }));
//               })
//               .catch(() => {
//                 setError((prev) => ({ ...prev, [postId]: true }));
//                 return { postId, url: null };
//               });
//             profileImagePromises.push(profilePromise);
//           }

//           // Fetch post image
//           if (postDetails.postPicRef) {
//             const postImageRef = ref(storage, `posts/${postDetails.postPicRef}/`);
//             console.log("Fetching post image from folder:", `posts/${postDetails.postPicRef}/`);

//             const postPromise = listAll(postImageRef)
//               .then((response) => {
//                 if (response.items.length === 0) {
//                   setError((prev) => ({ ...prev, [postId]: true }));
//                   return { postId, url: null };
//                 }
//                 return getDownloadURL(response.items[0]).then((url) => ({ postId, url }));
//               })
//               .catch(() => {
//                 setError((prev) => ({ ...prev, [postId]: true }));
//                 return { postId, url: null };
//               });
//             postImagePromises.push(postPromise);
//           }
//         });
//       });

//       // Wait for both profile and post images to be fetched
//       const [resolvedProfileImages, resolvedPostImages] = await Promise.all([
//         Promise.all(profileImagePromises),
//         Promise.all(postImagePromises),
//       ]);

//       const profileImageMap = resolvedProfileImages.reduce((acc, { postId, url }) => {
//         if (url) acc[postId] = url;
//         return acc;
//       }, {});
//       const postImageMap = resolvedPostImages.reduce((acc, { postId, url }) => {
//         if (url) acc[postId] = url;
//         return acc;
//       }, {});

//       setProfileImages(profileImageMap);
//       setPostImages(postImageMap);
//     };

//     fetchImages();
//   }, [postData]);

//   if (!postData) {
//     return <div className="text-center text-gray-600">No posts available.</div>;
//   }

//   const formatDate = (timestamp) => {
//     const dateObj = new Date(timestamp.seconds * 1000);
//     return dateObj.toLocaleString(); // Convert to a readable date string
//   };

//   return (
//     <div className="feed max-w-3xl mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Posts Feed</h2>
//       {Object.entries(postData).map(([date, posts]) => (
//         <div key={date} className="date-group mb-8">
//           <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">{date}</h3>
//           <div className="posts space-y-6">
//             {Object.entries(posts).map(([postId, postDetails]) => (
//               <div key={postId} className="post border border-gray-200 rounded-lg p-4 bg-white shadow-md">
//                 <div className="flex items-center space-x-4">
//                   {profileImages[postId] ? (
//                     <img
//                       src={profileImages[postId]}
//                       alt="Profile"
//                       className="w-12 h-12 rounded-full object-cover shadow-md"
//                     />
//                   ) : error[postId] ? (
//                     <CgProfile size={48} className="text-gray-400" />
//                   ) : (
//                     <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
//                       <span className="text-gray-500 text-sm">Loading...</span>
//                     </div>
//                   )}
//                   <div>
//                     <p className="text-sm text-gray-500"><strong>Posted by:</strong> {postDetails.name}</p>
//                     <p className="text-sm text-gray-500"><strong>Date:</strong> {formatDate(postDetails.date)}</p>
//                   </div>
//                 </div>
//                 <p className="text-gray-700 mt-4"><strong>Caption:</strong> {postDetails.caption}</p>
//                 {postDetails.postPicRef && postImages[postId] ? (
//                   <div className="mt-4">
//                     <img
//                       src={postImages[postId]}
//                       alt="Post Image"
//                       className="w-full h-auto rounded-lg shadow-md"
//                     />
//                   </div>
//                 ) : (
//                   postDetails.postPicRef && (
//                     <p className="text-gray-500 mt-4">Loading post image...</p>
//                   )
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
