
import { useEffect, useContext, useState } from "react";
import API from "../api";
import { useSocket } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";
import {toast} from 'react-hot-toast'
import { useNavigate } from "react-router-dom";

export default function NotificationBell() {
  const { notifications, setNotifications } = useSocket();
  const { user } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate=useNavigate()

  
  async function fetchNotifications() {
    try {
      const { data } = await API.get("/notifications/");
      console.log("notification",data)
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNotifications(sorted);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }

  
  async function markAllRead() {
    try {
      await API.put("/notifications/read");
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (err) {
      console.error("Error marking notifications:", err);
    }
  }

  const handleNotificationClick = (n) => {
  setShowDropdown(false);
  navigate("/my-tasks");
};

 
  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="btn btn-ghost btn-circle relative"
      >
        
        {unreadCount > 0 && (
          <span className="badge badge-error absolute top-0 right-0 text-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-base-100 shadow-lg rounded-lg p-3 z-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={markAllRead}
                className="text-sm text-blue-500 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">No notifications</p>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {notifications.map((n) => (
                <li
                  key={n._id}
                  onClick={()=>handleNotificationClick(n)}
                  className={`p-2 rounded-md transition ${
                    n.isRead
                      ? "bg-base-200 text-gray-600"
                      : "bg-blue-50 dark:bg-blue-900/40 border-l-4 border-blue-500 font-semibold text-gray-900"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm flex-1">{n.message}</p>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 ml-2 mt-1"></span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 block mt-1">
                    {n.type} • {new Date(n.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
