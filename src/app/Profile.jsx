import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from './firebase'; // Adjust the path as needed
import { CgProfile } from "react-icons/cg";

const Profile = ({ userId, userData }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (userId) {
      const imagesListRef = ref(storage, `images/${userId}/`);
      listAll(imagesListRef)
        .then((response) => {
          if (response.items.length === 0) {
            setError(true);
            return;
          }
          // Get the first image URL
          const firstItem = response.items[0];
          getDownloadURL(firstItem)
            .then((url) => setImageUrl(url))
            .catch(() => setError(true));
        })
        .catch(() => setError(true));
    }
  }, [userId]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Photos</h2>
      <div className="flex justify-center items-center mb-8">
        {error || !imageUrl ? (
          <CgProfile size={100} className="text-gray-400" />
        ) : (
          <img src={imageUrl} alt="User Uploaded" className="w-40 h-40 rounded-full object-cover" />
        )}
      </div>
      <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">User Information</h2>
        <p className="text-gray-700"><strong>Adviser:</strong> {userData.adviser}</p>
        <p className="text-gray-700"><strong>Name:</strong> {userData.name}</p>
        <p className="text-gray-700"><strong>Level:</strong> {userData.level}</p>
        <p className="text-gray-700"><strong>Schedule:</strong> {userData.schedule}</p>
        <p className="text-gray-700"><strong>Gender:</strong> {userData.isMale ? 'Male' : 'Female'}</p>
      </div>
    </div>
  );
};

export default Profile;
