import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyDzq5jJUDsZ-gmU7SL55aqiyRwEiii6mR4",
  authDomain: "react-slack-clone-97bf1.firebaseapp.com",
  databaseURL: "https://react-slack-clone-97bf1.firebaseio.com",
  projectId: "react-slack-clone-97bf1",
  storageBucket: "react-slack-clone-97bf1.appspot.com",
  messagingSenderId: "846900758786",
  appId: "1:846900758786:web:9c320163d4b36154249a1b"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
