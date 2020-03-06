import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyBB-p-MiGKGx6zlXI4on7tTLbqYxsftgCc",
  authDomain: "d-and-d-b2154.firebaseapp.com",
  databaseURL: "https://d-and-d-b2154.firebaseio.com",
  projectId: "d-and-d-b2154",
  storageBucket: "d-and-d-b2154.appspot.com",
  messagingSenderId: "971384123650",
  appId: "1:971384123650:web:036f2b7c1e3ac94d3a921b",
  measurementId: "G-K7RE0FFTS1"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db: firebase.firestore.Firestore = firebase.firestore();

export default db;
