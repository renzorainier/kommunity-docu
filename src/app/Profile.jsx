import React, { useState, useEffect } from "react";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "./firebase"; // Adjust the path as needed
import { CgProfile } from "react-icons/cg";

const Profile = ({ userId, userData }) => {
  const [imageUrl, setImageUrl] = useState("");
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
    <div className="flex items-center justify-center min-h-screen  p-4">
      <div className="max-w-4xl w-full p-5 bg-white shadow-lg rounded-lg">
        <div className="flex justify-center items-center mt-8 mb-8 relative">
          {error || !imageUrl ? (
            <CgProfile size={120} className="text-gray-400" />
          ) : (
            <div className="w-48 h-48 rounded-full bg-gradient-to-r from-[#035172] to-[#0587be] p-2">
              <img
                src={imageUrl}
                alt="User Uploaded"
                className="w-full h-full rounded-full object-cover shadow-md"
              />
            </div>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg text-gray-800">
          <h2 className="text-2xl font-semibold mb-4 text-center ">
            Student Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-base">
            <p className="flex items-center">
              <strong className="w-32 text-[#035172]">Name:</strong> {userData.name}
            </p>
            <p className="flex items-center">
              <strong className="w-32 text-[#035172]">Grade Level:</strong> {userData.level.charAt(0).toUpperCase() + userData.level.slice(1)}
            </p>
            <p className="flex items-center">
              <strong className="w-32 text-[#035172]">Schedule:</strong> {userData.schedule}
            </p>
            <p className="flex items-center">
              <strong className="w-32 text-[#035172]">Adviser:</strong> {userData.adviser}
            </p>
            <p className="flex items-center">
              <strong className="w-32 text-[#035172]">Gender:</strong> {userData.isMale ? "Male" : "Female"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
