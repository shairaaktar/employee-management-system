import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx"; 
import {Toaster} from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContent.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

 const clientId=import.meta.env.VITE_GOOGLE_CLIENT_ID


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
        <SocketProvider>
          <ThemeProvider>
           <GoogleOAuthProvider clientId={clientId}>
               <App />
           </GoogleOAuthProvider>
     
      </ThemeProvider>
      </SocketProvider>
      <Toaster position="top-right" reverseOrder={false}/>
    </AuthProvider>
  </React.StrictMode>
);
