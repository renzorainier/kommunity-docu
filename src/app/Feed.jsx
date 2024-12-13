import React, { useState, useEffect, useCallback } from "react";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "./firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import { CgProfile } from "react-icons/cg";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";

import {
  FaEdit,
  FaTrashAlt,
  FaCheckCircle,
  FaRegCheckCircle,
  FaDollarSign,
  FaHandshake,
} from "react-icons/fa";

export default function Feed({ postData, userData }) {
  const [profileImages, setProfileImages] = useState({});
  const [postImages, setPostImages] = useState({});
  const [error, setError] = useState({});
  const [visiblePosts, setVisiblePosts] = useState(5);

  const getAllPosts = useCallback(() => {
    if (!postData) return [];
    return Object.entries(postData)
      .flatMap(([date, posts]) =>
        Object.entries(posts).map(([postId, postDetails]) => ({
          postId,
          dateString: date,
          ...postDetails,
        }))
      )
      .filter((post) => post.date && post.date.seconds)
      .sort((a, b) => b.date.seconds - a.date.seconds);
  }, [postData]);

  const getRecentPosts = useCallback(() => {
    const allPosts = getAllPosts();
    return allPosts.slice(0, visiblePosts);
  }, [getAllPosts, visiblePosts]);

  const fetchImages = async (posts) => {
    const profileImagePromises = [];
    const postImagePromises = [];

    posts.forEach((post) => {
      const { postId, userProfileRef, postPicRef } = post;

      if (userProfileRef) {
        const profileImageRef = ref(storage, `images/${userProfileRef}/`);
        const profilePromise = listAll(profileImageRef)
          .then((response) => {
            if (response.items.length === 0) {
              setError((prev) => ({ ...prev, [postId]: true }));
              return { postId, url: null };
            }
            return getDownloadURL(response.items[0]).then((url) => ({
              postId,
              url,
            }));
          })
          .catch(() => {
            setError((prev) => ({ ...prev, [postId]: true }));
            return { postId, url: null };
          });
        profileImagePromises.push(profilePromise);
      }

      if (postPicRef) {
        const postImageRef = ref(storage, `posts/${postPicRef}/`);
        const postPromise = listAll(postImageRef)
          .then((response) => {
            if (response.items.length === 0) {
              setError((prev) => ({ ...prev, [postId]: true }));
              return { postId, url: null };
            }
            return getDownloadURL(response.items[0]).then((url) => ({
              postId,
              url,
            }));
          })
          .catch(() => {
            setError((prev) => ({ ...prev, [postId]: true }));
            return { postId, url: null };
          });
        postImagePromises.push(postPromise);
      }
    });

    const [resolvedProfileImages, resolvedPostImages] = await Promise.all([
      Promise.all(profileImagePromises),
      Promise.all(postImagePromises),
    ]);

    const profileImageMap = resolvedProfileImages.reduce(
      (acc, { postId, url }) => {
        if (url) acc[postId] = url;
        return acc;
      },
      {}
    );
    const postImageMap = resolvedPostImages.reduce((acc, { postId, url }) => {
      if (url) acc[postId] = url;
      return acc;
    }, {});

    setProfileImages((prev) => ({ ...prev, ...profileImageMap }));
    setPostImages((prev) => ({ ...prev, ...postImageMap }));
  };

  const deletePost = async (date, postId) => {
    try {
      const postRef = doc(db, "posts/posts");
      const fieldPath = `${date}.${postId}`;

      await updateDoc(postRef, {
        [fieldPath]: null,
      });

      setLocalPostData((prev) => {
        const updatedData = { ...prev };
        delete updatedData[date][postId];
        if (Object.keys(updatedData[date]).length === 0)
          delete updatedData[date];
        return updatedData;
      });
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const toggleAvailability = async (date, postId, currentStatus) => {
    try {
      const postRef = doc(db, "posts/posts");
      const fieldPath = `${date}.${postId}.isAvailable`;

      await updateDoc(postRef, {
        [fieldPath]: !currentStatus,
      });

      postData[date][postId].isAvailable = !currentStatus;
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const toggleVolunteerPaidStatus = async (date, postId, currentStatus) => {
    try {
      const postRef = doc(db, "posts/posts");
      const fieldPath = `${date}.${postId}.isVolunteer`;

      await updateDoc(postRef, {
        [fieldPath]: !currentStatus,
      });

      postData[date][postId].isVolunteer = !currentStatus;
    } catch (error) {
      console.error("Error updating volunteer/paid status:", error);
    }
  };

  useEffect(() => {
    const recentPosts = getRecentPosts();
    fetchImages(recentPosts);
  }, [postData, visiblePosts, getRecentPosts]);

  const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return "Unknown Date";

    const dateObj = new Date(timestamp.seconds * 1000);
    let hour = dateObj.getHours() % 12 || 12;
    const minute = dateObj.getMinutes().toString().padStart(2, "0");
    const ampm = dateObj.getHours() >= 12 ? "PM" : "AM";

    return `${
      dateObj.getMonth() + 1
    }/${dateObj.getDate()}/${dateObj.getFullYear()}, ${hour}:${minute} ${ampm}`;
  };

  const allPosts = getAllPosts();
  const recentPosts = getRecentPosts();

  return (
    <div className="feed max-w-3xl mx-auto p-4 bg-[#F8FBFF] min-h-screen">
      {recentPosts.map((post) => (
        <div
          key={post.postId}
          className="post bg-[#E0EAF6] p-6 rounded-lg shadow-lg mb-6 overflow-hidden relative">
          {post.userID === userData.userID && (
            <div className="absolute top-4 right-4">
              <Menu as="div" className="relative">
                {({ open }) => (
                  <>
                    {/* Dropdown Trigger Button */}
                    <Menu.Button
                      className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full shadow-md transition-all duration-150 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      aria-label="Edit Post">
                      <FaEdit className="w-5 h-5 text-gray-700" />
                    </Menu.Button>

                    {/* Dropdown Menu Items */}
                    <Transition
                      show={open}
                      enter="transition-transform duration-200 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition-transform duration-150 ease-in"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0">
                      <Menu.Items
                        static
                        className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 divide-y divide-gray-100 rounded-lg shadow-lg focus:outline-none">
                        {/* Toggle Availability Option */}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() =>
                                toggleAvailability(
                                  post.dateString,
                                  post.postId,
                                  post.isAvailable
                                )
                              }
                              className={`${
                                active
                                  ? "bg-blue-100 text-blue-700"
                                  : "text-gray-700 hover:bg-gray-100"
                              } flex items-center w-full px-4 py-2 text-sm transition-all duration-150`}>
                              {post.isAvailable ? (
                                <FaRegCheckCircle className="w-5 h-5 mr-3" />
                              ) : (
                                <FaCheckCircle className="w-5 h-5 mr-3" />
                              )}
                              {post.isAvailable
                                ? "Mark as Completed"
                                : "Mark as Available"}
                            </button>
                          )}
                        </Menu.Item>

                        {/* Toggle Volunteer/Paid Status Option */}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() =>
                                toggleVolunteerPaidStatus(
                                  post.dateString,
                                  post.postId,
                                  post.isVolunteer
                                )
                              }
                              className={`${
                                active
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "text-gray-700 hover:bg-gray-100"
                              } flex items-center w-full px-4 py-2 text-sm transition-all duration-150`}>
                              {post.isVolunteer ? (
                                <>
                                  <FaDollarSign className="w-5 h-5 mr-3" />
                                  Switch to Paid
                                </>
                              ) : (
                                <>
                                  <FaHandshake className="w-5 h-5 mr-3" />
                                  Switch to Volunteer
                                </>
                              )}
                            </button>
                          )}
                        </Menu.Item>

                        {/* Delete Post Option */}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() =>
                                deletePost(post.dateString, post.postId)
                              }
                              className={`${
                                active
                                  ? "bg-red-100 text-red-700"
                                  : "text-red-500 hover:bg-gray-100"
                              } flex items-center w-full px-4 py-2 text-sm transition-all duration-150`}>
                              <FaTrashAlt className="w-5 h-5 mr-3" />
                              Delete Post
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>
            </div>
          )}

          {/* Post Content */}
          <div className="flex items-center space-x-4 mb-4">
            {profileImages[post.postId] ? (
              <Image
                src={profileImages[post.postId]}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-md"
                width={64} // Specify the width of the image
                height={64} // Specify the height of the image
              />
            ) : (
              <CgProfile size={48} className="text-gray-400" />
            )}
            <div>
              <p className="text-lg text-[#496992] font-bold font-inter">
                {post.name}
              </p>
              <p className="text-sm text-gray-500">{formatDate(post.date)}</p>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {post.category && (
              <span className="bg-[#5856D6] text-white font-bold py-1 px-3 rounded-full">
                {post.category}
              </span>
            )}
            <span
              className={`py-1 px-3 rounded-full ${
                post.isAvailable
                  ? "bg-[#b3bbc5] text-white font-bold shadow-md"
                  : "bg-[#34c759] text-white font-bold shadow-md"
              }`}>
              {post.isAvailable ? "Available" : "Completed"}
            </span>
            <span
              className={`py-1 px-3 rounded-full ${
                post.isVolunteer
                  ? "bg-[#FBBC2E] text-black font-bold"
                  : "bg-[#FF3B30] text-white font-bold"
              }`}>
              {post.isVolunteer ? "Volunteer" : "Paid"}
            </span>
          </div>

          <p className="mt-4 text-[#496992] font-bold font-inter">
            {post.caption}
          </p>

          {post.postPicRef && postImages[post.postId] ? (
            <div className="mt-6">
              <Image
                src={postImages[post.postId]}
                alt="Post"
                className="w-full rounded-lg shadow-md object-cover"
                width={800} // Specify the width of the image
                height={600} // Specify the height of the image
              />
            </div>
          ) : (
            post.postPicRef && (
              <p className="text-gray-500 mt-4">Loading post image...</p>
            )
          )}
        </div>
      ))}



      {recentPosts.length < allPosts.length && (
        <div className="text-center mt-8">
          <button
            onClick={() => setVisiblePosts((prev) => prev + 5)}
            className="px-6 py-3 bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all">
            Load More Posts
          </button>
        </div>
      )}
    </div>
  );
}
