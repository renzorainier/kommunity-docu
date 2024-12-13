'use client';

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase/config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import logo from "../img.png";
import google from "./search.png";

const SignIn = () => {
  const [showGoogleError, setShowGoogleError] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (e) {
      console.error(e);
      setShowGoogleError(true);
      setTimeout(() => setShowGoogleError(false), 3000); // Clear error message after 3 seconds
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-[#F8FBFF] px-6 py-10">
      {/* Logo Section */}
      <div className="flex flex-col items-center mb-10">
        <Image
          src={logo} // Logo image
          width={220}
          height={200}
          alt="KommUnity Logo"
        />
        <h1 className="text-4xl md:text-6xl font-bold text-gray-700 mt-4">KommUnity</h1>
      </div>

      {/* Login Header */}
      <div className="w-full flex flex-col items-center md:items-start px-6 md:px-8 mb-6">
        <h2 className="text-2xl font-extrabold text-gray-700 mb-2">Log In</h2>
        <p className="text-gray-600 text-sm text-center md:text-left">
          By continuing, you are agreeing to our{" "}
          <a href="/terms" className="text-blue-500 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-blue-500 hover:underline">
            Privacy Policy
          </a>.
        </p>
      </div>

      {/* Google Sign-In Button */}
      <div className="w-full flex justify-center mt-6">
        {showGoogleError && (
          <p className="text-red-500 text-center mb-4 text-sm">
            Error with Google Sign-In. Please try again.
          </p>
        )}
        <button
          onClick={handleGoogleSignIn}
          className="w-[350px] md:w-[400px] flex items-center justify-center py-3 bg-white text-gray-800 border border-gray-300 rounded-full shadow-md hover:bg-[#F8FBFF] font-roboto-mono"
          disabled={googleLoading}
        >
          <Image
            src={google}
            alt="Google Icon"
            width={20}
            height={20}
            className="mr-2"
          />
          {googleLoading ? "Signing In with Google..." : "Continue with Google"}
        </button>
      </div>

      {/* Footer Section */}
      <div className="text-center mt-6">
        <p className="text-gray-600 text-sm font-roboto-mono">
          Need an account?{" "}
          <a href="/sign-up" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );

};

export default SignIn;


