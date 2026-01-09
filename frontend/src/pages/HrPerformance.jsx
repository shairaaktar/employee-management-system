

import { useEffect, useState } from "react";
import API from "../api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  CheckCircle,
  TrendingUp,
  Award,
  GraduationCap,
  Loader2,
} from "lucide-react";
import { Dialog } from "@headlessui/react"; 
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const HrPerformance = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [hrForm, setHrForm] = useState({ hrRating: "", hrFeedback: "" });
  const [stats, setStats] = useState({
    topPerformers: 0,
    promotions: 0,
    learning: 0,
    averageScore: 0,
  });

  // Fetch performance data
  // const fetchReviews = async () => {
  //   try {
  //     setLoading(true);
  //     const { data } = await API.get("/performance/all");
  //     setReviews(data.records || []);
  //     calculateStats(data.records || []);
  //   } catch (err) {
  //     toast.error("Failed to load performance data");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchReviews = async () => {
  try {
    setLoading(true);
    const { data } = await API.get("/performance/manager-reviewed");
    setReviews(data);
    calculateStats(data);
  } catch {
    toast.error("Failed to load performance data");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchReviews();
  }, []);

  
  const calculateStats = (records) => {
    if (!records.length) return;
    const total = records.length;
    const topPerformers = records.filter((r) => (r.overallScore || 0) >= 4).length;
    const promotions = records.filter((r) => r.promotionRecommended).length;
    const learning = records.filter((r) => r.lndRecommended).length;
    const avgScore = (
      records.reduce((sum, r) => sum + (r.overallScore || 0), 0) / total
    ).toFixed(2);

    setStats({ topPerformers, promotions, learning, averageScore: avgScore });
  };

  
  const finalizeReview = async (id) => {
    try {
      if (!hrForm.hrRating) return toast.error("Please add a rating before finalizing");
      await API.put(`/performance/hr/${id}`, hrForm);
      toast.success("Performance finalized");
      setSelectedReview(null);
      setHrForm({ hrRating: "", hrFeedback: "" });
      fetchReviews();
    } catch (err) {
      toast.error("Failed to finalize review");
    }
  };

 
  const chartData = reviews.map((r) => ({
    name: r.employee?.name || "N/A",
    score: r.overallScore || 0,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gray-100 min-h-screen"
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        HR Performance Review Dashboard
      </h1>

     
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Top Performers", value: stats.topPerformers, icon: <Award className="text-green-500" /> },
          { label: "Promotions", value: stats.promotions, icon: <TrendingUp className="text-indigo-500" /> },
          { label: "L&D Recommended", value: stats.learning, icon: <GraduationCap className="text-blue-500" /> },
          { label: "Avg Score", value: stats.averageScore, icon: <CheckCircle className="text-yellow-500" /> },
        ].map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-xl shadow-md flex flex-col items-center">
            <div className="mb-2">{card.icon}</div>
            <p className="text-gray-500 text-sm">{card.label}</p>
            <p className="text-2xl font-semibold text-gray-800">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Employee Performance Scores
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Bar dataKey="score" fill="#16a34a" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Employee</th>
              <th className="p-3 text-left">Period</th>
              <th className="p-3 text-left">Self</th>
              <th className="p-3 text-left">Manager</th>
              <th className="p-3 text-left">HR</th>
              <th className="p-3 text-left">Final Score</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">L&D</th>
              <th className="p-3 text-left">Promotion</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="p-6 text-center">
                  <Loader2 className="animate-spin mx-auto text-gray-400" />
                </td>
              </tr>
            ) : reviews.length > 0 ? (
              reviews.map((r) => (
                <tr key={r._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">{r.employee?.name}</td>
                  <td className="p-3">{r.period}</td>
                  <td className="p-3">{r.selfRating || "—"}</td>
                  <td className="p-3">{r.managerRating || "—"}</td>
                  <td className="p-3">{r.hrRating || "—"}</td>
                  <td className="p-3 font-semibold text-green-600">
                    {r.overallScore || "N/A"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        r.status === "Finalized"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">{r.lndRecommended ? "✅" : "—"}</td>
                  <td className="p-3 text-center">{r.promotionRecommended ? "🏆" : "—"}</td>
                  <td className="p-3 text-center">
                    {r.status !== "Finalized" && (
                      <button
                        onClick={() => setSelectedReview(r)}
                        className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                      >
                        Finalize
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="p-6 text-center text-gray-500 italic">
                  No performance reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      
      {selectedReview && (
        <Dialog
          open={true}
          onClose={() => setSelectedReview(null)}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="bg-black/50 fixed inset-0" />
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] md:w-[400px] relative">
            <h3 className="text-lg font-semibold mb-3">
              Finalize Review – {selectedReview.employee?.name}
            </h3>
            <input
              type="number"
              min="1"
              max="5"
              placeholder="HR Rating (1–5)"
              className="border p-2 w-full rounded mb-3"
              value={hrForm.hrRating}
              onChange={(e) => setHrForm({ ...hrForm, hrRating: e.target.value })}
            />
            <textarea
              placeholder="HR Feedback"
              className="border p-2 w-full rounded mb-3"
              value={hrForm.hrFeedback}
              onChange={(e) => setHrForm({ ...hrForm, hrFeedback: e.target.value })}
            />
            <div className="flex gap-2 justify-end">
              <button
                className="text-gray-600 px-3 py-1 hover:underline"
                onClick={() => setSelectedReview(null)}
              >
                Cancel
              </button>
              <button
                className="bg-indigo-600 text-white px-3 py-1 rounded"
                onClick={() => finalizeReview(selectedReview._id)}
              >
                Finalize
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </motion.div>
  );
};

export default HrPerformance;
