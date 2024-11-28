"use client";

import React from "react";
import { FaFacebook, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";

const Header = ({ userData }) => {
  if (!userData) return null;

  const { name, imageUrl, contactNumber, email, facebookLink, jobSkillset } = userData;

  return (
    <div className="header bg-gradient-to-r from-orange-400 via-red-500 to-blue-500 p-6 rounded-b-lg shadow-lg text-white relative">
      {/* Back Arrow */}
      <div className="absolute top-4 left-4">
        <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-200 transition duration-300">
          <MdArrowBack className="text-gray-700 text-2xl" />
        </button>
      </div>

      {/* Profile and Skills Section */}
      <div className="bg-white p-6 rounded-lg shadow-xl relative z-10">
        {/* Profile Section */}
        <div className="flex items-center space-x-6">
          {/* Profile Picture */}
          <div className="relative">
            <img
              src={imageUrl}
              alt={`${name}'s profile`}
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-300 shadow-lg"
            />
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
            {/* Icons for Contact Info */}
            <div className="flex space-x-6 mt-3 text-gray-700">
              {facebookLink && (
                <a
                  href={facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-blue-600 transition duration-300">
                  <FaFacebook className="text-xl" />
                  <span className="hidden md:inline">Facebook</span>
                </a>
              )}
              {contactNumber && (
                <div className="flex items-center space-x-2">
                  <FaPhoneAlt className="text-xl text-green-500" />
                  <span>{contactNumber}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center space-x-2">
                  <FaEnvelope className="text-xl text-purple-500" />
                  <span>{email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Options Menu */}
          <button className="p-2 text-gray-600 hover:text-gray-800 transition duration-300">
            <span className="text-2xl">•••</span>
          </button>
        </div>

        {/* Skills Section */}
        {jobSkillset?.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 text-lg">Job Skill Sets:</h3>
            <ul className="flex flex-wrap gap-3 mt-3">
              {jobSkillset.map((skill, index) => (
                <li
                  key={index}
                  className="bg-gray-100 text-gray-800 py-2 px-4 rounded-full shadow-sm text-sm">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
