"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "@/app/firebase/config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import teen from "../img.png";

const skillOptions = [
  "Web Development",
  "Graphic Design",
  "Data Analysis",
  "Content Writing",
  "Marketing",
  "Project Management",
  "Software Testing",
];

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    contactNumber: "",
    facebookLink: "",
    email: "",
    jobSkillset: [],
  });
  const [searchText, setSearchText] = useState("");
  const [filteredSkills, setFilteredSkills] = useState(skillOptions);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        setFormData((prev) => ({
          ...prev,
          email: user.email,
        }));
      } else {
        alert("You are already registered! Welcome back.");
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
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSkillSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);
    setFilteredSkills(
      skillOptions.filter(
        (skill) =>
          skill.toLowerCase().includes(text.toLowerCase()) &&
          !formData.jobSkillset.includes(skill)
      )
    );
  };

  const handleSkillAdd = (skill) => {
    setFormData((prev) => ({
      ...prev,
      jobSkillset: [...prev.jobSkillset, skill],
    }));
    setSearchText("");
    setFilteredSkills([]);
  };

  const handleSkillRemove = (skill) => {
    setFormData((prev) => ({
      ...prev,
      jobSkillset: prev.jobSkillset.filter((s) => s !== skill),
    }));
  };

  const handleImageUpload = (file) => {
    if (!file) {
      setImageError(true);
      return;
    }
    setImageError(false);
    setUploadedImage(file);
  };

  const handleFilePicker = (e) => {
    const file = e.target.files[0];
    handleImageUpload(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User is not authenticated");

      let imageUrl = "";
      if (uploadedImage) {
        const storageRef = ref(storage, `images/${user.uid}/${uploadedImage.name}`);
        await uploadBytes(storageRef, uploadedImage);
        imageUrl = await getDownloadURL(storageRef);
      }

      const fullName = `${formData.firstName} ${formData.surname}`; // Merge names

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        name: fullName, // Store merged name
        contactNumber: formData.contactNumber,
        facebookLink: formData.facebookLink,
        email: formData.email,
        jobSkillset: formData.jobSkillset,
        imageUrl,
        userID: user.uid,
      });

      alert("Registration complete! Welcome, " + fullName);
      router.push("/");
    } catch (error) {
      console.error("Error submitting form: ", error);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const isFormComplete =
    formData.firstName &&
    formData.surname &&
    formData.contactNumber &&
    formData.facebookLink &&
    uploadedImage;

  return (
    <>
      {!formData.email ? (
        // Initial Sign-Up View
        <div className="initial-sign-up min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
            <div className="flex flex-col items-center">
              <Image src={teen} width={120} height={120} alt="KommUnity Logo" />
              <h1 className="text-3xl font-bold text-gray-800 mt-4">KommUnity</h1>
            </div>
            <p className="text-gray-600 text-center mt-4">
              By continuing, you are agreeing to our{" "}
              <a href="/terms" className="text-blue-500 underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-blue-500 underline">
                Privacy Policy
              </a>.
            </p>
            <button
              onClick={handleGoogleSignIn}
              className="mt-6 w-full flex items-center justify-center gap-2 p-3 bg-white border border-gray-300 text-gray-600 font-bold rounded-lg shadow-sm hover:shadow-md transition"
              disabled={loading}
            >
              <Image
                src="/google-icon.svg" // Replace with the correct path to your Google logo icon
                width={20}
                height={20}
                alt="Google Icon"
              />
              {loading ? "Signing up with Google..." : "Continue with Google"}
            </button>
            <p className="text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 underline">
                Log In
              </a>
            </p>
          </div>
        </div>
      ) : (
        // Form for Completing Registration
        <div className="min-h-screen flex items-center justify-center bg-gray-300 p-4">
          <div className="bg-white rounded-lg shadow-lg flex flex-col w-full max-w-lg">
            <div className="w-full p-8 flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-t-lg">
              <Image src={teen} width={260} height={260} alt="Teen Image" />
            </div>
            <div className="w-full p-8 flex flex-col justify-center items-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Create Your Account
              </h1>
              {showError && (
                <p className="text-red-500 mb-4 text-center">
                  Error: Please try again later.
                </p>
              )}
              <form onSubmit={handleSubmit} className="mt-6 space-y-6 w-full">
                <input
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-lg p-3"
                />
                <input
                  type="text"
                  id="surname"
                  placeholder="Surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-lg p-3"
                />
                <input
                  type="text"
                  id="contactNumber"
                  placeholder="Contact Number"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-lg p-3"
                />
                <input
                  type="url"
                  id="facebookLink"
                  placeholder="Facebook Link"
                  value={formData.facebookLink}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-lg p-3"
                />
                <div className="w-full">
                  <label className="block mb-2 font-bold">Search Skills:</label>
                  <input
                    type="text"
                    placeholder="Type a skill..."
                    value={searchText}
                    onChange={handleSkillSearch}
                    className="w-full border rounded-lg p-3"
                  />
                  {filteredSkills.length > 0 && (
                    <ul className="border mt-2 rounded-lg max-h-40 overflow-y-scroll">
                      {filteredSkills.map((skill) => (
                        <li
                          key={skill}
                          onClick={() => handleSkillAdd(skill)}
                          className="p-2 cursor-pointer hover:bg-gray-100"
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {formData.jobSkillset.length > 0 && (
                  <div className="w-full mt-4">
                    <label className="block mb-2 font-bold">Selected Skills:</label>
                    <ul className="flex flex-wrap gap-2">
                      {formData.jobSkillset.map((skill) => (
                        <li
                          key={skill}
                          className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-lg"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleSkillRemove(skill)}
                            className="text-white hover:text-gray-300"
                          >
                            &times;
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <label className="block mt-4 mb-2 font-bold">Profile Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFilePicker}
                  className="w-full"
                />
                {imageError && (
                  <p className="text-red-500 mt-2">Please upload an image.</p>
                )}
                <button
                  type="submit"
                  className={`mt-6 w-full py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition ${
                    !isFormComplete && "opacity-50 cursor-not-allowed"
                  }`}
                  disabled={!isFormComplete || loading}
                >
                  {loading ? "Submitting..." : "Complete Registration"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;



//workin ver 26


// 'use client';

// import Image from "next/image";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { auth, db, storage } from "@/app/firebase/config";
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { doc, setDoc, getDoc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import teen from "../img.png";

// const Register = () => {
//   const [showError, setShowError] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     age: '',
//     yearLevel: '',
//   });
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [imageError, setImageError] = useState(false);
//   const router = useRouter();

//   const handleGoogleSignIn = async () => {
//     setLoading(true);
//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;

//       const userRef = doc(db, "students", user.uid);
//       const userDoc = await getDoc(userRef);

//       if (!userDoc.exists()) {
//         setFormData((prev) => ({
//           ...prev,
//           email: user.email,
//           name: user.displayName,
//         }));
//       } else {
//         alert("You are already registered! Welcome back, " + user.displayName);
//         router.push("/");
//       }
//     } catch (error) {
//       console.error(error);
//       setShowError(true);
//       setTimeout(() => setShowError(false), 3000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleImageUpload = (file) => {
//     if (!file) {
//       setImageError(true);
//       return;
//     }
//     setImageError(false);
//     setUploadedImage(file);
//   };

//   const handleFileDrop = (e) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     handleImageUpload(file);
//   };

//   const handleFilePicker = (e) => {
//     const file = e.target.files[0];
//     handleImageUpload(file);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const user = auth.currentUser;
//       if (!user) throw new Error("User is not authenticated");

//       // Upload image to Firebase Storage
//       let imageUrl = "";
//       if (uploadedImage) {
//         const storageRef = ref(storage, `images/${user.uid}/${uploadedImage.name}`);
//         await uploadBytes(storageRef, uploadedImage);
//         imageUrl = await getDownloadURL(storageRef);
//       }

//       // Save user data in Firestore
//       const userRef = doc(db, "users", user.uid);
//       await setDoc(userRef, {
//         ...formData,
//         userID: user.uid, // Add userID field
//         imageUrl
//       });

//       alert("Registration complete! Welcome, " + formData.name);
//       router.push("/");
//     } catch (error) {
//       console.error("Error submitting form: ", error);
//       setShowError(true);
//     } finally {
//       setLoading(false);
//     }
//   };


//   const isFormComplete = formData.age && formData.yearLevel && uploadedImage;

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-300 p-4">
//       <div className="bg-white rounded-lg shadow-lg flex flex-col w-full max-w-lg">
//         <div className="w-full p-8 flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-t-lg">
//           <Image src={teen} width="260" height="260" alt="Teen Image" />
//         </div>
//         <div className="w-full p-8 flex flex-col justify-center items-center">
//           <h1 className="text-4xl font-bold text-gray-800 mb-4">Create Your Account</h1>
//           <p className="text-gray-600 mb-8">Please register to get started.</p>

//           {showError && (
//             <p className="text-red-500 mb-4 text-center">
//               Error: Please try again later.
//             </p>
//           )}

//           <button
//             onClick={handleGoogleSignIn}
//             className="w-full p-3 bg-white text-custom font-bold rounded-lg shadow-md hover:shadow-lg transition duration-300 hover:bg-gray-100"
//             disabled={loading}
//           >
//             {loading ? "Signing up with Google..." : "Sign up with Google"}
//           </button>

//           {formData.email && (
//             <form onSubmit={handleSubmit} className="mt-6 space-y-6 w-full">
//               <input
//                 type="text"
//                 id="name"
//                 placeholder="Full Name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 disabled
//                 className="w-full border rounded-lg p-3"
//               />
//               <input
//                 type="email"
//                 id="email"
//                 placeholder="Email"
//                 value={formData.email}
//                 disabled
//                 className="w-full border rounded-lg p-3 bg-gray-100"
//               />
//               <input
//                 type="number"
//                 id="age"
//                 placeholder="Age"
//                 value={formData.age}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full border rounded-lg p-3"
//                 min="18"
//               />
//               <select
//                 id="yearLevel"
//                 value={formData.yearLevel}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full border rounded-lg p-3"
//               >
//                 <option value="">Select Year Level</option>
//                 <option value="1st Year">1st Year</option>
//                 <option value="2nd Year">2nd Year</option>
//                 <option value="3rd Year">3rd Year</option>
//                 <option value="4th Year">4th Year</option>
//               </select>

//               {/* Image Upload Section */}
//               <div
//                 onDrop={handleFileDrop}
//                 onDragOver={(e) => e.preventDefault()}
//                 className="w-full p-4 border border-dashed rounded-lg text-center cursor-pointer"
//               >
//                 <label htmlFor="file-upload" className="block w-full cursor-pointer">
//                   {uploadedImage ? (
//                     <p>{uploadedImage.name}</p>
//                   ) : (
//                     <p>Drag & drop an image here or click to select one</p>
//                   )}
//                 </label>
//                 <input
//                   id="file-upload"
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFilePicker}
//                   className="hidden"
//                 />
//               </div>
//               {imageError && (
//                 <p className="text-red-500 text-sm mt-2">Please upload a valid image.</p>
//               )}

//               <button
//                 type="submit"
//                 className="w-full bg-custom text-black font-bold py-2 rounded-lg transition duration-300"
//                 disabled={!isFormComplete || loading}
//               >
//                 {loading ? "Submitting..." : "Complete Registration"}
//               </button>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;

// 'use client';

// import Image from "next/image";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { auth, db, storage } from "@/app/firebase/config";
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { doc, setDoc, getDoc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import teen from "../img.png";

// const Register = () => {
//   const [showError, setShowError] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     age: '',
//     yearLevel: '',
//   });
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [imageError, setImageError] = useState(false);
//   const router = useRouter();

//   const handleGoogleSignIn = async () => {
//     setLoading(true);
//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;

//       const userRef = doc(db, "students", user.uid);
//       const userDoc = await getDoc(userRef);

//       if (!userDoc.exists()) {
//         setFormData((prev) => ({
//           ...prev,
//           email: user.email,
//           name: user.displayName,
//         }));
//       } else {
//         alert("You are already registered! Welcome back, " + user.displayName);
//         router.push("/");
//       }
//     } catch (error) {
//       console.error(error);
//       setShowError(true);
//       setTimeout(() => setShowError(false), 3000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleImageUpload = (file) => {
//     if (!file) {
//       setImageError(true);
//       return;
//     }
//     setImageError(false);
//     setUploadedImage(file);
//   };

//   const handleFileDrop = (e) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     handleImageUpload(file);
//   };

//   const handleFilePicker = (e) => {
//     const file = e.target.files[0];
//     handleImageUpload(file);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const user = auth.currentUser;
//       if (!user) throw new Error("User is not authenticated");

//       // Upload image to Firebase Storage
//       let imageUrl = "";
//       if (uploadedImage) {
//         const storageRef = ref(storage, `images/${user.uid}/${uploadedImage.name}`);
//         await uploadBytes(storageRef, uploadedImage);
//         imageUrl = await getDownloadURL(storageRef);
//       }

//       // Save user data in Firestore
//       const userRef = doc(db, "users", user.uid);
//       await setDoc(userRef, { ...formData, imageUrl });

//       alert("Registration complete! Welcome, " + formData.name);
//       router.push("/");
//     } catch (error) {
//       console.error("Error submitting form: ", error);
//       setShowError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isFormComplete = formData.age && formData.yearLevel && uploadedImage;

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-300 p-4">
//       <div className="bg-white rounded-lg shadow-lg flex flex-col w-full max-w-lg">
//         <div className="w-full p-8 flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-t-lg">
//           <Image src={teen} width="260" height="260" alt="Teen Image" />
//         </div>
//         <div className="w-full p-8 flex flex-col justify-center items-center">
//           <h1 className="text-4xl font-bold text-gray-800 mb-4">Create Your Account</h1>
//           <p className="text-gray-600 mb-8">Please register to get started.</p>

//           {showError && (
//             <p className="text-red-500 mb-4 text-center">
//               Error: Please try again later.
//             </p>
//           )}

//           <button
//             onClick={handleGoogleSignIn}
//             className="w-full p-3 bg-white text-custom font-bold rounded-lg shadow-md hover:shadow-lg transition duration-300 hover:bg-gray-100"
//             disabled={loading}
//           >
//             {loading ? "Signing up with Google..." : "Sign up with Google"}
//           </button>

//           {formData.email && (
//             <form onSubmit={handleSubmit} className="mt-6 space-y-6 w-full">
//               <input
//                 type="text"
//                 id="name"
//                 placeholder="Full Name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 disabled
//                 className="w-full border rounded-lg p-3"
//               />
//               <input
//                 type="email"
//                 id="email"
//                 placeholder="Email"
//                 value={formData.email}
//                 disabled
//                 className="w-full border rounded-lg p-3 bg-gray-100"
//               />
//               <input
//                 type="number"
//                 id="age"
//                 placeholder="Age"
//                 value={formData.age}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full border rounded-lg p-3"
//                 min="18"
//               />
//               <select
//                 id="yearLevel"
//                 value={formData.yearLevel}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full border rounded-lg p-3"
//               >
//                 <option value="">Select Year Level</option>
//                 <option value="1st Year">1st Year</option>
//                 <option value="2nd Year">2nd Year</option>
//                 <option value="3rd Year">3rd Year</option>
//                 <option value="4th Year">4th Year</option>
//               </select>

//               <div
//                 onDrop={handleFileDrop}
//                 onDragOver={(e) => e.preventDefault()}
//                 className="w-full p-4 border border-dashed rounded-lg text-center cursor-pointer"
//               >
//                 {uploadedImage ? (
//                   <p>{uploadedImage.name}</p>
//                 ) : (
//                   <p>Drag & drop an image here or click to upload</p>
//                 )}
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFilePicker}
//                   className="hidden"
//                 />
//               </div>
//               {imageError && (
//                 <p className="text-red-500 text-sm mt-2">Please upload a valid image.</p>
//               )}

//               <button
//                 type="submit"
//                 className="w-full bg-custom text-black font-bold py-2 rounded-lg transition duration-300"
//                 disabled={!isFormComplete || loading}
//               >
//                 {loading ? "Submitting..." : "Complete Registration"}
//               </button>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;
