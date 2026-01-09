import { useEffect, useState } from "react";
import API from "../api";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";
import { Award, TrendingUp, GraduationCap, DollarSign, Users, BarChart2 } from "lucide-react";
import toast from "react-hot-toast";

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await API.get("/performance/admin/analytics");
        setStats(data);
      } catch (err) {
        toast.error("Failed to load analytics");
      }
    };
    fetchAnalytics();
  }, []);

  if (!stats)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading analytics...
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gray-100 min-h-screen"
    >
      <h1 className="text-3xl font-bold mb-8 text-gray-800">🏢 Company Performance Analytics</h1>

     
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow flex flex-col items-center">
          <Award className="text-green-500 mb-2" size={26} />
          <p className="text-gray-500 text-sm">Finalized Reviews</p>
          <p className="text-2xl font-semibold">{stats.finalized}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow flex flex-col items-center">
          <TrendingUp className="text-indigo-500 mb-2" size={26} />
          <p className="text-gray-500 text-sm">Avg Score</p>
          <p className="text-2xl font-semibold">{stats.avgScore}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow flex flex-col items-center">
          <DollarSign className="text-emerald-500 mb-2" size={26} />
          <p className="text-gray-500 text-sm">Total Bonus</p>
          <p className="text-2xl font-semibold">${stats.totalBonus.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow flex flex-col items-center">
          <Users className="text-blue-500 mb-2" size={26} />
          <p className="text-gray-500 text-sm">Total Reviews</p>
          <p className="text-2xl font-semibold">{stats.totalReviews}</p>
        </div>
      </div>

      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Department Average Score</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.departmentScores}>
              <XAxis dataKey="department" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="avgScore" fill="#3b82f6" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Learning & Promotion Ratio</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "L&D Recommended", value: stats.lndCount },
                  { name: "Promotions", value: stats.promotionCount },
                  { name: "Others", value: stats.totalReviews - stats.lndCount - stats.promotionCount },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
                dataKey="value"
              >
                {COLORS.map((color, i) => (
                  <Cell key={i} fill={color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

     
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <BarChart2 className="text-yellow-500" /> Salary & Bonus Impact
        </h3>
        <p className="text-gray-600">
          Total salary impact (including performance bonuses):{" "}
          <span className="font-semibold text-green-600">
            ${stats.totalSalaryImpact.toLocaleString()}
          </span>
        </p>
      </div>
    </motion.div>
  );
}
