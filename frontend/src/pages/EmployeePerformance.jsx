// import { useState, useEffect } from "react";
// import API from "../api";

// export default function EmployeePerformance() {
//   const [period, setPeriod] = useState("");
//   const [rating, setRating] = useState(3);
//   const [feedback, setFeedback] = useState("");
//   const [records, setRecords] = useState([]);

//   const submitSelfAssessment = async () => {
//     try {
//       await API.post("/performance/self", {
//         period,
//         selfRating: rating,
//         selfFeedback: feedback,
//       });
//       setPeriod("");
//       setFeedback("");
//       fetchRecords();
//     } catch (err) {
//       alert(err.response?.data?.message || "Error submitting self-assessment");
//     }
//   };

//   const fetchRecords = async () => {
//     const res = await API.get("/performance/my");
//     setRecords(res.data);
//   };

//   useEffect(() => {
//     fetchRecords();
//   }, []);

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-6">Performance Review</h1>

//       <div className="bg-white/70 dark:bg-gray-800/50 p-4 rounded shadow mb-6">
//         <h2 className="text-lg font-semibold mb-2">Submit Self-Assessment</h2>
//         <input
//           type="text"
//           placeholder="e.g. October 2025"
//           value={period}
//           onChange={(e) => setPeriod(e.target.value)}
//           className="border p-2 rounded mb-2 w-full"
//         />
//         <label className="block mb-2">
//           Rating:
//           <input
//             type="number"
//             min="1"
//             max="5"
//             value={rating}
//             onChange={(e) => setRating(Number(e.target.value))}
//             className="border p-2 rounded ml-2 w-16"
//           />
//         </label>
//         <textarea
//           placeholder="Your feedback..."
//           value={feedback}
//           onChange={(e) => setFeedback(e.target.value)}
//           className="border p-2 rounded w-full mb-2"
//         />
//         <button
//           onClick={submitSelfAssessment}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Submit
//         </button>
//       </div>

//       <h2 className="text-lg font-semibold mb-2">My Reviews</h2>
//       {records.map((r) => (
//         <div
//           key={r._id}
//           className="bg-white/70 dark:bg-gray-800/50 p-4 rounded shadow mb-2"
//         >
//           <p>
//             <b>Period:</b> {r.period}
//           </p>
//           <p>
//             <b>Self Rating:</b> {r.selfRating}
//           </p>
//           <p>
//             <b>HR Rating:</b> {r.hrRating || "-"}
//           </p>
//           <p>
//             <b>Overall Score:</b> {r.overallScore?.toFixed(1) || "-"}
//           </p>
//           <p>
//             <b>Status:</b> {r.status}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }

// import { useEffect, useState, useContext } from "react";
// import API from "../api";
// import toast from "react-hot-toast";
// import { AuthContext } from "../context/AuthContext";
// import { motion } from "framer-motion";

// export default function EmployeePerformance() {
//   const { user } = useContext(AuthContext);
//   const [records, setRecords] = useState([]);
//   const [draft, setDraft] = useState({ period: "", goals: [], selfRating: 3, selfFeedback: "" });
//   const [loading, setLoading] = useState(false);

//   const fetch = async () => {
//     try {
//       const { data } = await API.get("/performance/my");
//       setRecords(data);
//     } catch {
//       toast.error("Failed to load performance");
//     }
//   };

//   useEffect(() => { fetch(); }, []);

//   const saveDraft = async () => {
//     try {
//       setLoading(true);
//       // either POST to create or PUT to update draft (your backend saveDraft expects body)
//       await API.post("/performance/draft", draft);
//       toast.success("Draft saved");
//       fetch();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Save failed");
//     } finally { setLoading(false); }
//   };

//   const submit = async (id) => {
//     try {
//       setLoading(true);
//       await API.put(`/performance/${id}/submit`);
//       toast.success("Submitted for review");
//       fetch();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Submit failed");
//     } finally { setLoading(false); }
//   };

//   return (
//     <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Self Assessment</h2>

//       {/* Simple draft editor */}
//       <div className="bg-white p-4 rounded shadow mb-6">
//         <label className="block text-sm">Period</label>
//         <input value={draft.period} onChange={e=>setDraft({...draft, period:e.target.value})} className="input w-full mb-2" placeholder="e.g. 2025-H1"/>
//         <label className="block text-sm">Self Rating (1-5)</label>
//         <input type="number" min="1" max="5" value={draft.selfRating} onChange={e=>setDraft({...draft, selfRating:+e.target.value})} className="input w-20 mb-2"/>
//         <label className="block text-sm">Feedback</label>
//         <textarea value={draft.selfFeedback} onChange={e=>setDraft({...draft, selfFeedback:e.target.value})} className="textarea w-full mb-3"/>
//         <div className="flex gap-2">
//           <button className="btn btn-primary" onClick={saveDraft} disabled={loading}>Save Draft</button>
//         </div>
//       </div>

//       {/* Existing records */}
//       <div className="bg-white p-4 rounded shadow">
//         <h3 className="font-semibold mb-3">My Reviews</h3>
//         <table className="table w-full">
//           <thead>
//             <tr><th>Period</th><th>Self</th><th>Manager</th><th>HR</th><th>Overall</th><th>Status</th><th>Actions</th></tr>
//           </thead>
//           <tbody>
//             {records.map(r=>(
//               <tr key={r._id}>
//                 <td>{r.period}</td>
//                 <td>{r.selfRating}</td>
//                 <td>{r.managerRating || "-"}</td>
//                 <td>{r.hrRating || "-"}</td>
//                 <td>{r.overallScore || "-"}</td>
//                 <td>{r.status}</td>
//                 <td>
//                   {r.status === "Draft" && (
//                     <button onClick={()=>submit(r._id)} className="btn btn-sm btn-success">Submit</button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </motion.div>
//   );
// }


import { useEffect, useState } from "react";
import API from "../api"
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function EmployeePerformance() {
  const [form, setForm] = useState({
    period: "",
    selfRating: "",
    selfFeedback: "",
    goals: [{ title: "", description: "", weight: 10 }],
  });
  const [records, setRecords] = useState([]);

  const fetchMyPerformance = async () => {
    const { data } = await API.get("/performance/my");
    setRecords(data);
    console.log("data",data)
  };

  useEffect(() => {
    fetchMyPerformance();
  }, []);

  const addGoal = () => {
    setForm({
      ...form,
      goals: [...form.goals, { title: "", description: "", weight: 10 }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/performance/self", form);
      toast.success("Self-assessment submitted successfully!");
      fetchMyPerformance();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error submitting");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gray-50 min-h-screen"
    >
      <h1 className="text-3xl font-bold mb-6"> My Performance</h1>

      
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md mb-10"
      >
        <h2 className="text-xl font-semibold mb-4">Submit Self Assessment</h2>
        <input
          type="text"
          name="period"
          placeholder="e.g. Q1 2025"
          value={form.period}
          onChange={(e) => setForm({ ...form, period: e.target.value })}
          className="border p-2 rounded w-full mb-3"
          required
        />

        <textarea
          placeholder="Describe your key achievements..."
          value={form.selfFeedback}
          onChange={(e) => setForm({ ...form, selfFeedback: e.target.value })}
          className="border p-2 rounded w-full mb-3"
          required
        />

        <input
          type="number"
          name="selfRating"
          placeholder="Self Rating (1-5)"
          min="1"
          max="5"
          value={form.selfRating}
          onChange={(e) => setForm({ ...form, selfRating: e.target.value })}
          className="border p-2 rounded w-full mb-3"
          required
        />

        <h3 className="font-semibold mb-2">Goals (OKRs)</h3>
        {form.goals.map((goal, i) => (
          <div key={i} className="flex gap-3 mb-3">
            <input
              placeholder="Goal Title"
              className="border p-2 rounded flex-1"
              value={goal.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  goals: form.goals.map((g, idx) =>
                    idx === i ? { ...g, title: e.target.value } : g
                  ),
                })
              }
            />
            <input
              placeholder="Weight %"
              type="number"
              min="0"
              max="100"
              className="border p-2 rounded w-24"
              value={goal.weight}
              onChange={(e) =>
                setForm({
                  ...form,
                  goals: form.goals.map((g, idx) =>
                    idx === i ? { ...g, weight: e.target.value } : g
                  ),
                })
              }
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addGoal}
          className="text-blue-600 hover:underline mb-4"
        >
          + Add Goal
        </button>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit Assessment
        </button>
      </form>

      
      <h2 className="text-xl font-semibold mb-3"> My Past Reviews</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Period</th>
              <th className="p-2 text-left">Self Rating</th>
              <th className="p-2 text-left">HR Rating</th>
              <th className="p-2 text-left">Final Score</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id} className="border-b">
                <td className="p-2">{r.period}</td>
                <td className="p-2">{r.selfRating || "-"}</td>
                <td className="p-2">{r.hrRating || "-"}</td>
                <td className="p-2">{r.calibratedScore || "-"}</td>
                <td className="p-2">
                  <span
                    className={`badge ${
                      r.status === "Finalized"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
