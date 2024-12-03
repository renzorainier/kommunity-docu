'use client';

import React, { useState, useEffect } from 'react';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { db, storage } from '@/app/firebase/config'; // Firebase configuration
import { CgProfile } from 'react-icons/cg';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

export default function PostDetails({ postData, currentUser }) {
  const [profileImages, setProfileImages] = useState({});
  const [postImages, setPostImages] = useState({});
  const [error, setError] = useState({});
  const [visiblePosts, setVisiblePosts] = useState(5);

  // Fetch all posts for the logged-in user
  const getAllPosts = () => {
    if (!postData) return [];
    return Object.entries(postData)
      .flatMap(([date, posts]) =>
        Object.entries(posts).map(([postId, postDetails]) => ({
          postId,
          dateString: date,
          ...postDetails,
        }))
      )
      .filter((post) => post.userID === currentUser?.id && post.date?.seconds)
      .sort((a, b) => b.date.seconds - a.date.seconds);
  };

  const fetchImages = async (posts) => {
    const postImagePromises = posts.map((post) => {
      if (post.postPicRef) {
        const postImageRef = ref(storage, `posts/${post.postPicRef}/`);
        return listAll(postImageRef)
          .then((response) => {
            if (response.items.length === 0) {
              setError((prev) => ({ ...prev, [post.postId]: true }));
              return { postId, url: null };
            }
            return getDownloadURL(response.items[0]).then((url) => ({
              postId,
              url,
            }));
          })
          .catch(() => {
            setError((prev) => ({ ...prev, [post.postId]: true }));
            return { postId, url: null };
          });
      }
      return Promise.resolve({ postId: post.postId, url: null });
    });

    const resolvedPostImages = await Promise.all(postImagePromises);

    const postImageMap = resolvedPostImages.reduce((acc, { postId, url }) => {
      if (url) acc[postId] = url;
      return acc;
    }, {});

    setPostImages((prev) => ({ ...prev, ...postImageMap }));
  };

  const deletePost = async (date, postId) => {
    try {
      const postRef = doc(db, 'posts/posts');
      const fieldPath = `${date}.${postId}`;

      // Update Firestore by setting the post to null
      await updateDoc(postRef, {
        [fieldPath]: null,
      });

      // Optimistic UI update
      setPostData((prev) => {
        const updatedData = { ...prev };
        delete updatedData[date][postId];
        if (Object.keys(updatedData[date]).length === 0) delete updatedData[date];
        return updatedData;
      });
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  useEffect(() => {
    const userPosts = getAllPosts();
    fetchImages(userPosts);
  }, [postData, visiblePosts]);

  const userPosts = getAllPosts().slice(0, visiblePosts);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Posts</h2>
      <div className="space-y-6">
        {userPosts.map((post) => (
          <div key={post.postId} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={profileImages[post.userID] || ''}
                alt={`${currentUser.name}'s profile`}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="text-lg text-[#496992] font-bold">{post.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(post.date.seconds * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="text-[#496992] font-bold">{post.caption}</p>
            {post.postPicRef && postImages[post.postId] && (
              <img
                src={postImages[post.postId]}
                alt="Post"
                className="mt-4 w-full rounded-lg shadow-md"
              />
            )}
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="text-gray-500 hover:text-blue-500"
                onClick={() => console.log('Edit functionality')}
              >
                <FaEdit />
              </button>
              <button
                className="text-gray-500 hover:text-red-500"
                onClick={() => deletePost(post.dateString, post.postId)}
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ))}
      </div>
      {userPosts.length >= visiblePosts && (
        <button
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
          onClick={() => setVisiblePosts((prev) => prev + 5)}
        >
          Load More
        </button>
      )}
    </div>
  );
}
