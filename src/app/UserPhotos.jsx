import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from './firebase'; // Adjust the path as needed
import { CgProfile } from "react-icons/cg";

const UserPhotos = ({ userId, userData }) => {
  const [imageUrls, setImageUrls] = useState([]);
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
          const fetchImageUrls = response.items.map((item) =>
            getDownloadURL(item).then((url) => url).catch(() => setError(true))
          );
          Promise.all(fetchImageUrls)
            .then((urls) => setImageUrls(urls))
            .catch(() => setError(true));
        })
        .catch(() => setError(true));
    }
  }, [userId]);

  return (
    <div>
      <h2>Your Photos</h2>
      <div className="photos-grid">
        {error || imageUrls.length === 0 ? (
          <CgProfile size={100} />
        ) : (
          imageUrls.map((url) => (
            <img src={url} alt="User Uploaded" key={url} className="photo" />
          ))
        )}
      </div>
    </div>
  );
};

export default UserPhotos;
