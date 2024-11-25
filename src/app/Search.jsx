'use client';

import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from '@/app/firebase/config';
import { CgProfile } from 'react-icons/cg';

export default function Search({ postData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [profileImages, setProfileImages] = useState({});
  const [postImages, setPostImages] = useState({});
  const [error, setError] = useState({});
  const [visiblePosts, setVisiblePosts] = useState(5);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const getUserPosts = () => {
    if (!postData || !selectedUser) return [];
    const allPosts = Object.entries(postData)
      .flatMap(([date, posts]) =>
        Object.entries(posts).map(([postId, postDetails]) => ({
          postId,
          ...postDetails,
        }))
      )
      .filter(
        (post) => post.userID === selectedUser.id && post.date?.seconds
      )
      .sort((a, b) => b.date.seconds - a.date.seconds);
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
    if (selectedUser) {
      const userPosts = getUserPosts();
      fetchImages(userPosts);
    }
  }, [postData, selectedUser, visiblePosts]);

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) {
      return 'Unknown Date';
    }
    const dateObj = new Date(timestamp.seconds * 1000);
    return dateObj.toLocaleString();
  };

  if (!selectedUser) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Search Users</h1>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name..."
          className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <ul className="space-y-2">
          {users
            .filter((user) =>
              user.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((user) => (
              <li
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className="p-2 border border-gray-200 rounded hover:bg-gray-100 cursor-pointer"
              >
                {user.name}
              </li>
            ))}
        </ul>
      </div>
    );
  }

  const userPosts = getUserPosts();

  return (
    <div className="profile max-w-3xl mx-auto p-6 bg-gray-50">
      <button
        onClick={() => setSelectedUser(null)}
        className="mb-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
      >
        Back to Search
      </button>
      <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
        {selectedUser.name}'s Posts
      </h2>
      {userPosts.length === 0 ? (
        <div className="text-center text-gray-600">No posts to display.</div>
      ) : (
        userPosts.map((post) => (
          <div
            key={post.postId}
            className="post bg-white p-6 rounded-lg shadow-xl transition-all duration-300 mb-6"
          >
            {/* The same UI layout as Profile */}
            ...
          </div>
        ))
      )}
      {userPosts.length < Object.keys(postData).length && (
        <div className="text-center mt-8">
          <button
            onClick={() => setVisiblePosts((prev) => prev + 5)}
            className="px-6 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-200"
          >
            Load More Posts
          </button>
        </div>
      )}
    </div>
  );
}
