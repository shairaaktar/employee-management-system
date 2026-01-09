import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import ThemeToggle from "../components/theme-toggle";
import { Clock, DollarSign, User, CalendarDays } from "lucide-react";

export default function PayrollHistory() {
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

  
  
  

  

  useEffect(() => {
    fetchPayrolls();
   
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

     
   
    </motion.div>
  );
}
