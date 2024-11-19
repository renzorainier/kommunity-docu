'use client';

import { useState } from 'react';
import { doc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';

function CreatePost({ posts }) {
  const [caption, setCaption] = useState('');
  const [postPicRef, setPostPicRef] = useState('');
  const [userName, setUserName] = useState('');
  const [userID, setUserID] = useState('');
  const [userProfile, setUserProfile] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Generate a random 10-character ID
  const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 10).toUpperCase();
  };

  // Format date function
  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return 'Pending...'; // Handle serverTimestamp placeholders
    const dateObj = new Date(timestamp.seconds * 1000);
    return dateObj.toLocaleString(); // Convert to a readable date string
  };

  const handleCreatePost = async () => {
    if (!caption || !postPicRef || !userName || !userID || !userProfile) {
      setError('All fields are required!');
      return;
    }

    setError('');
    const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const postId = generateRandomId();

    const newPost = {
      caption,
      date: serverTimestamp(),
      name: userName,
      postPicRef,
      userID,
      userProfile,
    };

    try {
      const postsDocRef = doc(db, 'posts', 'posts');
      await updateDoc(postsDocRef, {
        [`${currentDate}.${postId}`]: newPost,
      });

      setSuccessMessage('Post created successfully!');
      setCaption('');
      setPostPicRef('');
      setUserName('');
      setUserID('');
      setUserProfile('');
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    }
  };

  return (
    <div className="create-post">
      <h2>Create a New Post</h2>

      {error && <p className="error text-red-500">{error}</p>}
      {successMessage && <p className="success text-green-500">{successMessage}</p>}

      <div>
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="border p-2 rounded mb-2"
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Post Picture Reference"
          value={postPicRef}
          onChange={(e) => setPostPicRef(e.target.value)}
          className="border p-2 rounded mb-2"
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="User Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="border p-2 rounded mb-2"
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="User ID"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
          className="border p-2 rounded mb-2"
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="User Profile Reference"
          value={userProfile}
          onChange={(e) => setUserProfile(e.target.value)}
          className="border p-2 rounded mb-2"
        />
      </div>

      <button
        onClick={handleCreatePost}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600"
      >
        Create Post
      </button>
    </div>
  );
}

export default function Feed({ postData }) {
  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return 'Pending...'; // Handle incomplete timestamps
    const dateObj = new Date(timestamp.seconds * 1000);
    return dateObj.toLocaleString();
  };

  return (
    <div className="feed">
      <CreatePost />
      <h2>Feed</h2>
      {postData ? (
        Object.entries(postData).map(([date, postGroup]) =>
          Object.entries(postGroup).map(([postId, post]) => (
            <div key={postId} className="post border p-4 mb-4 rounded">
              <h3>{post.caption}</h3>
              <p>By: {post.name}</p>
              <p>Date: {formatDate(post.date)}</p>
              <img
                src={post.postPicRef}
                alt={post.caption}
                className="w-full h-64 object-cover mt-2"
              />
            </div>
          ))
        )
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
}
