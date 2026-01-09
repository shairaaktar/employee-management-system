// import { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../context/AuthContext";
// import API from "../api";
// import toast from "react-hot-toast";
// import {motion} from 'framer-motion'
// import ThemeToggle from "../components/theme-toggle";

// export default function EmployeeDashboard() {
//   const { user, logout } = useContext(AuthContext);
//   const [payrolls, setPayrolls] = useState([]);

//   const fetchPayrolls = async () => {
//     try {
//       const { data } = await API.get("/payrolls/my");
//       console.log("data",data)
//       // Filter payrolls for current employee (by email)
//       const userPayrolls = data.filter(
//         (p) => p.employee?.email === user?.email
//       );
//       setPayrolls(userPayrolls);
//     } catch {
//       toast.error("Failed to load payrolls");
//     }
//   };

//   useEffect(() => {
//     fetchPayrolls();
//   }, []);

//   return (
//     <motion.div 
//     initial={{opacity:0,y:30}}
//     animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}

//     >

//       <h1 className="text-3xl font-bold mb-6">Employee Dashboard</h1>
//       <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
//         {/* <button
//           onClick={() => logout()}
//           className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-3 md:mt-0"
//         >
//           Logout
//         </button> */}

       
//       </div>

//       {/* Profile Info */}
//       <div className="bg-white p-6 rounded shadow mb-6">
//         <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
//         <div className="grid md:grid-cols-2 gap-4 text-gray-700">
//           <p><strong>Name:</strong> {user?.name}</p>
//           <p><strong>Email:</strong> {user?.email}</p>
//           <p><strong>Department:</strong> {user?.department || "N/A"}</p>
//           <p><strong>Role:</strong> {user?.role || "Employee"}</p>
//         </div>
//       </div>

//       {/* Payroll History */}
//       <div className="bg-white p-6 rounded shadow">
//         <h2 className="text-xl font-semibold mb-4">Payroll History</h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-2 text-left">Month</th>
//                 <th className="p-2 text-left">Base Salary</th>
//                 <th className="p-2 text-left">Bonus</th>
//                 <th className="p-2 text-left">Deductions</th>
//                 <th className="p-2 text-left">Net Salary</th>
//                 <th className="p-2 text-left">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {payrolls.length > 0 ? (
//                 payrolls.map((p) => (
//                   <tr key={p._id} className="border-b hover:bg-gray-50">
//                     <td className="p-2">{p.month}</td>
//                     <td className="p-2">${p.baseSalary}</td>
//                     <td className="p-2">${p.bonus}</td>
//                     <td className="p-2">${p.deductions}</td>
//                     <td className="p-2 font-semibold">${p.netSalary}</td>
//                     <td
//                       className={`p-2 font-semibold ${
//                         p.paid ? "text-green-600" : "text-yellow-600"
//                       }`}
//                     >
//                       {p.paid ? "Paid" : "Pending"}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="p-4 text-center text-gray-500">
//                     No payroll records found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>

//     </motion.div>
    
//   );
// }


import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import ThemeToggle from "../components/theme-toggle";
import { Clock, DollarSign, User, CalendarDays } from "lucide-react";

export default function EmployeeDashboard() {
  const { user } = useContext(AuthContext);
  const [payrolls, setPayrolls] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  
  const fetchPayrolls = async () => {
    try {
      const { data } = await API.get("/payrolls/my");
      const userPayrolls = data.filter((p) => p.employee?.email === user?.email);
      setPayrolls(userPayrolls);
    } catch {
      toast.error("Failed to load payrolls");
    }
  };

  
  const fetchAttendance = async () => {
    try {
      const res = await API.get("/attendance/my");
      setAttendance(res.data);
    } catch {
      toast.error("Failed to load attendance data");
    }
  };

 
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
    fetchPayrolls();
    fetchAttendance();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 md:p-10 transition-all"
    >
    
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome, {user?.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Here’s an overview of your payroll, attendance, and work stats.
          </p>
        </div>
        <ThemeToggle />
      </div>

      
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
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <User className="text-indigo-500 w-6 h-6" />
          <h2 className="text-xl font-semibold">Profile Information</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <p>
            <strong>Name:</strong> {user?.name}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Department:</strong> {user?.department || "N/A"}
          </p>
          <p>
            <strong>Role:</strong> {user?.role || "Employee"}
          </p>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="text-teal-500 w-6 h-6" />
          <h2 className="text-xl font-semibold">Payroll History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-2 text-left">Month</th>
                <th className="p-2 text-left">Base Salary</th>
                <th className="p-2 text-left">Bonus</th>
                <th className="p-2 text-left">Deductions</th>
                <th className="p-2 text-left">Net Salary</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.length > 0 ? (
                payrolls.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40"
                  >
                    <td className="p-2">{p.month}</td>
                    <td className="p-2">${p.baseSalary}</td>
                    <td className="p-2">${p.bonus}</td>
                    <td className="p-2">${p.deductions}</td>
                    <td className="p-2 font-semibold">${p.netSalary}</td>
                    <td
                      className={`p-2 font-semibold ${
                        p.status === "Approved"
                          ? "text-emerald-600"
                          : "text-yellow-500"
                      }`}
                    >
                      {p.status === "Approved" ? "Paid" : "Pending"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No payroll records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      
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
