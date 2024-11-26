"use client";

import React, { useState, useEffect } from "react";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "./firebase";
import { CgProfile } from "react-icons/cg";

export default function Feed({ postData, userData }) {
  const [profileImages, setProfileImages] = useState({});
  const [postImages, setPostImages] = useState({});
  const [error, setError] = useState({});
  const [visiblePosts, setVisiblePosts] = useState(5);

  const getAllPosts = () => {
    if (!postData) return [];
    return Object.entries(postData)
      .flatMap(([date, posts]) =>
        Object.entries(posts).map(([postId, postDetails]) => ({
          postId,
          ...postDetails,
        }))
      )
      .filter((post) => post.date && post.date.seconds)
      .sort((a, b) => b.date.seconds - a.date.seconds);
  };

  const getRecentPosts = () => {
    const allPosts = getAllPosts();
    return allPosts.slice(0, visiblePosts);
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

  useEffect(() => {
    const recentPosts = getRecentPosts();
    fetchImages(recentPosts);
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

  const allPosts = getAllPosts();
  const recentPosts = getRecentPosts();

  return (
    <div className="feed max-w-3xl mx-auto p-4 bg-white min-h-screen">
      {recentPosts.map((post) => (
        <div
          key={post.postId}
          className={`post bg-white p-6 rounded-lg shadow-md transition-all duration-300 mb-6 border-l-4 ${
            userData?.userID && post.userID === userData.userID
              ? "border-blue-400"
              : "border-gray-200"
          }`}>
          <div className="flex items-center space-x-4">
            {profileImages[post.postId] ? (
              <img
                src={profileImages[post.postId]}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
              />
            ) : error[post.postId] ? (
              <CgProfile size={48} className="text-gray-400" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Loading...</span>
              </div>
            )}
            <div>
              <p className="text-lg text-gray-800 font-semibold">{post.name}</p>
              <p className="text-sm text-gray-500">{formatDate(post.date)}</p>
            </div>
          </div>
          <p className="text-gray-800 mt-4">{post.caption}</p>

          <div className="mt-4 flex items-center space-x-2 text-sm">
            {post.category && (
              <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full">
                {post.category}
              </span>
            )}
            <span
              className={`py-1 px-3 rounded-full ${
                post.isAvailable
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}>
              {post.isAvailable ? "Available" : "Not Available"}
            </span>
          </div>

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
      ))}

      {/* Gradient Button */}
      <div className="text-center mt-8">
        <button
          onClick={() => setVisiblePosts((prev) => prev + 5)}
          className="px-6 py-3 bg-gradient-to-r from-orange-400 to-red-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          Load More Posts
        </button>
      </div>
    </div>
  );
}












// //working no edit data tho

// "use client";

// import React, { useState, useEffect } from "react";
// import { ref, getDownloadURL, listAll } from "firebase/storage";
// import { storage } from "./firebase"; // Ensure correct Firebase configuration
// import { CgProfile } from "react-icons/cg";

// export default function Feed({ postData, userData }) {
//   const [profileImages, setProfileImages] = useState({});
//   const [postImages, setPostImages] = useState({});
//   const [error, setError] = useState({});
//   const [visiblePosts, setVisiblePosts] = useState(5);

//   const getRecentPosts = () => {
//     if (!postData) return [];
//     const allPosts = Object.entries(postData)
//       .flatMap(([date, posts]) =>
//         Object.entries(posts).map(([postId, postDetails]) => ({
//           postId,
//           ...postDetails,
//         }))
//       )
//       .filter((post) => post.date && post.date.seconds)
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
//     const recentPosts = getRecentPosts();
//     fetchImages(recentPosts);
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

//   const recentPosts = getRecentPosts();

//   return (
//     <div className="feed max-w-3xl mx-auto p-6 bg-gray-50">

//       {recentPosts.map((post) => (
//         <div
//           key={post.postId}
//           className={`post bg-white p-6 rounded-lg shadow-xl transition-all duration-300 mb-6 ${
//             userData?.userID && post.userID === userData.userID
//               ? "ring-4 ring-blue-500"
//               : ""
//           }`}>
//           <div className="flex items-center space-x-4">
//             {profileImages[post.postId] ? (
//               <img
//                 src={profileImages[post.postId]}
//                 alt="Profile"
//                 className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-md"
//               />
//             ) : error[post.postId] ? (
//               <CgProfile size={48} className="text-gray-400" />
//             ) : (
//               <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
//                 <span className="text-gray-500">Loading...</span>
//               </div>
//             )}
//             <div>
//               <p className="text-lg text-gray-700 font-medium">{post.name}</p>
//               <p className="text-sm text-gray-500">{formatDate(post.date)}</p>
//             </div>
//           </div>
//           <p className="text-gray-800 mt-4 text-base">{post.caption}</p>

//           {/* Show Category and Availability */}
//           <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
//             {post.category && (
//               <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full">
//                 {post.category}
//               </span>
//             )}
//             <span
//               className={`py-1 px-3 rounded-full ${
//                 post.isAvailable
//                   ? "bg-green-100 text-green-800"
//                   : "bg-red-100 text-red-800"
//               }`}>
//               {post.isAvailable ? "Available" : "Not Available"}
//             </span>
//           </div>

//           {post.postPicRef && postImages[post.postId] ? (
//             <div className="mt-6">
//               <img
//                 src={postImages[post.postId]}
//                 alt="Post"
//                 className="w-full rounded-lg shadow-md object-cover"
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










// 'use client';

// import React, { useState, useEffect } from "react";
// import { ref, getDownloadURL, listAll, deleteObject } from "firebase/storage";
// import { storage } from "./firebase"; // Ensure correct Firebase configuration
// import { CgProfile } from "react-icons/cg";
// import { db } from "./firebase"; // Firestore import
// import { doc, updateDoc, deleteDoc } from "firebase/firestore"; // Firestore functions

// export default function Feed({ postData, userData }) {
//   const [profileImages, setProfileImages] = useState({});
//   const [postImages, setPostImages] = useState({});
//   const [error, setError] = useState({});
//   const [visiblePosts, setVisiblePosts] = useState(5);
//   const [showEditOptions, setShowEditOptions] = useState({});

//   const getRecentPosts = () => {
//     if (!postData) return [];
//     const allPosts = Object.entries(postData)
//       .flatMap(([date, posts]) =>
//         Object.entries(posts).map(([postId, postDetails]) => ({
//           postId,
//           date,
//           ...postDetails,
//         }))
//       )
//       .filter((post) => post.date && post.date.seconds)
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
//     const recentPosts = getRecentPosts();
//     fetchImages(recentPosts);
//   }, [postData, visiblePosts]);

//   const formatDate = (timestamp) => {
//     if (!timestamp || !timestamp.seconds) {
//       return "Unknown Date";
//     }
//     const dateObj = new Date(timestamp.seconds * 1000);
//     return dateObj.toLocaleString();
//   };

//   // Handle toggle availability (update Firestore)
//   const handleToggleAvailability = async (postId, date, isAvailable) => {
//     try {
//       const postRef = doc(db, 'posts/posts', date, postId); // Correct path for post
//       // Update the 'isAvailable' field
//       await updateDoc(postRef, {
//         isAvailable: !isAvailable, // Toggle the availability
//       });
//       console.log('Post availability updated');
//     } catch (error) {
//       console.error('Error updating post availability:', error);
//     }
//   };

//   // Handle delete post (remove from Firestore and Storage)
//   const handleDeletePost = async (postId, date, postPicRef) => {
//     try {
//       // Reference to the post document
//       const postRef = doc(db, 'posts/posts', date, postId);

//       // Delete the post image from Firebase Storage
//       if (postPicRef) {
//         const postPicRefObj = ref(storage, `posts/${postPicRef}`);
//         await deleteObject(postPicRefObj);
//         console.log('Post image deleted');
//       }

//       // Delete the post document from Firestore
//       await deleteDoc(postRef);
//       console.log('Post deleted');
//     } catch (error) {
//       console.error('Error deleting post:', error);
//     }
//   };

//   const recentPosts = getRecentPosts();

//   return (
//     <div className="feed max-w-3xl mx-auto p-6 bg-gray-50">
//       <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
//         Posts Feed
//       </h2>
//       {recentPosts.map((post) => (
//         <div
//           key={post.postId}
//           className={`post bg-white p-6 rounded-lg shadow-xl transition-all duration-300 mb-6 ${
//             userData?.userID && post.userID === userData.userID
//               ? "ring-4 ring-blue-500"
//               : ""
//           }`}>
//           {userData?.userID && post.userID === userData.userID && (
//             <div className="relative">
//               {/* Edit Button */}
//               <button
//                 onClick={() =>
//                   setShowEditOptions((prev) => ({
//                     ...prev,
//                     [post.postId]: !prev[post.postId],
//                   }))
//                 }
//                 className="absolute top-3 right-3 bg-gray-200 text-gray-800 p-2 rounded-full shadow-md">
//                 ...
//               </button>
//               {/* Edit Options */}
//               {showEditOptions[post.postId] && (
//                 <div className="absolute top-12 right-3 bg-white border rounded-lg shadow-md">
//                   <button
//                     onClick={() => handleToggleAvailability(post.postId, post.date, post.isAvailable)}
//                     className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
//                     {post.isAvailable ? "Mark as Unavailable" : "Mark as Available"}
//                   </button>
//                   <button
//                     onClick={() => handleDeletePost(post.postId, post.date, post.postPicRef)}
//                     className="block px-4 py-2 text-red-600 hover:bg-gray-100">
//                     Delete Post
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//           <div className="flex items-center space-x-4">
//             {profileImages[post.postId] ? (
//               <img
//                 src={profileImages[post.postId]}
//                 alt="Profile"
//                 className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-md"
//               />
//             ) : error[post.postId] ? (
//               <CgProfile size={48} className="text-gray-400" />
//             ) : (
//               <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
//                 <span className="text-gray-500">Loading...</span>
//               </div>
//             )}
//             <div>
//               <p className="text-lg text-gray-700 font-medium">{post.name}</p>
//               <p className="text-sm text-gray-500">{formatDate(post.date)}</p>
//             </div>
//           </div>
//           <p className="text-gray-800 mt-4 text-base">{post.caption}</p>

//           {/* Show Category and Availability */}
//           <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
//             {post.category && (
//               <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full">
//                 {post.category}
//               </span>
//             )}
//             <span
//               className={`py-1 px-3 rounded-full ${
//                 post.isAvailable
//                   ? "bg-green-100 text-green-800"
//                   : "bg-red-100 text-red-800"
//               }`}>
//               {post.isAvailable ? "Available" : "Unavailable"}
//             </span>
//           </div>

//           {/* Post Image */}
//           {postImages[post.postId] && (
//             <img
//               src={postImages[post.postId]}
//               alt="Post"
//               className="mt-4 w-full h-80 object-cover rounded-lg shadow-md"
//             />
//           )}
//         </div>
//       ))}
//       <button
//         onClick={() => setVisiblePosts((prev) => prev + 5)}
//         className="mt-8 w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700">
//         Load More
//       </button>
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

//     const userProfileMap = {}; // Store user profile images separately

//     posts.forEach((post) => {
//       const { postId, userProfileRef, postPicRef } = post;

//       // Fetch profile image only once per user
//       if (userProfileRef && !userProfileMap[userProfileRef]) {
//         const profileImageRef = ref(storage, `images/${userProfileRef}/`);
//         const profilePromise = listAll(profileImageRef)
//           .then((response) => {
//             if (response.items.length === 0) {
//               setError((prev) => ({ ...prev, [postId]: true }));
//               return { userProfileRef, url: null };
//             }
//             return getDownloadURL(response.items[0]).then((url) => ({ userProfileRef, url }));
//           })
//           .catch(() => {
//             setError((prev) => ({ ...prev, [postId]: true }));
//             return { userProfileRef, url: null };
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

//     const profileImageMap = resolvedProfileImages.reduce((acc, { userProfileRef, url }) => {
//       if (url) acc[userProfileRef] = url; // Map userProfileRef to URL
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
//             {profileImages[post.userProfileRef] ? (
//               <img
//                 src={profileImages[post.userProfileRef]}
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

//really working

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
