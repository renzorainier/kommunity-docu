'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { db, storage } from '@/app/firebase/config';
import { CgProfile } from 'react-icons/cg';

export default function Search({ postData, currentUser }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [profileImages, setProfileImages] = useState({});
  const [error, setError] = useState({});

  // Fetch all users and their profile pictures
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
        const filteredUsers = usersData.filter((user) => user.id !== currentUser?.id);
        setUsers(filteredUsers);
        setFilteredUsers(filteredUsers);

        // Fetch profile pictures for users
        const profilePicturePromises = filteredUsers.map(async (user) => {
          const profileImageRef = ref(storage, `images/${user.id}/`);
          try {
            const response = await listAll(profileImageRef);
            if (response.items.length > 0) {
              const url = await getDownloadURL(response.items[0]);
              return { userId: user.id, url };
            }
          } catch {
            // Handle errors gracefully by not setting a profile picture
          }
          return { userId: user.id, url: null };
        });

        const resolvedImages = await Promise.all(profilePicturePromises);
        const profileImageMap = resolvedImages.reduce((acc, { userId, url }) => {
          if (url) acc[userId] = url;
          return acc;
        }, {});

        setProfileImages(profileImageMap);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
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
        <ul className="space-y-4">
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className="flex items-center p-2 border border-gray-200 rounded hover:bg-gray-100 cursor-pointer"
            >
              {profileImages[user.id] ? (
                <img
                  src={profileImages[user.id]}
                  alt={`${user.name}'s profile`}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
              ) : (
                <CgProfile size={40} className="text-gray-400 mr-3" />
              )}
              <span className="text-lg text-gray-700">{user.name}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Render selected user's posts or details
  return (
    <div className="p-4">
      <button
        onClick={() => setSelectedUser(null)}
        className="mb-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
      >
        Back to Search
      </button>
      <h2 className="text-2xl font-bold mb-4">Posts by {selectedUser.name}</h2>
      {/* Render posts for the selected user */}
    </div>
  );
}
