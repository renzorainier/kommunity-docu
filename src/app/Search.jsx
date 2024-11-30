'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { db, storage } from '@/app/firebase/config'; // Ensure proper Firebase configuration
import { CgProfile } from 'react-icons/cg';

export default function Search({ currentUser }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Fetch users and profile images
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const snapshot = await getDocs(usersCollection);

        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Exclude current logged-in user
        const filteredUsers = usersData.filter((user) => user.id !== currentUser?.id);
        setUsers(filteredUsers);

        // Fetch profile images for users
        const profilePicturePromises = filteredUsers.map(async (user) => {
          const profileImageRef = ref(storage, `images/${user.id}/`);
          try {
            const response = await listAll(profileImageRef);
            if (response.items.length > 0) {
              const url = await getDownloadURL(response.items[0]);
              return { userId: user.id, url };
            }
          } catch {
            // Skip if no profile image is found
          }
          return { userId: user.id, url: null };
        });

        const resolvedImages = await Promise.all(profilePicturePromises);
        const profileImageMap = resolvedImages.reduce((acc, { userId, url }) => {
          if (url) acc[userId] = url;
          return acc;
        }, {});

        setFilteredUsers(
          filteredUsers.map((user) => ({
            ...user,
            profileImage: profileImageMap[user.id] || null,
          }))
        );
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [currentUser]);

  // Filter users by search query
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

  return (
    <div className="p-4">
      {/* Search Bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search"
        className="w-full p-3 bg-[#E0EAF6] text-gray-400 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-[#B7CCE5]"
      />

      {/* Recent Section */}
      <h2 className="mt-6 mb-2 text-lg font-bold text-gray-800">Recent</h2>
      <ul className="flex space-x-6 overflow-auto">
        {filteredUsers.map((user) => (
          <li
            key={user.id}
            className="flex flex-col items-center cursor-pointer"
          >
            <div className="relative">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={`${user.name}'s profile`}
                  className="w-16 h-16 rounded-full border-2 border-gray-300 shadow-sm object-cover"
                />
              ) : (
                <CgProfile size={64} className="text-gray-400 mx-auto" />
              )}
            </div>
            <span
              className="block text-sm text-gray-700 mt-2 truncate"
              style={{ maxWidth: '80px' }}
            >
              {user.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}




