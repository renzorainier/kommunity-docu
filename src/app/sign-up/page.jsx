"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "@/app/firebase/config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import teen from "../img.png";
import logo from "./search.png";

const skillOptions = [
  'Animals', 'Baby', 'Carpentry', 'Gardening', 'Other', 'Education', 'Fitness', 'Photography',
  'Cooking', 'Cleaning', 'Painting', 'Plumbing', 'Electrical', 'Landscaping', 'Mechanics',
  'Technology', 'Programming', 'Design', 'Music', 'Writing', 'Translation', 'Tutoring',
  'Repair', 'Transport', 'Travel', 'Event Planning', 'Marketing', 'Sales', 'Legal', 'Healthcare',
  'Childcare', 'Elderly Care', 'Pet Care', 'Housekeeping', 'Personal Assistant', 'Delivery',
  'Shopping', 'Social Media', 'Data Entry', 'Research', 'Customer Service', 'Consulting',
  'Decorating', 'Sewing', 'Knitting', 'Weaving', 'Crafts', 'Woodworking', 'Metalworking',
  'Welding', 'Cleaning Services', 'Pool Maintenance', 'Car Wash', 'Car Detailing',
  'IT Support', 'Network Installation', 'Security Systems', 'Home Renovation', 'Interior Design',
  'Exterior Design', 'Real Estate', 'Finance', 'Accounting', 'Tax Preparation', 'Investments',
  'Insurance', 'Hairdressing', 'Barber', 'Makeup', 'Nails', 'Fashion Design', 'Modeling',
  'Acting', 'Dancing', 'Event Hosting', 'Catering', 'Baking', 'Bartending', 'DJing',
  'Entertainment', 'Gaming', 'Virtual Assistant', 'Surveying', 'Fitness Training',
  'Yoga Instruction', 'Meditation Coaching', 'Life Coaching', 'Career Coaching',
  'Business Strategy', 'Public Speaking', 'Writing Resumes', 'Content Creation',
  'Blogging', 'Vlogging', 'Podcasting', 'Video Editing', 'Graphic Design',
  'UI/UX Design', 'Animation', '3D Modeling', 'Game Design', 'App Development',
  'Software Development'
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
        const storageRef = ref(
          storage,
          `images/${user.uid}/${uploadedImage.name}`
        );
        await uploadBytes(storageRef, uploadedImage);
        imageUrl = await getDownloadURL(storageRef);
      }

      const fullName = `${formData.firstName} ${formData.surname}`;

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        name: fullName,
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

        <div className="min-h-screen flex flex-col items-center justify-between bg-[#F8FBFF] px-6 py-10">
  {/* Logo Section */}
  <div className="flex flex-col items-center mb-10">
    <Image src={teen} width={220} height={200} alt="KommUnity Logo" />
    <h1 className="text-4xl md:text-6xl font-bold text-gray-700 mt-4">KommUnity</h1>
  </div>

  {/* Sign Up Header */}
  <div className="w-full flex flex-col items-center md:items-start px-6 md:px-8 mb-6">
    <h2 className="text-2xl font-extrabold text-gray-700 mb-2">Sign Up</h2>
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

  {/* Google Sign-up Button */}
  <div className="w-full flex justify-center mt-6">
    <button
      onClick={handleGoogleSignIn}
      className="w-[350px] md:w-[400px] flex items-center justify-center py-3 bg-white text-gray-800 border border-gray-300 rounded-full shadow-md hover:bg-[#F8FBFF] font-roboto-mono"
      disabled={loading}
    >
      <Image
        src={logo}
        width={20}
        height={20}
        alt="Google Icon"
        className="mr-2"
      />
      {loading ? "Signing up with Google..." : "Continue with Google"}
    </button>
  </div>

  {/* Footer Section */}
  <div className="text-center mt-6">
    <p className="text-gray-600 text-sm font-roboto-mono">
      Already have an account?{" "}
      <a href="/sign-in" className="text-blue-500 hover:underline">
        Log In
      </a>
    </p>
  </div>
</div>

      ) : (
        // Registration Form
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
          {/* Logo Section */}
          <div className="flex flex-center items-center mb-8">
            <Image
              src={teen}
              alt="KommUnity Logo"
              width={100}
              height={40}
            />
            <h1 className="text-5xl font-bold text-gray-800 mt-4">KommUnity</h1>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 text-left">
              Sign Up
            </h2>

            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-semibold text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                placeholder="Juan"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm focus:ring focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Surname */}
            <div>
              <label
                htmlFor="surname"
                className="block text-sm font-semibold text-gray-700">
                Surname <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="surname"
                placeholder="Cruz"
                value={formData.surname}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm focus:ring focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label
                htmlFor="contactNumber"
                className="block text-sm font-semibold text-gray-700">
                Contact Number
              </label>
              <input
                type="tel"
                id="contactNumber"
                placeholder="0927 123 4567"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm focus:ring focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Facebook Link */}
            <div>
              <label
                htmlFor="facebookLink"
                className="block text-sm font-semibold text-gray-700">
                Facebook Link
              </label>
              <input
                type="url"
                id="facebookLink"
                placeholder="https://facebook.com/john.doe"
                value={formData.facebookLink}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm focus:ring focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Job Skillset */}
            <div>
              <label
                htmlFor="jobSkillset"
                className="block text-sm font-semibold text-gray-700">
                Job Skillset <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={searchText}
                  onChange={handleSkillSearch}
                  placeholder="Search job skills"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm focus:ring focus:ring-blue-500 focus:outline-none"
                />
                {searchText && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-lg">
                    {filteredSkills.map((skill, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-blue-50"
                        onClick={() => handleSkillAdd(skill)}
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {formData.jobSkillset.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg text-sm flex items-center">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleSkillRemove(skill)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Upload Profile Picture */}
            <div>
              <label
                htmlFor="imageUpload"
                className="block text-sm font-semibold text-gray-700">
                Profile Picture <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={(e) => handleFilePicker(e)}
                className="w-full text-sm mt-1"
              />
              {imageError && (
                <p className="text-red-500 text-xs mt-1">
                  Please select an image file.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormComplete}
              className="w-full py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold disabled:bg-gray-400"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Register;

// //
// "use client";


// import Image from "next/image";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { auth, db, storage } from "@/app/firebase/config";
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { doc, setDoc, getDoc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import teen from "../img.png";


// const skillOptions = [
//   "Web Development",
//   "Graphic Design",
//   "Data Analysis",
//   "Content Writing",
//   "Marketing",
//   "Project Management",
//   "Software Testing",
// ];


// const Register = () => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     surname: "",
//     contactNumber: "",
//     facebookLink: "",
//     email: "",
//     jobSkillset: [],
//   });
//   const [searchText, setSearchText] = useState("");
//   const [filteredSkills, setFilteredSkills] = useState(skillOptions);
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [imageError, setImageError] = useState(false);
//   const [showError, setShowError] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();


//   const handleGoogleSignIn = async () => {
//     setLoading(true);
//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;


//       const userRef = doc(db, "users", user.uid);
//       const userDoc = await getDoc(userRef);


//       if (!userDoc.exists()) {
//         setFormData((prev) => ({
//           ...prev,
//           email: user.email,
//         }));
//       } else {
//         alert("You are already registered! Welcome back.");
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


//   const handleSkillSearch = (e) => {
//     const text = e.target.value;
//     setSearchText(text);
//     setFilteredSkills(
//       skillOptions.filter(
//         (skill) =>
//           skill.toLowerCase().includes(text.toLowerCase()) &&
//           !formData.jobSkillset.includes(skill)
//       )
//     );
//   };


//   const handleSkillAdd = (skill) => {
//     setFormData((prev) => ({
//       ...prev,
//       jobSkillset: [...prev.jobSkillset, skill],
//     }));
//     setSearchText("");
//     setFilteredSkills([]);
//   };


//   const handleSkillRemove = (skill) => {
//     setFormData((prev) => ({
//       ...prev,
//       jobSkillset: prev.jobSkillset.filter((s) => s !== skill),
//     }));
//   };


//   const handleImageUpload = (file) => {
//     if (!file) {
//       setImageError(true);
//       return;
//     }
//     setImageError(false);
//     setUploadedImage(file);
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


//       let imageUrl = "";
//       if (uploadedImage) {
//         const storageRef = ref(storage, `images/${user.uid}/${uploadedImage.name}`);
//         await uploadBytes(storageRef, uploadedImage);
//         imageUrl = await getDownloadURL(storageRef);
//       }


//       const fullName = `${formData.firstName} ${formData.surname}`; // Merge names


//       const userRef = doc(db, "users", user.uid);
//       await setDoc(userRef, {
//         name: fullName, // Store merged name
//         contactNumber: formData.contactNumber,
//         facebookLink: formData.facebookLink,
//         email: formData.email,
//         jobSkillset: formData.jobSkillset,
//         imageUrl,
//         userID: user.uid,
//       });


//       alert("Registration complete! Welcome, " + fullName);
//       router.push("/");
//     } catch (error) {
//       console.error("Error submitting form: ", error);
//       setShowError(true);
//     } finally {
//       setLoading(false);
//     }
//   };




//   const isFormComplete =
//     formData.firstName &&
//     formData.surname &&
//     formData.contactNumber &&
//     formData.facebookLink &&
//     uploadedImage;


//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-300 p-4">
//       <div className="bg-white rounded-lg shadow-lg flex flex-col w-full max-w-lg">
//         <div className="w-full p-8 flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-t-lg">
//           <Image src={teen} width={260} height={260} alt="Teen Image" />
//         </div>
//         <div className="w-full p-8 flex flex-col justify-center items-center">
//           <h1 className="text-4xl font-bold text-gray-800 mb-4">Create Your Account</h1>
//           {showError && (
//             <p className="text-red-500 mb-4 text-center">
//               Error: Please try again later.
//             </p>
//           )}
//           <button
//             onClick={handleGoogleSignIn}
//             className="w-full p-3 bg-white text-black font-bold rounded-lg shadow-md"
//             disabled={loading}
//           >
//             {loading ? "Signing up with Google..." : "Sign up with Google"}
//           </button>
//           {formData.email && (
//             <form onSubmit={handleSubmit} className="mt-6 space-y-6 w-full">
//               <input
//                 type="text"
//                 id="firstName"
//                 placeholder="First Name"
//                 value={formData.firstName}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full border rounded-lg p-3"
//               />
//               <input
//                 type="text"
//                 id="surname"
//                 placeholder="Surname"
//                 value={formData.surname}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full border rounded-lg p-3"
//               />
//               <input
//                 type="text"
//                 id="contactNumber"
//                 placeholder="Contact Number"
//                 value={formData.contactNumber}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full border rounded-lg p-3"
//               />
//               <input
//                 type="url"
//                 id="facebookLink"
//                 placeholder="Facebook Link"
//                 value={formData.facebookLink}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full border rounded-lg p-3"
//               />


//               <div className="w-full">
//                 <label className="block mb-2 font-bold">Search Skills:</label>
//                 <input
//                   type="text"
//                   placeholder="Type a skill..."
//                   value={searchText}
//                   onChange={handleSkillSearch}
//                   className="w-full border rounded-lg p-3"
//                 />
//                 {filteredSkills.length > 0 && (
//                   <ul className="border mt-2 rounded-lg max-h-40 overflow-y-scroll">
//                     {filteredSkills.map((skill) => (
//                       <li
//                         key={skill}
//                         onClick={() => handleSkillAdd(skill)}
//                         className="p-2 cursor-pointer hover:bg-gray-100"
//                       >
//                         {skill}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//                 <div className="mt-4 flex flex-wrap gap-2">
//                   {formData.jobSkillset.map((skill) => (
//                     <div
//                       key={skill}
//                       className="bg-gray-200 rounded-full px-4 py-1 text-sm flex items-center gap-2"
//                     >
//                       {skill}
//                       <button
//                         type="button"
//                         onClick={() => handleSkillRemove(skill)}
//                         className="text-red-500 font-bold"
//                       >
//                         x
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>


//               <div
//                 className="w-full p-4 border border-dashed rounded-lg text-center cursor-pointer"
//                 onClick={() => document.getElementById("file-upload").click()}
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
//                 className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg"
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
