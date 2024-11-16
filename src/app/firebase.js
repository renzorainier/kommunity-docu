import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAdkGqnV0LoPn-zx4RuIctUFKx7jHioNA8",
  authDomain: "finalprojmobcomp.firebaseapp.com",
  projectId: "finalprojmobcomp",
  storageBucket: "finalprojmobcomp.firebasestorage.app",
  messagingSenderId: "161357362360",
  appId: "1:161357362360:web:23aed8a503b8812868304d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage
const googleAuthProvider = new GoogleAuthProvider();

export { auth, db, storage, googleAuthProvider };








// import { initializeApp, getApps, getApp } from "firebase/app";
// import {getAuth} from 'firebase/auth'
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//     apiKey: "AIzaSyBGmvkRN4iFtDH1qcZfpUI7OsNI2FsD3Is",
//     authDomain: "trialsys.firebaseapp.com",
//     projectId: "trialsys",
//     storageBucket: "trialsys.appspot.com",
//     messagingSenderId: "165170725706",
//     appId: "1:165170725706:web:63fe0a18851ac8e312b7b3"
//   };

//   const app = initializeApp(firebaseConfig);
//   const auth = getAuth(app);
//   const db = getFirestore(app);

//   export { auth, db };