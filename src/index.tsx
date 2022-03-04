import React from "react";
import ReactDOM from "react-dom";
import Leaflet from "leaflet";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./firebase";

//ここでマーカーの画像のパスを指定する(defaultはundefined); => この処理はどっか別に移したいところ
Leaflet.Icon.Default.imagePath =
  "//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/";

ReactDOM.render(
  <React.StrictMode>
    <ToastContainer position="top-center" />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
