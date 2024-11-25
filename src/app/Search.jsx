'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/firebase/config';

export default function Search({ postData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

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

        setUsers(usersData);
        setFilteredUsers(usersData); // Initialize filtered users
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Update the filtered users list based on the search query
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

  // Filter posts for the selected user
  useEffect(() => {
    if (selectedUser && postData) {
      const userSpecificPosts = Object.entries(postData)
        .flatMap(([date, posts]) =>
          Object.entries(posts).map(([postId, postDetails]) => ({
            postId,
            ...postDetails,
          }))
        )
        .filter((post) => post.userID === selectedUser.id);
      setUserPosts(userSpecificPosts);
    }
  }, [selectedUser, postData]);

  return (
    <div className="p-4">
      {!selectedUser ? (
        <>
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
                className="p-2 border border-gray-200 rounded hover:bg-gray-100 cursor-pointer"
              >
                {user.name}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div>
          <button
            onClick={() => setSelectedUser(null)}
            className="mb-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Back to Search
          </button>
          <h2 className="text-lg font-semibold">
            Posts by {selectedUser.name}
          </h2>
          {userPosts.length > 0 ? (
            <ul className="space-y-4 mt-4">
              {userPosts.map((post) => (
                <li
                  key={post.postId}
                  className="p-4 border border-gray-200 rounded shadow hover:shadow-lg"
                >
                  <h3 className="font-bold text-gray-800">{post.caption}</h3>
                  <p className="text-sm text-gray-500">
                    Category: {post.category || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Available: {post.isAvailable ? 'Yes' : 'No'}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-gray-500">No posts available for this user.</p>
          )}
        </div>
      )}
    </div>
  );
}
