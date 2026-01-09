import { useEffect, useState } from "react";
import API from "../api";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function ManagerLeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const { data } = await API.get("/leaves/manager/team");
      setLeaves(data);
    } catch {
      toast.error("Failed to load leave requests");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/leaves/manager/${id}`, { status, managerFeedback: feedback });
      toast.success(`Leave ${status.toLowerCase()}`);
      setFeedback("");
      setSelected(null);
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating leave");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6"> Leave Requests</h1>

      {selected ? (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">
            Review Leave — {selected.employee?.name}
          </h2>
          <p className="text-gray-600 mb-3">
            <b>Period:</b> {new Date(selected.startDate).toLocaleDateString()} →{" "}
            {new Date(selected.endDate).toLocaleDateString()}
          </p>
          <p className="text-gray-600 mb-3">
            <b>Type:</b> {selected.type}
          </p>
          <p className="text-gray-600 mb-3">
            <b>Reason:</b> {selected.reason}
          </p>
          <textarea
            placeholder="Add feedback (optional)"
            className="border p-2 rounded w-full mb-3"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <div className="flex gap-3">
            <button
              onClick={() => updateStatus(selected._id, "Approved")}
              className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <CheckCircle size={18} /> Approve
            </button>
            <button
              onClick={() => updateStatus(selected._id, "Rejected")}
              className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <XCircle size={18} /> Reject
            </button>
            <button
              className="text-gray-600 underline"
              onClick={() => setSelected(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Pending Requests</h2>
          <table className="min-w-full border">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="p-2 text-left">Employee</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Period</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l) => (
                <tr key={l._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{l.employee?.name}</td>
                  <td className="p-2">{l.type}</td>
                  <td className="p-2">
                    {new Date(l.startDate).toLocaleDateString()} -{" "}
                    {new Date(l.endDate).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        l.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : l.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td className="p-2">
                    {l.status === "Pending" ? (
                      <button
                        onClick={() => setSelected(l)}
                        className="text-blue-600 hover:underline"
                      >
                        Review
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">Reviewed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {leaves.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No leave requests yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
