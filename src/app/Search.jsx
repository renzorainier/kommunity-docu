'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { db, storage } from '@/app/firebase/config'; // Ensure proper Firebase configuration
import { CgProfile } from 'react-icons/cg';

export default function Search({ postData, currentUser }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [visiblePosts, setVisiblePosts] = useState(5);
  const [profileImages, setProfileImages] = useState({});
  const [postImages, setPostImages] = useState({});
  const [error, setError] = useState({});

  // Fetch all users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const snapshot = await getDocs(usersCollection);

        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter out the logged-in user
        const filteredUsers = usersData.filter(
          (user) => user.id !== currentUser?.id
        );

        setUsers(filteredUsers);
        setFilteredUsers(filteredUsers);

        // Fetch profile images for all users
        const profileImagePromises = filteredUsers.map((user) =>
          fetchUserProfileImage(user.id)
        );

        const profileImagesMap = await Promise.all(profileImagePromises);
        setProfileImages(Object.assign({}, ...profileImagesMap));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchUserProfileImage = async (userId) => {
      const profileImageRef = ref(storage, `images/${userId}/`);
      try {
        const response = await listAll(profileImageRef);
        if (response.items.length > 0) {
          const url = await getDownloadURL(response.items[0]);
          return { [userId]: url };
        }
      } catch (err) {
        console.error(`Error fetching profile image for user ${userId}:`, err);
      }
      return { [userId]: null };
    };

    fetchUsers();
  }, [currentUser]);

  // Update filtered users based on the search query
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredUsers(users);
    } else {
      const results = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(results);
    }
  }, [searchQuery, users]);

  const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return '';
    const date = new Date(timestamp.seconds * 1000);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const getUserPosts = () => {
    if (!postData || !selectedUser) return [];
    const userPosts = Object.entries(postData)
      .flatMap(([date, posts]) =>
        Object.entries(posts).map(([postId, postDetails]) => ({
          postId,
          ...postDetails,
        }))
      )
      .filter((post) => post.userID === selectedUser.id && post.date?.seconds)
      .sort((a, b) => b.date.seconds - a.date.seconds);
    return userPosts.slice(0, visiblePosts);
  };

  const fetchImages = async (posts) => {
    // ... Existing image fetching logic for posts
  };

  useEffect(() => {
    const userPosts = getUserPosts();
    fetchImages(userPosts);
  }, [selectedUser, visiblePosts]);

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
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className="flex items-center space-x-4 p-2 border border-gray-200 rounded hover:bg-gray-100 cursor-pointer"
            >
              {profileImages[user.id] ? (
                <img
                  src={profileImages[user.id]}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <CgProfile size={40} className="text-gray-400" />
              )}
              <span>{user.name}</span>
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
        Posts by {selectedUser.name}
      </h2>
      {userPosts.map((post) => (
        <div
          key={post.postId}
          className="post bg-white p-6 rounded-lg shadow-xl transition-all duration-300 mb-6"
        >
          <div className="flex items-center space-x-4">
            {profileImages[post.postId] ? (
              <img
                src={profileImages[post.postId]}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-md"
              />
            ) : (
              <CgProfile size={48} className="text-gray-400" />
            )}
            <div>
              <p className="text-lg text-gray-700 font-medium">{post.name}</p>
              <p className="text-sm text-gray-500">{formatDate(post.date)}</p>
            </div>
          </div>
          <p className="text-gray-800 mt-4">{post.caption}</p>

          {/* Show Category and Availability */}
          <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
            {post.category && (
              <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full">
                {post.category}
              </span>
            )}
            <span
              className={`py-1 px-3 rounded-full ${
                post.isAvailable
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {post.isAvailable ? 'Available' : 'Not Available'}
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
    </div>
  );
}
