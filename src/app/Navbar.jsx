"use client";
import Image from "next/image";
import { FaUser, FaPlus, FaArrowLeft, FaSearch } from "react-icons/fa"; // Import icons

import logo from "./img.png";

export default function Navbar({ activeComponent, setActiveComponent }) {
  if (activeComponent === "feed") {
    // Render navbar when activeComponent is 'feed'
    return (
      <>
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 bg-[#E0EAF6] shadow-sm z-[1000] flex justify-between items-center px-4 py-0 border-b border-grey-600">
          {/* App Logo and Title */}
          <div className="flex items-center ml-[-20px]">
            <Image
              src={logo} // Logo image
              width={90}
              height={70}
              alt="KommUnity Logo"
            />
            <span className="text-xl font-bold text-[#323030] font-inter ml-[-10px]">
              KommUnity
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setActiveComponent("search")}
              aria-label="Search"
              className="text-gray-600 hover:text-blue-500"
            >
              <FaSearch size={20} />
            </button>
            <button
              onClick={() => setActiveComponent("profile")}
              aria-label="Profile"
              className="text-gray-600 hover:text-blue-500"
            >
              <FaUser size={20} />
            </button>
          </div>
        </nav>

        {/* Horizontal line */}
        <hr className="fixed top-[70px] left-0 right-0 border-t border-gray-300 z-[900]" />

        {/* Floating Create Post Button */}
        <button
          onClick={() => setActiveComponent("createPost")}
          aria-label="Create Post"
          className="fixed bottom-4 right-4 bg-gradient-to-r from-orange-400 to-red-500 text-white p-4 rounded-full shadow-lg z-[1100] hover:shadow-xl transition-all"
        >
          <FaPlus size={24} />
        </button>
      </>
    );
  }

  // Render a floating back button for other components
  return (
    <>
      <button
        onClick={() => setActiveComponent("feed")}
        className="fixed top-4 left-4 bg-gradient-to-r from-orange-400 to-red-500 text-white p-3 rounded-full shadow-lg z-[1100] hover:shadow-xl transition-all"
        aria-label="Back"
      >
        <FaArrowLeft size={24} />
      </button>
    </>
  );
}
