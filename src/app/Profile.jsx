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
    <div>
      <h2>Your Photos</h2>
      <div className="photos-grid">
        {error || !imageUrl ? (
          <CgProfile size={100} />
        ) : (
          <img src={imageUrl} alt="User Uploaded" className="photo" />
        )}
      </div>
      <div className="user-info">
        <h2>User Information</h2>
        <p><strong>Adviser:</strong> {userData.adviser}</p>
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Level:</strong> {userData.level}</p>
        <p><strong>Schedule:</strong> {userData.schedule}</p>
        <p><strong>Gender:</strong> {userData.isMale ? 'Male' : 'Female'}</p>
      </div>
    </div>
  );
};

export default Profile;
