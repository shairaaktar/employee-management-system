// import { useEffect, useState } from "react";
// import API from "../api";
// import { Link } from "react-router-dom";
// import {motion} from "framer-motion"
// import 
// { BarChart,
//    Bar, 
//    XAxis,
//     YAxis, 
//     Tooltip,
//      ResponsiveContainer,
//       PieChart,
//        Pie, 
//        Cell,
//         Legend
//        } from "recharts";
// import toast from "react-hot-toast";

// export default function HrDashboard() {
//   const [employees, setEmployees] = useState([]);
//   const [payrolls, setPayrolls] = useState([]);
//   const [stats, setStats] = useState({
//     totalEmployees: 0,
//     totalPayroll: 0,
//     avgSalary: 0,
//     paidCount: 0,
//     unpaidCount: 0,
//   });

//   const COLORS = ["#22c55e", "#ef4444", "#3b82f6", "#facc15", "#8b5cf6"];

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [empRes, payRes] = await Promise.all([
//           API.get("/employees"),
//           API.get("/payrolls"),
//         ]);
//         setEmployees(empRes.data);
//         setPayrolls(payRes.data);
//         calculateStats(empRes.data, payRes.data);
//       } catch {
//         toast.error("Failed to load HR dashboard data");
//       }
//     };
//     fetchData();
//   }, []);

//   const calculateStats = (employees, payrolls) => {
//     const totalEmployees = employees.length;
//     const totalPayroll = payrolls.reduce((sum, p) => sum + p.netSalary, 0);
//     const avgSalary =
//       totalEmployees > 0
//         ? Math.round(
//             employees.reduce((sum, e) => sum + Number(e.salary || 0), 0) /
//               totalEmployees
//           )
//         : 0;
//     const paidCount = payrolls.filter((p) => p.paid).length;
//     const unpaidCount = payrolls.length - paidCount;

//     setStats({
//       totalEmployees,
//       totalPayroll,
//       avgSalary,
//       paidCount,
//       unpaidCount,
//     });
//   };

//   // Prepare chart data
//   const payrollStatusData = [
//     { name: "Paid", value: stats.paidCount },
//     { name: "Unpaid", value: stats.unpaidCount },
//   ];

//   const departmentData = Object.values(
//     employees.reduce((acc, emp) => {
//       if (!acc[emp.department]) acc[emp.department] = { name: emp.department, value: 0 };
//       acc[emp.department].value += Number(emp.salary || 0);
//       return acc;
//     }, {})
//   );

//   return (
//     <motion.div 
//     initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <h1 className="text-3xl font-bold mb-6">Hr Dashboard</h1>
//       <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6">HR Dashboard</h1>

//       {/* Stats Cards */}
//       <div className="grid md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white p-4 rounded shadow">
//           <h3 className="text-sm text-gray-500">Total Employees</h3>
//           <p className="text-2xl font-semibold">{stats.totalEmployees}</p>
//         </div>
//         <div className="bg-white p-4 rounded shadow">
//           <h3 className="text-sm text-gray-500">Total Payroll</h3>
//           <p className="text-2xl font-semibold">${stats.totalPayroll.toLocaleString()}</p>
//         </div>
//         <div className="bg-white p-4 rounded shadow">
//           <h3 className="text-sm text-gray-500">Average Salary</h3>
//           <p className="text-2xl font-semibold">${stats.avgSalary}</p>
//         </div>
//         <div className="bg-white p-4 rounded shadow">
//           <h3 className="text-sm text-gray-500">Paid / Unpaid</h3>
//           <p className="text-2xl font-semibold">
//             {stats.paidCount} / {stats.unpaidCount}
//           </p>
//         </div>
//       </div>

//       {/* Charts Section */}
//       <div className="grid md:grid-cols-2 gap-6 mb-6">
//         {/* Pie Chart - Payroll Status */}
//         <div className="bg-white p-4 rounded shadow">
//           <h3 className="text-lg font-semibold mb-2">Payroll Status</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={payrollStatusData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={100}
//                 label
//               >
//                 {payrollStatusData.map((_, index) => (
//                   <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Bar Chart - Department Salary Distribution */}
//         <div className="bg-white p-4 rounded shadow">
//           <h3 className="text-lg font-semibold mb-2">Department Salary Distribution</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={departmentData}>
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="value" fill="#3b82f6" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Recent Employees */}
//       <div className="bg-white p-4 rounded shadow mb-6">
//         <h3 className="text-lg font-semibold mb-3">Recent Employees</h3>
//         <table className="min-w-full text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-2 text-left">Name</th>
//               <th className="p-2 text-left">Department</th>
//               <th className="p-2 text-left">Role</th>
//               <th className="p-2 text-left">Salary</th>
//             </tr>
//           </thead>
//           <tbody>
//             {employees.slice(-5).reverse().map((emp) => (
//               <tr key={emp._id} className="border-b hover:bg-gray-50">
//                 <td className="p-2">{emp.name}</td>
//                 <td className="p-2">{emp.department}</td>
//                 <td className="p-2">{emp.role}</td>
//                 <td className="p-2">${emp.salary}</td>
//                 <td>Last Login: {new Date(emp.userAccount.lastLogin).toLocaleString()}</td>

//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Quick Actions */}
//       <div className="flex flex-wrap gap-3">
//         <Link to="/add-employee" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//           + Add Employee
//         </Link>
//         <Link to="/add-payroll" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
//           + Add Payroll
//         </Link>
//         <Link to="/employees" className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">
//           View Employees
//         </Link>
//         <Link to="/payrolls" className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
//           View Payrolls
//         </Link>
//       </div>
//     </div>
//     </motion.div>
//   );
// }

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Users,
  DollarSign,
  Briefcase,
  CheckCircle,
  Moon,
  Sun,
} from "lucide-react";
import API from "../api";
import toast from "react-hot-toast";

const COLORS = ["#10b981", "#f59e0b", "#6366f1", "#14b8a6", "#a855f7"]; // Emerald, Amber, Indigo, Teal, Violet

export default function HrDashboard() {
  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalPayroll: 0,
    avgSalary: 0,
    paidCount: 0,
    unpaidCount: 0,
    completedTasks: 0,
    departments: [],
  });

  
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, payRes, analyticsRes] = await Promise.all([
          API.get("/employees"),
          API.get("/payrolls"),
          API.get("/analytics"),
        ]);

        const analytics = analyticsRes?.data || {};
        setEmployees(empRes.data);
        setPayrolls(payRes.data);
        calculateStats(empRes.data, payRes.data, analytics);
      } catch {
        toast.error("Failed to load HR dashboard data");
      }
    };
    fetchData();
  }, []);

  const calculateStats = (employees, payrolls, analytics) => {
    const totalEmployees = employees.length;
    const totalPayroll = payrolls.reduce(
      (sum, p) => sum + (p.finalSalary || 0),
      0
    );
    const avgSalary =
      totalEmployees > 0
        ? Math.round(
            employees.reduce((sum, e) => sum + Number(e.salary || 0), 0) /
              totalEmployees
          )
        : 0;

    const paidCount = payrolls.filter((p) => p.status === "Approved").length;
    const unpaidCount = payrolls.length - paidCount;

    const departments =
      analytics.departments && analytics.departments.length
        ? analytics.departments
        : Object.values(
            employees.reduce((acc, emp) => {
              if (!acc[emp.department])
                acc[emp.department] = { _id: emp.department, count: 0 };
              acc[emp.department].count++;
              return acc;
            }, {})
          );

    setStats({
      totalEmployees,
      totalPayroll,
      avgSalary,
      paidCount,
      unpaidCount,
      completedTasks: analytics.completedTasks || 0,
      departments,
    });
  };

  const payrollStatusData = [
    { name: "Paid", value: stats.paidCount },
    { name: "Unpaid", value: stats.unpaidCount },
  ];

  const departmentSalaryData = Object.values(
    employees.reduce((acc, emp) => {
      if (!acc[emp.department])
        acc[emp.department] = { name: emp.department, value: 0 };
      acc[emp.department].value += Number(emp.salary || 0);
      return acc;
    }, {})
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`p-6 md:p-10 min-h-screen transition-all ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold">Human Resource Dashboard</h1>

        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            {darkMode ? (
              <Sun className="text-yellow-400" />
            ) : (
              <Moon className="text-gray-700" />
            )}
          </button>

          <Link
            to="/add-employee"
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition"
          >
            + Add Employee
          </Link>
          <Link
            to="/add-payroll"
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            + Add Payroll
          </Link>
          <Link
            to="/employees"
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            View Employees
          </Link>
          <Link
            to="/payrolls"
            className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition"
          >
            View Payrolls
          </Link>
        </div>
      </div>

      
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        {[
          {
            label: "Total Employees",
            value: stats.totalEmployees,
            icon: <Users className="w-6 h-6 text-emerald-600" />,
          },
          {
            label: "Total Payroll",
            value: `$${stats.totalPayroll.toLocaleString()}`,
            icon: <DollarSign className="w-6 h-6 text-indigo-600" />,
          },
          {
            label: "Average Salary",
            value: `$${stats.avgSalary}`,
            icon: <Briefcase className="w-6 h-6 text-teal-600" />,
          },
          {
            label: "Completed Tasks",
            value: stats.completedTasks,
            icon: <CheckCircle className="w-6 h-6 text-emerald-500" />,
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.04 }}
            className={`bg-white/70 dark:bg-gray-800/70 p-6 rounded-xl shadow-sm backdrop-blur-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm">
                  {card.label}
                </h3>
                <p className="text-3xl font-bold mt-1">{card.value}</p>
              </div>
              {card.icon}
            </div>
          </motion.div>
        ))}
      </div>

      
      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Payroll Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={payrollStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label
              >
                {payrollStatusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">
            Department Salary Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentSalaryData}>
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Department Distribution</h3>
          {stats.departments.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.departments.map((d) => ({
                    name: d._id,
                    value: d.count,
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {stats.departments.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-20">
              No department data available
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">
            Task Completion Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[stats]}>
              <XAxis dataKey="completedTasks" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completedTasks" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Recent Employees</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Department</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Salary</th>
                <th className="p-2 text-left">Last Login</th>
              </tr>
            </thead>
            <tbody>
              {employees.slice(-5).reverse().map((emp) => (
                <tr
                  key={emp._id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="p-2">{emp.name}</td>
                  <td className="p-2">{emp.department}</td>
                  <td className="p-2">{emp.role}</td>
                  <td className="p-2">${emp.salary}</td>
                  <td className="p-2 text-gray-500">
                    {emp.userAccount?.lastLogin
                      ? new Date(emp.userAccount.lastLogin).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
