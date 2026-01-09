// import { createContext, useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { AuthContext } from "./AuthContext";

// const SocketContext = createContext();

// export const SocketProvider = ({ children }) => {
//   const { user } = useContext(AuthContext);
//   const [socket, setSocket] = useState(null);
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     if (user?._id) {
//       const s = io("http://localhost:5000");
//       s.emit("registerUser", user._id);
//       s.on("notification", (data) => {
//         setNotifications((prev) => [data, ...prev]);
//       });
//       setSocket(s);
//       return () => s.disconnect();
//     }
//   }, [user]);

//   return (
//     <SocketContext.Provider value={{ socket, notifications, setNotifications }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocket = () => useContext(SocketContext);
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";
import {toast} from 'react-hot-toast'

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {

    if (!user?.id) return ;
    if (user) {
      console.log("🔌 Connecting socket for user:", user);
      const s = io("http://localhost:5000", {
        transports: ["websocket"],
        reconnectionAttempts: 5,
      });

      s.on("connect", () => {
        console.log(" Socket connected:", s.id);
        s.emit("registerUser", user.id);
      });

      s.on("notification", (data) => {
        console.log(" New Notification:", data);
        setNotifications((prev) => [data, ...prev]);
        if (data.type === "Payroll") {
    toast.success(data.message);
  }
      });

     s.on("taskAssigned", (data) => {
        toast.success(` ${data.message}`, { duration: 4000 });
        setNotifications((prev) => [
          { ...data, isRead: false, createdAt: new Date() },
          ...prev,
        ]);
      });

      s.on("disconnect", () => {
        console.log(" Socket disconnected");
      });

      setSocket(s);

      return () => {
        console.log(" Disconnecting socket...");
        s.disconnect();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, notifications, setNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
