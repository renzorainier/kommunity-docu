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
    const postImagePromises = posts.map((post) => {
      if (post.postPicRef) {
        const postImageRef = ref(storage, `posts/${post.postPicRef}/`);
        return listAll(postImageRef)
          .then((response) => {
            if (response.items.length === 0) {
              setError((prev) => ({ ...prev, [post.postId]: true }));
              return { postId: post.postId, url: null };
            }
            return getDownloadURL(response.items[0]).then((url) => ({
              postId: post.postId,
              url,
            }));
          })
          .catch(() => {
            setError((prev) => ({ ...prev, [post.postId]: true }));
            return { postId: post.postId, url: null };
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

  useEffect(() => {
    const userPosts = getUserPosts();
    fetchImages(userPosts);
  }, [selectedUser, visiblePosts]);

  if (!selectedUser) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Search Users</h1>
        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          />
        </div>
        <div className="flex items-center space-x-3 overflow-x-auto py-2">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className="flex-shrink-0 text-center cursor-pointer"
            >
              {profileImages[user.id] ? (
                <img
                  src={profileImages[user.id]}
                  alt={`${user.name}'s profile`}
                  className="w-16 h-16 rounded-full border-2 border-gray-300 shadow-sm"
                />
              ) : (
                <CgProfile size={64} className="text-gray-400 mx-auto" />
              )}
              <span className="block text-sm text-gray-600 mt-2">{user.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const userPosts = getUserPosts();

  return (
    <div className="profile max-w-3xl mx-auto p-6 bg-gray-50">
      <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
        Posts by {selectedUser.name}
      </h2>
      {userPosts.map((post) => (
        <div
          key={post.postId}
          className="post bg-white p-6 rounded-lg shadow-xl transition-all duration-300 mb-6"
        >
          <div className="flex items-center space-x-4">
            <img
              src={profileImages[selectedUser.id] || ''}
              alt={`${selectedUser.name}'s profile`}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p className="text-lg text-gray-700 font-medium">{post.name}</p>
              <p className="text-sm text-gray-500">{formatDate(post.date)}</p>
            </div>
          </div>
          <p className="text-gray-800 mt-4">{post.caption}</p>
          {post.postPicRef && postImages[post.postId] && (
            <img
              src={postImages[post.postId]}
              alt="Post"
              className="mt-6 rounded-lg shadow-md w-full"
            />
          )}
        </div>
      ))}
    </div>
  );
}
