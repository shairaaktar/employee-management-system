import { useEffect, useState } from "react";
import API from "../api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const res = await API.get("/notifications");
    setNotifications(res.data);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n._id}
            className={`p-4 rounded-xl shadow ${
              n.isRead ? "bg-gray-100 dark:bg-gray-700" : "bg-blue-100 dark:bg-blue-800"
            }`}
          >
            <h3 className="font-semibold">{n.title}</h3>
            <p className="text-sm">{n.message}</p>
            <p className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
