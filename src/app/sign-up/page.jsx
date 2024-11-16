'use client';

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/firebase/config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import teen from "../img.png";

const Register = () => {
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    yearLevel: ''
  });
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "students", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        setFormData(prev => ({ ...prev, email: user.email, name: user.displayName }));
      } else {
        alert("You are already registered! Welcome back, " + user.displayName);
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, formData);
      alert("Registration complete! Welcome, " + formData.name);
      router.push("/");
    } catch (error) {
      console.error("Error submitting form: ", error);
      setShowError(true);
    }
  };

  const isFormComplete = formData.age && formData.yearLevel;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 p-4">
      <div className="bg-white rounded-lg shadow-lg flex flex-col w-full max-w-lg">
        <div className="w-full p-8 flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-t-lg">
          <Image src={teen} width="260" height="260" alt="Teen Image" />
        </div>
        <div className="w-full p-8 flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Create Your Account</h1>
          <p className="text-gray-600 mb-8">Please register to get started.</p>

          {showError && (
            <p className="text-red-500 mb-4 text-center">
              Error: Please try again later.
            </p>
          )}

          <button
            onClick={handleGoogleSignIn}
            className="w-full p-3 bg-white text-custom font-bold rounded-lg shadow-md hover:shadow-lg transition duration-300 hover:bg-gray-100"
            disabled={loading}>
            {loading ? "Signing up with Google..." : "Sign up with Google"}
          </button>

          {formData.email && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-6 w-full">
              <input type="text" id="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} disabled className="w-full border rounded-lg p-3" />
              <input type="email" id="email" placeholder="Email" value={formData.email} disabled className="w-full border rounded-lg p-3 bg-gray-100" />
              <input type="number" id="age" placeholder="Age" value={formData.age} onChange={handleInputChange} required className="w-full border rounded-lg p-3" min="18" />
              <select id="yearLevel" value={formData.yearLevel} onChange={handleInputChange} required className="w-full border rounded-lg p-3">
                <option value="">Select Year Level</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
              <button type="submit" className="w-full bg-custom text-black font-bold py-2 rounded-lg transition duration-300" disabled={!isFormComplete}>
                Complete Registration
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
