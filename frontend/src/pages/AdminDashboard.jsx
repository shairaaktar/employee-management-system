import { useEffect, useState } from "react";
import API from "../api";
import { motion } from "framer-motion";
import HRStatsChart from "../components/HRStatsChart";
import {saveAs} from "file-saver"

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState("");

  const fetchData = async () => {
    const [s, u, d] = await Promise.all([
      API.get("/admin/stats"),
      API.get("/admin/users"),
      API.get("/admin/departments"),
    ]);
    setStats(s.data);
    setUsers(u.data);
    setDepartments(d.data);
  };

  const addDepartment = async () => {
    if (!newDept.trim()) return;
    await API.post("/admin/departments", { name: newDept });
    setNewDept("");
    fetchData();
  };

  const deleteDept = async (id) => {
    await API.delete(`/admin/departments/${id}`);
    fetchData();
  };

  const changeRole = async (id, role) => {
    await API.put(`/admin/users/${id}/role`, { role });
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <motion.div
    initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Control Panel</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Stat title="Total Users" value={stats.totalUsers} />
        <Stat title="HR Members" value={stats.totalHR} />
        <Stat title="Employees" value={stats.totalEmployees} />
        <Stat title="Total Payroll" value={`$${stats.totalPayroll}`} />
        <Stat title="Avg. Performance" value={stats.avgPerformance} />
      </div>

      <h2 className="text-xl font-semibold mb-2">Departments</h2>
      <div className="flex gap-2 mb-4">
        <input
          value={newDept}
          onChange={(e) => setNewDept(e.target.value)}
          placeholder="New Department"
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={addDepartment}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>
      <ul className="mb-8">
        {departments.map((d) => (
          <li
            key={d._id}
            className="bg-white/70 dark:bg-gray-800/50 p-3 rounded shadow flex justify-between mb-2"
          >
            {d.name}
            <button
              onClick={() => deleteDept(d._id)}
              className="bg-red-500 text-white text-sm px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">User Management</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u._id, e.target.value)}
                    className="border px-2 py-1 rounded"
                  >
                    <option>Employee</option>
                    <option>HR</option>
                    <option>Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
      <HRStatsChart data={stats.attendanceCount||[]}/>
    </div>
    </motion.div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-white/70 dark:bg-gray-800/50 p-4 rounded shadow text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-xl font-bold">{value ?? "—"}</p>
    </div>
  );
}
