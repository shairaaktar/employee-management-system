import { useEffect, useState } from "react";
import API from "../api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Crown,
  CheckCircle2,
  TrendingUp,
  GraduationCap,
  Loader2,
  BarChart3,
} from "lucide-react";

export default function AdminFinalization() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    finalized: 0,
    pending: 0,
    promotions: 0,
    learning: 0,
  });

 
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/performance/all?status=HR Reviewed");
      const all = data.records || [];

      const finalized = all.filter((r) => r.status === "Finalized").length;
      const pending = all.filter((r) => r.status === "HR Reviewed").length;
      const promotions = all.filter((r) => r.promotionRecommended).length;
      const learning = all.filter((r) => r.lndRecommended).length;

      setStats({ finalized, pending, promotions, learning });
      setRecords(all);
    } catch (err) {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  
  const finalizeRecord = async (id) => {
    try {
      await API.put(`/performance/admin/finalize/${id}`);
      toast.success("Performance finalized successfully");
      fetchData();
    } catch (err) {
      toast.error("Finalization failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gray-100 min-h-screen"
    >
     
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Crown className="text-yellow-600" /> Admin Finalization Dashboard
        </h1>
      </div>

      
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-3">
          <CheckCircle2 className="text-green-600 w-7 h-7" />
          <div>
            <p className="text-gray-500 text-sm">Finalized</p>
            <h3 className="text-2xl font-semibold">{stats.finalized}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-3">
          <BarChart3 className="text-yellow-600 w-7 h-7" />
          <div>
            <p className="text-gray-500 text-sm">Pending Reviews</p>
            <h3 className="text-2xl font-semibold">{stats.pending}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-3">
          <TrendingUp className="text-indigo-500 w-7 h-7" />
          <div>
            <p className="text-gray-500 text-sm">Promotions</p>
            <h3 className="text-2xl font-semibold">{stats.promotions}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-3">
          <GraduationCap className="text-blue-500 w-7 h-7" />
          <div>
            <p className="text-gray-500 text-sm">L&D Recommended</p>
            <h3 className="text-2xl font-semibold">{stats.learning}</h3>
          </div>
        </div>
      </div>

      
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Employee</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Period</th>
              <th className="p-3 text-left">Self</th>
              <th className="p-3 text-left">Manager</th>
              <th className="p-3 text-left">HR</th>
              <th className="p-3 text-left">Calibrated</th>
              <th className="p-3 text-left">Promotion</th>
              <th className="p-3 text-left">L&D</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center p-6">
                  <Loader2 className="animate-spin text-gray-400 mx-auto" />
                </td>
              </tr>
            ) : records.length > 0 ? (
              records.map((r) => (
                <tr
                  key={r._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">{r.employee?.name}</td>
                  <td className="p-3">{r.employee?.department || "—"}</td>
                  <td className="p-3">{r.period}</td>
                  <td className="p-3">{r.selfRating || "—"}</td>
                  <td className="p-3">{r.managerRating || "—"}</td>
                  <td className="p-3">{r.hrRating || "—"}</td>
                  <td className="p-3 font-semibold text-green-600">
                    {r.calibratedScore || "—"}
                  </td>
                  <td className="p-3 text-center">
                    {r.promotionRecommended ? "🏆" : "—"}
                  </td>
                  <td className="p-3 text-center">
                    {r.lndRecommended ? "📘" : "—"}
                  </td>
                  <td className="p-3 text-center">
                    {r.status !== "Finalized" ? (
                      <button
                        onClick={() => finalizeRecord(r._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Finalize
                      </button>
                    ) : (
                      <span className="text-gray-400"> Finalized</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="text-center text-gray-500 italic p-6"
                >
                  No HR-reviewed records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
