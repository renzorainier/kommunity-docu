import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from './firebase'; // Adjust the path as needed
import { CgProfile } from "react-icons/cg";

const Profile = ({ userId, userData }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      const storedImageUrl = localStorage.getItem(`user-${userId}-image`);
      if (storedImageUrl) {
        setImageUrl(storedImageUrl);
      } else {
        if (userId) {
          const imagesListRef = ref(storage, `images/${userId}/`);
          try {
            const response = await listAll(imagesListRef);
            if (response.items.length === 0) {
              setError(true);
              return;
            }
            const firstItem = response.items[0];
            const url = await getDownloadURL(firstItem);
            setImageUrl(url);
            localStorage.setItem(`user-${userId}-image`, url);
          } catch (err) {
            setError(true);
          }
        }
      }
    };

    fetchImage();
  }, [userId]);


  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="max-w-4xl w-full p-6 bg-white shadow-2xl rounded-lg">
        <div className="flex justify-center items-center mb-8">
          {error || !imageUrl ? (
            <CgProfile size={120} className="text-gray-400" />
          ) : (
            <img src={imageUrl} alt="User Uploaded" className="w-48 h-48 rounded-full object-cover shadow-lg" />
          )}
        </div>
        <div className="bg-gray-50 p-8 rounded-lg shadow-inner">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Student Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
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

