import { useEffect, useState } from "react";
import API from "../api";
import {motion} from  "framer-motion"

export default function EmployeeDashboard2() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  const clockIn = async () => {
    try {
      setLoading(true);
      await API.post("/attendance/clockin");
      fetchAttendance();
    } catch (err) {
      alert(err.response?.data?.message || "Clock-in failed");
    } finally {
      setLoading(false);
    }
  };

  const clockOut = async () => {
    try {
      setLoading(true);
      await API.post("/attendance/clockout");
      fetchAttendance();
    } catch (err) {
      alert(err.response?.data?.message || "Clock-out failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    const res = await API.get("/attendance/my");
    setAttendance(res.data);
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <motion.div
    initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
        <h1 className="text-3xl font-bold mb-6">Employee Dashboard2</h1>
        <div>
      <h1 className="text-3xl font-bold mb-6">Employee Dashboard</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={clockIn}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Clock In
        </button>
        <button
          onClick={clockOut}
          disabled={loading}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Clock Out
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-3">Attendance History</h2>
      <div className="space-y-2">
        {attendance.map((a) => (
          <div
            key={a._id}
            className="bg-white/60 dark:bg-gray-800/50 p-4 rounded-lg shadow flex justify-between"
          >
            <div>
              <p className="font-semibold">{new Date(a.date).toDateString()}</p>
              <p className="text-sm text-gray-500">
                Status: {a.status}
              </p>
            </div>
            <div className="text-sm text-gray-600">
              <p>In: {a.checkIn ? new Date(a.checkIn).toLocaleTimeString() : "-"}</p>
              <p>Out: {a.checkOut ? new Date(a.checkOut).toLocaleTimeString() : "-"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </motion.div>
  );
}
