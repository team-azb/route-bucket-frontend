import React from "react";
import ReactDOM from "react-dom";
import Leaflet from "leaflet";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { initializeApp } from "firebase/app";

//ここでマーカーの画像のパスを指定する(defaultはundefined); => この処理はどっか別に移したいところ
Leaflet.Icon.Default.imagePath =
  "//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/";

const firebaseConfig = {
  apiKey: "AIzaSyBuwuzk6vGRZs7BNQdSrIU-4lcVMRx_39k",
  authDomain: "route-bucket-dev.firebaseapp.com",
  projectId: "route-bucket-dev",
  storageBucket: "route-bucket-dev.appspot.com",
  messagingSenderId: "816609137730",
  appId: "1:816609137730:web:e40cb4cb567ce8c26809db",
  measurementId: "G-DZXT9VND9L",
};
initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
