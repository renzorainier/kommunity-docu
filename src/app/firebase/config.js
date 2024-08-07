import { initializeApp, getApps, getApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCcSIHqKBrxiwjGATJluh-zv2F47_uheKA",
  authDomain: "mvbasys-6d906.firebaseapp.com",
  projectId: "mvbasys-6d906",
  storageBucket: "mvbasys-6d906.appspot.com",
  messagingSenderId: "177732960444",
  appId: "1:177732960444:web:cb13926fa86ea6c79950b9"
};


  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  export { auth, db };

  // const firebaseConfig = {
  //   apiKey: "AIzaSyCcSIHqKBrxiwjGATJluh-zv2F47_uheKA",
  //   authDomain: "mvbasys-6d906.firebaseapp.com",
  //   projectId: "mvbasys-6d906",
  //   storageBucket: "mvbasys-6d906.appspot.com",
  //   messagingSenderId: "177732960444",
  //   appId: "1:177732960444:web:cb13926fa86ea6c79950b9"
  // };


  // const firebaseConfig = {
  //   apiKey: "AIzaSyBGmvkRN4iFtDH1qcZfpUI7OsNI2FsD3Is",
  //   authDomain: "trialsys.firebaseapp.com",
  //   projectId: "trialsys",
  //   storageBucket: "trialsys.appspot.com",
  //   messagingSenderId: "165170725706",
  //   appId: "1:165170725706:web:63fe0a18851ac8e312b7b3"
  // };