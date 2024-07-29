import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from './firebase'; // Adjust the path as needed

const UserPhotos = ({ userId }) => {
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    if (userId) {
      const imagesListRef = ref(storage, `images/${userId}/`);
      listAll(imagesListRef).then((response) => {
        const fetchImageUrls = response.items.map((item) =>
          getDownloadURL(item).then((url) => url)
        );
        Promise.all(fetchImageUrls).then((urls) => setImageUrls(urls));
      });
    }
  }, [userId]);

  return (
    <div>
      <h2>Your Photos</h2>
      <div className="photos-grid">
        {imageUrls.map((url) => (
          <img src={url} alt="User Uploaded" key={url} className="photo" />
        ))}
      </div>
    </div>
  );
};

export default UserPhotos;
