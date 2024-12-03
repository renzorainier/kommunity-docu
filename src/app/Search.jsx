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
  const [postImages, setPostImages] = useState({});
  const [visiblePosts, setVisiblePosts] = useState(5);
  const [error, setError] = useState({});

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
        setFilteredUsers(filteredUsers);

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

  // Get posts for the selected user
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

  // Fetch post images from Firebase storage
  const fetchPostImages = async (posts) => {
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
    fetchPostImages(userPosts);
  }, [selectedUser, visiblePosts]);

  if (!selectedUser) {
    return (
      <div className="p-6 bg-[#F8FAFB] min-h-screen">
        {/* Search Input */}
        <div className="relative mb-4">
          <div className="flex items-center justify-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-[85%] max-w-md p-3 bg-[#E0EAF6] text-gray-500 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-[#B7CCE5] shadow-sm"
              style={{ marginLeft: '50px' }}
            />
          </div>
        </div>
        <hr className="my-4 border-gray-300" />

        {/* Recent Users */}
        <h2 className="text-lg font-bold text-gray-800 mb-4">Recent</h2>
        <ul className="flex space-x-4 overflow-x-auto">
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className="flex flex-col items-center cursor-pointer"
              style={{ width: '80px', minWidth: '80px' }}
            >
              <div className="relative">
                {profileImages[user.id] ? (
                  <img
                    src={profileImages[user.id]}
                    alt={`${user.name}'s profile`}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 shadow-sm"
                  />
                ) : (
                  <CgProfile size={64} className="text-gray-400 mx-auto" />
                )}
              </div>
              <span
                className="block text-center mt-2 text-sm text-gray-700"
                style={{ maxWidth: '70px', whiteSpace: 'normal', wordWrap: 'break-word', lineHeight: '1.2' }}
              >
                {user.name}
              </span>
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
            <p className="text-[#496992] font-bold">{post.caption}</p>
            {post.postPicRef && postImages[post.postId] && (
              <img
                src={postImages[post.postId]}
                alt="Post"
                className="mt-4 w-full rounded-lg shadow-md"
              />
            )}
          </div>
        ))}
      </div>

      {/* Load more posts */}
      {userPosts.length > visiblePosts && (
        <button
          onClick={() => setVisiblePosts(visiblePosts + 5)}
          className="px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition"
        >
          Show More
        </button>
      )}
    </div>
  );
}





