'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { db, storage } from '@/app/firebase/config'; // Firebase configuration
import { CgProfile } from 'react-icons/cg';

export default function Search({ postData, currentUser }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [profileImages, setProfileImages] = useState({});

  // Fetch all users and their profile images
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const snapshot = await getDocs(usersCollection);

        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Exclude logged-in user from the list
        const filteredUsers = usersData.filter((user) => user.id !== currentUser?.id);
        setUsers(filteredUsers);

        // Fetch profile images for users
        const profileImagePromises = filteredUsers.map(async (user) => {
          const profileImageRef = ref(storage, `images/${user.id}/`);
          try {
            const response = await listAll(profileImageRef);
            if (response.items.length > 0) {
              const url = await getDownloadURL(response.items[0]);
              return { userId: user.id, url };
            }
          } catch {
            return { userId: user.id, url: null };
          }
        });

        const resolvedImages = await Promise.all(profileImagePromises);
        const profileImageMap = resolvedImages.reduce((acc, { userId, url }) => {
          if (url) acc[userId] = url;
          return acc;
        }, {});

        setProfileImages(profileImageMap);
        setFilteredUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [currentUser]);

  // Filter users based on the search query
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

  // Format Firestore timestamps
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
    return userPosts;
  };

  if (!selectedUser) {
    return (
      <div className="p-6 bg-[#F8FAFB] min-h-screen">
        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for users..."
            className="w-full p-3 rounded-lg bg-[#E0EAF6] text-gray-500 border-none shadow-md focus:outline-none focus:ring-2 focus:ring-[#B7CCE5]"
          />
        </div>

        {/* Recent Users */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Users</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className="cursor-pointer text-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              {profileImages[user.id] ? (
                <img
                  src={profileImages[user.id]}
                  alt={`${user.name}'s profile`}
                  className="w-20 h-20 mx-auto rounded-full border-2 border-gray-300 shadow-sm object-cover"
                />
              ) : (
                <CgProfile size={80} className="text-gray-400 mx-auto" />
              )}
              <span className="block mt-4 text-gray-700 font-medium">{user.name}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const userPosts = getUserPosts();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => setSelectedUser(null)}
        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow-md hover:bg-gray-400 transition mb-6"
      >
        Back
      </button>
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Posts by {selectedUser.name}
      </h2>
      <div className="space-y-6">
        {userPosts.map((post) => (
          <div
            key={post.postId}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={profileImages[selectedUser.id] || ''}
                alt={`${selectedUser.name}'s profile`}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="text-lg text-[#496992] font-bold">{post.name}</p>
                <p className="text-sm text-gray-500">{formatDate(post.date)}</p>
              </div>
            </div>
            <p className="text-gray-800 font-medium">{post.caption}</p>
            {post.postPicRef && (
              <img
                src={post.postPicRef}
                alt="Post"
                className="mt-4 w-full rounded-lg shadow-md"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}



