import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import ThemeToggle from "../components/theme-toggle";
import { Clock, DollarSign, User, CalendarDays } from "lucide-react";

export default function AttendanceHistory() {
  const { user } = useContext(AuthContext);
  const [payrolls, setPayrolls] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  

  

  
  const fetchAttendance = async () => {
    try {
      const res = await API.get("/attendance/my");
      setAttendance(res.data);
    } catch {
      toast.error("Failed to load attendance data");
    }
  };
  // const fetchAttendanceForManager = async () => {
  //   try {
  //     const res = await API.get("/attendance/manager");
  //     setAttendance(res.data);
  //   } catch {
  //     toast.error("Failed to load attendance data");
  //   }
  // };


  
  const clockIn = async () => {
    try {
      setLoading(true);
      await API.post("/attendance/clockin");
      toast.success("Clocked in successfully!");
      fetchAttendance();
    } catch (err) {
      toast.error(err.response?.data?.message || "Clock-in failed");
    } finally {
      setLoading(false);
    }
  };

  const clockOut = async () => {
    try {
      setLoading(true);
      await API.post("/attendance/clockout");
      toast.success("Clocked out successfully!");
      fetchAttendance();
    } catch (err) {
      toast.error(err.response?.data?.message || "Clock-out failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   

    
    fetchAttendance();
   
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 md:p-10 transition-all"
    >
      {/* Header */}
      {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome, {user?.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Here’s an overview of your payroll, attendance, and work stats.
          </p>
        </div>
        <ThemeToggle />
      </div> */}

      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="text-emerald-500 w-6 h-6" />
          <div>
            <h2 className="text-xl font-semibold">Time Tracking</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Manage your daily attendance
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={clockIn}
            disabled={loading}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition disabled:opacity-60"
          >
            Clock In
          </button>
          <button
            onClick={clockOut}
            disabled={loading}
            className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition disabled:opacity-60"
          >
            Clock Out
          </button>
        </div>
      </div>

      
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
      >
        <div className="flex items-center gap-3 mb-4">
          <CalendarDays className="text-emerald-500 w-6 h-6" />
          <h2 className="text-xl font-semibold">Attendance History</h2>
        </div>
        <div className="space-y-3">
          {attendance.length > 0 ? (
            attendance.map((a) => (
              <div
                key={a._id}
                className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
              >
                <div>
                  <p className="font-semibold">
                    {new Date(a.date).toDateString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Status: {a.status}
                  </p>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 text-right">
                  <p>
                    In:{" "}
                    {a.checkIn
                      ? new Date(a.checkIn).toLocaleTimeString()
                      : "-"}
                  </p>
                  <p>
                    Out:{" "}
                    {a.checkOut
                      ? new Date(a.checkOut).toLocaleTimeString()
                      : "-"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-10">
              No attendance records found.
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
