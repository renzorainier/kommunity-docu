"use client";

import React from "react";
import { FiPhone, FiMail, FiFacebook } from "react-icons/fi";

const Header = ({ userData }) => {
  if (!userData) return null;

  const { name, imageUrl, contactNumber, email, facebookLink, jobSkillset } = userData;

  return (
    <div className="header bg-white p-6 rounded-lg shadow-lg mb-6">
      <div className="flex items-center space-x-6">
        {/* Profile Picture */}
        <img
          src={imageUrl}
          alt={`${name}'s profile`}
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 shadow-md"
        />
        {/* User Info */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{name}</h1>

          <div className="mt-2 space-y-2">
            {/* Contact Number */}
            <div className="flex items-center space-x-3 text-gray-600">
              <FiPhone className="text-blue-600" size={20} />
              <span>{contactNumber || "N/A"}</span>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-3 text-gray-600">
              <FiMail className="text-red-600" size={20} />
              <span>{email || "N/A"}</span>
            </div>

            {/* Facebook Link */}
            {facebookLink && (
              <div className="flex items-center space-x-3">
                <FiFacebook className="text-blue-600" size={20} />
                <a
                  href={facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline">
                  Facebook Profile
                </a>
              </div>
            )}
          </div>

          {/* Skillset */}
          {jobSkillset?.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-700">Skillset:</h3>
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
      </div>
    </div>
  );
};

export default Header;
