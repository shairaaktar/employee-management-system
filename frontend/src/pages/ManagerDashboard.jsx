import { useEffect, useState } from "react";
import API from "../api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Users, Star, ClipboardCheck, TrendingUp } from "lucide-react";

export default function ManagerDashboard() {
  const [team, setTeam] = useState([]);
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    managerRating: "",
    managerFeedback: "",
    promotionRecommended: false,
    lndRecommended: false,
  });

  const fetchTeamData = async () => {
    try {
      const [teamRes, perfRes] = await Promise.all([
        API.get("/manager/my-team"),
        API.get("/manager/team-performance"),
      ]);
      setTeam(teamRes.data);
      setRecords(perfRes.data);
    } catch {
      toast.error("Failed to fetch manager data");
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/manager/review/${selected._id}`, form);
      toast.success("Review submitted successfully");
      setSelected(null);
      setForm({
        managerRating: "",
        managerFeedback: "",
        promotionRecommended: false,
        lndRecommended: false,
      });
      fetchTeamData();
    } catch {
      toast.error("Failed to submit review");
    }
  };

  const stats = {
    avgScore:
      records.length > 0
        ? (
            records.reduce((sum, r) => sum + (r.managerRating || 0), 0) /
            records.length
          ).toFixed(1)
        : 0,
    reviewed: records.filter((r) => r.status === "Manager Reviewed").length,
    pending: records.filter((r) => r.status === "Submitted").length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 bg-gray-100 min-h-screen"
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        👨‍💼 Manager Dashboard
      </h1>

      
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <Users className="text-blue-500 w-8 h-8" />
          <div>
            <p className="text-gray-500 text-sm">Team Members</p>
            <h3 className="text-2xl font-semibold">{team.length}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <Star className="text-yellow-500 w-8 h-8" />
          <div>
            <p className="text-gray-500 text-sm">Avg Team Rating</p>
            <h3 className="text-2xl font-semibold">{stats.avgScore}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <ClipboardCheck className="text-green-600 w-8 h-8" />
          <div>
            <p className="text-gray-500 text-sm">Pending Reviews</p>
            <h3 className="text-2xl font-semibold">{stats.pending}</h3>
          </div>
        </div>
      </div>

    
      {!selected ? (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-left">Period</th>
                <th className="p-3 text-left">Self Rating</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{r.employee?.name}</td>
                  <td className="p-3">{r.employee?.department}</td>
                  <td className="p-3">{r.period}</td>
                  <td className="p-3">{r.selfRating || "—"}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        r.status === "Submitted"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {r.status === "Submitted" && (
                      <button
                        onClick={() => setSelected(r)}
                        className="text-blue-600 hover:underline"
                      >
                        Review
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <form
          onSubmit={handleReviewSubmit}
          className="bg-white p-6 rounded-xl shadow max-w-lg mx-auto"
        >
          <h2 className="text-xl font-semibold mb-4">
            Review: {selected.employee?.name}
          </h2>
          <textarea
            placeholder="Manager Feedback"
            className="border p-2 rounded w-full mb-3"
            value={form.managerFeedback}
            onChange={(e) =>
              setForm({ ...form, managerFeedback: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Rating (1-5)"
            min="1"
            max="5"
            className="border p-2 rounded w-full mb-3"
            value={form.managerRating}
            onChange={(e) =>
              setForm({ ...form, managerRating: e.target.value })
            }
          />
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={form.promotionRecommended}
              onChange={(e) =>
                setForm({ ...form, promotionRecommended: e.target.checked })
              }
            />
            Recommend Promotion
          </label>
          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={form.lndRecommended}
              onChange={(e) =>
                setForm({ ...form, lndRecommended: e.target.checked })
              }
            />
            Recommend L&D
          </label>
          <div className="flex gap-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded">
              Submit Review
            </button>
            <button
              type="button"
              className="text-gray-600 underline"
              onClick={() => setSelected(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
}
