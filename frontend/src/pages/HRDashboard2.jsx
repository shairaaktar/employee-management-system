import { useEffect, useState } from "react";
import API from "../api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function HrDashboard2() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    completedTasks: 0,
    totalPayroll: 0,
    departments: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await API.get("/analytics");
      setStats(res.data);
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">HR Dashboard</h1>

      
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white/60 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg text-center">
          <h3 className="text-gray-500 text-sm">Total Employees</h3>
          <p className="text-3xl font-bold">{stats.totalEmployees}</p>
        </div>
        <div className="bg-white/60 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg text-center">
          <h3 className="text-gray-500 text-sm">Completed Tasks</h3>
          <p className="text-3xl font-bold">{stats.completedTasks}</p>
        </div>
        <div className="bg-white/60 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg text-center">
          <h3 className="text-gray-500 text-sm">Total Payroll</h3>
          <p className="text-3xl font-bold">${stats.totalPayroll.toLocaleString()}</p>
        </div>
      </div>

      
      <div className="grid md:grid-cols-2 gap-6">
        
        <div className="bg-white/60 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Department Distribution</h3>
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
            </PieChart>
          </ResponsiveContainer>
        </div>

        
        <div className="bg-white/60 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Task Completion Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[stats]}>
              <XAxis dataKey="completedTasks" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completedTasks" fill="#00C49F" name="Completed Tasks" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
