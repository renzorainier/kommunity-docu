'use client';

import { useState } from 'react';
import { doc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';

function CreatePost({ userData }) {
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Generate a random 10-character ID for postId and postPicRef
  const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 10).toUpperCase();
  };

  const handleCreatePost = async () => {
    // Log userData to see its structure
    console.log('User Data:', userData);

    // Ensure userData is available and contains necessary fields
    if (!userData || !userData.userID || !userData.name) {
      setError('User data is missing or incomplete.');
      return;
    }

    if (!caption) {
      setError('Caption is required!');
      return;
    }

    setError('');
    const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const postId = generateRandomId(); // Use this as both postId and postPicRef
    const postPicRef = postId; // Set postPicRef equal to postId

    const newPost = {
      caption,
      date: serverTimestamp(),
      name: userData.name, // Ensure name is from userData
      postPicRef, // Use postId as the postPicRef
      userID: userData.userID, // Autofill userID from userData (using userID instead of uid)
      userProfileRef: userData.userID, // Profile ref same as userID
    };

    try {
      const postsDocRef = doc(db, 'posts', 'posts');
      await updateDoc(postsDocRef, {
        [`${currentDate}.${postId}`]: newPost,
      });

      setSuccessMessage('Post created successfully!');
      setCaption('');
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

      <button
        onClick={handleCreatePost}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600"
      >
        Create Post
      </button>
    </div>
  );
}

export default CreatePost;
