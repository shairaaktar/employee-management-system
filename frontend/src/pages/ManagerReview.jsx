

import { useEffect, useState, useMemo } from "react";
import API from "../api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Filter, Star, Users, ClipboardList } from "lucide-react";

export default function ManagerReview() {
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(null);
  const [department,setDepartment]=useState([])
  const [form, setForm] = useState({
    managerRating: "",
    managerFeedback: "",
    promotionRecommended: false,
    lndRecommended: false,
  });

  const [filters, setFilters] = useState({
    department: "",
    status: "",
    period: "",
  });

  // const fetchRecords = async () => {
  //   try {
  //     const query = new URLSearchParams(filters).toString();
  //     const { data } = await API.get(`/performance/all?${query}`);
  //     setRecords(data);
  //     console.log("data",data)
  //   } catch {
  //     toast.error("Failed to load reviews");
  //   }
  // };
 const fetchDepartments= async()=>{
  try{
    const {data}=await API.get(`/admin/departments`)
    console.log("department",data)
    setDepartment(data)

  }catch(err){
    toast.error("Failed to load reviews");
  }
 }
 useEffect(()=>{
  fetchDepartments();
 },[])

  const fetchRecords = async () => {
  try {
    const query = new URLSearchParams(filters).toString();
    const { data } = await API.get(`/manager/team-performance?${query}`);
    console.log("records",data)
    setRecords(data || []); 
    
  } catch (err) {
    toast.error("Failed to load reviews");
  }
};



  useEffect(() => {
    fetchRecords();
  }, [filters]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/performance/manager/${selected._id}`, form);
      toast.success("Manager review saved");
      setSelected(null);
      fetchRecords();
    } catch {
      toast.error("Error submitting review");
    }
  };

  
  const summary = useMemo(() => {
    if (records.length === 0) return { avgScore: 0, reviewed: 0, pending: 0 };
    const reviewed = records.filter((r) => r.status !== "Submitted").length;
    const pending = records.length - reviewed;
    const avgScore =
      records.reduce((sum, r) => sum + (r.managerRating || 0), 0) /
      records.length;
    return { avgScore: avgScore.toFixed(1), reviewed, pending };
  }, [records]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gray-50 min-h-screen"
    >
      <h1 className="text-3xl font-bold mb-6">👩‍💼 Manager Performance Reviews</h1>

    
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <Star className="text-yellow-500 w-8 h-8" />
          <div>
            <p className="text-gray-500 text-sm">Average Rating</p>
            <h3 className="text-2xl font-semibold">{summary.avgScore}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <Users className="text-blue-500 w-8 h-8" />
          <div>
            <p className="text-gray-500 text-sm">Reviewed Employees</p>
            <h3 className="text-2xl font-semibold">{summary.reviewed}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <ClipboardList className="text-red-500 w-8 h-8" />
          <div>
            <p className="text-gray-500 text-sm">Pending Reviews</p>
            <h3 className="text-2xl font-semibold">{summary.pending}</h3>
          </div>
        </div>
      </div>

      
      <div className="flex flex-wrap gap-3 items-center bg-white p-4 rounded shadow mb-6">
        <Filter className="text-gray-600" />
        <select
          value={filters.department}
          onChange={(e) =>
            setFilters({ ...filters, department: e.target.value })
          }
          className="border rounded px-3 py-2"
        >
          <option value="">   All Department</option>
          {department.map((d)=>(
            <option key={d._id} >
              {d.name}

            </option>
          ))}
         
         
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border rounded px-3 py-2"
        >
          <option value="">All Status</option>
          <option>Submitted</option>
          <option>Manager Reviewed</option>
          <option>HR Reviewed</option>
          <option>Finalized</option>
        </select>
        <input
          type="text"
          placeholder="Period (e.g. Q1 2025)"
          className="border rounded px-3 py-2"
          value={filters.period}
          onChange={(e) => setFilters({ ...filters, period: e.target.value })}
        />
      </div>
      <button
    onClick={() =>
      setFilters({ department: "", status: "", period: "" })
    }
    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 mb-6 rounded text-sm font-medium"
  >
    Reset Filters
  </button>

      
      {!selected ? (
        <table className="min-w-full bg-white rounded-xl shadow overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Employee</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Period</th>
              <th className="p-3 text-left">Self Rating</th>
              <th className="p-3 text-left">Manager Rating</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{r.employee?.name}</td>
                <td className="p-3">{r.employee?.department}</td>
                <td className="p-3">{r.period}</td>
                <td className="p-3">{r.selfRating || "—"}</td>
                <td className="p-3">{r.managerRating || "—"}</td>
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
                  <button
                    onClick={() => setSelected(r)}
                    className="text-blue-600 hover:underline"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow">
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
