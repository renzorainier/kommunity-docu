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
    <div className="flex items-center justify-center min-h-screen ">
      <div className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center"></h2>
        <div className="flex justify-center items-center mb-12">
          {error || !imageUrl ? (
            <CgProfile size={120} className="text-gray-400" />
          ) : (
            <img src={imageUrl} alt="User Uploaded" className="w-48 h-48 rounded-full object-cover shadow-md" />
          )}
        </div>
        <div className="bg-gray-50 p-8 rounded-lg shadow-inner">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Student Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <p className="text-gray-700"><strong>Name:</strong> {userData.name}</p>
            <p className="text-gray-700"><strong>Grade Level:</strong> {userData.level}</p>
            <p className="text-gray-700"><strong>Schedule:</strong> {userData.schedule}</p>
            <p className="text-gray-700"><strong>Adviser:</strong> {userData.adviser}</p>
            <p className="text-gray-700"><strong>Gender:</strong> {userData.isMale ? 'Male' : 'Female'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

