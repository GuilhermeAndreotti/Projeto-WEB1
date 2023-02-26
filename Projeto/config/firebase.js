 // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
  import {getAuth, setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
  import { initializeFirestore } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
  import { getStorage } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";

 
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAQF_dwg5z9-AsvGLZC0Tf2SJ7QchvEccs",
    authDomain: "myhealth-db.firebaseapp.com",
    projectId: "myhealth-db",
    storageBucket: "myhealth-db.appspot.com",
    messagingSenderId: "1070391820809",
    appId: "1:1070391820809:web:18eb32caf001a797f46ed8"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
setPersistence(auth, browserSessionPersistence)
const db = initializeFirestore(app, {experimentalForceLongPolling: true})

const storage = getStorage(app)

export {app, db, auth, storage}
