import { useEffect, useState } from "react";
import API from "../api";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Users,
  ClipboardList,
  Star,
  TrendingUp,
  GraduationCap,
  Trophy,
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function ManagerTeamAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await API.get("/manager/analytics");
        setData(data);
      } catch {
        toast.error("Failed to load analytics");
      }
    };
    fetchAnalytics();
  }, []);

  if (!data) return <p className="p-6 text-gray-500">Loading analytics...</p>;

  const { kpis, leaderboard } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gray-50 min-h-screen"
    >
      <h1 className="text-3xl font-bold mb-8"> Team Performance & Analytics</h1>

      
      <div className="grid md:grid-cols-4 gap-4 mb-10">
        <KpiCard icon={<Users />} color="text-blue-600" label="Team Size" value={kpis.teamSize} />
        <KpiCard icon={<ClipboardList />} color="text-yellow-600" label="Total Tasks" value={kpis.totalTasks} />
        <KpiCard icon={<Star />} color="text-green-600" label="Avg Manager Rating" value={kpis.avgManagerRating} />
        <KpiCard icon={<Trophy />} color="text-indigo-600" label="Avg HR Rating" value={kpis.avgHRRating} />
      </div>


      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700"> Task Progress Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[
            { name: "Completed", value: kpis.completedTasks },
            { name: "In Progress", value: kpis.inProgressTasks },
            { name: "To-Do", value: kpis.todoTasks },
          ]}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#4f46e5" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

     
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <KpiCard icon={<TrendingUp />} color="text-indigo-500" label="Promotions" value={kpis.promotionCount} />
        <KpiCard icon={<GraduationCap />} color="text-blue-500" label="L&D Nominations" value={kpis.lndCount} />
      </div>

   
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700"> Top 5 Performers</h2>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Employee</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Manager Rating</th>
              <th className="p-3 text-left">HR Final Rating</th>
              <th className="p-3 text-left">Promotion</th>
              <th className="p-3 text-left">L&D</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((emp, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{emp.employee}</td>
                <td className="p-3">{emp.department}</td>
                <td className="p-3">{emp.managerRating || "—"}</td>
                <td className="p-3">{emp.hrRating || "—"}</td>
                <td className="p-3 text-center">{emp.promotion ? "🏆" : "—"}</td>
                <td className="p-3 text-center">{emp.lnd ? "🎓" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function KpiCard({ icon, label, value, color }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
      <div className={`${color}`}>{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <h3 className="text-2xl font-semibold text-gray-800">{value}</h3>
      </div>
    </div>
  );
}
