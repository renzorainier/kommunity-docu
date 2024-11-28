"use client";

import React from "react";
import { FaFacebook, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";

const Header = ({ userData }) => {
  if (!userData) return null;

  const { name, imageUrl, contactNumber, email, facebookLink, jobSkillset } = userData;

  return (
    <div className="header bg-gradient-to-r from-orange-400 via-red-500 to-blue-500 p-6 rounded-b-lg shadow-lg text-white">
      {/* Back Arrow */}
      <div className="flex items-center mb-6">
        <button className="p-2 bg-white rounded-full shadow-md">
          <MdArrowBack className="text-gray-700 text-xl" />
        </button>
      </div>

      {/* Profile Section */}
      <div className="flex items-center space-x-6 bg-white p-6 rounded-lg shadow-lg">
        {/* Profile Picture */}
        <div className="relative">
          <img
            src={imageUrl}
            alt={`${name}'s profile`}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
          />
          <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full">
            <FaFacebook />
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-800">{name}</h1>
          {/* Icons for Contact Info */}
          <div className="flex space-x-4 mt-2 text-gray-700">
            {facebookLink && (
              <a
                href={facebookLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2">
                <FaFacebook className="text-blue-600" />
                <span>Facebook</span>
              </a>
            )}
            {contactNumber && (
              <div className="flex items-center space-x-2">
                <FaPhoneAlt className="text-red-500" />
                <span>{contactNumber}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center space-x-2">
                <FaEnvelope className="text-purple-500" />
                <span>{email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Options Menu */}
        <button className="p-2 text-gray-600">
          <span className="text-2xl">•••</span>
        </button>
      </div>

      {/* Skills Section */}
      {jobSkillset?.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-lg">
          <h3 className="font-semibold text-gray-700">Job Skill Sets:</h3>
          <ul className="flex flex-wrap gap-2 mt-2">
            {jobSkillset.map((skill, index) => (
              <li
                key={index}
                className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full text-sm">
                {skill}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
