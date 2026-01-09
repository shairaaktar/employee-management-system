// import { useEffect, useState } from "react";
// import API from "../api";
// import toast from "react-hot-toast";
// import { Send, Megaphone, MessageCircle, Star } from "lucide-react";

// export default function ManagerCommunication() {
//   const [tab, setTab] = useState("announcement");
//   const [messages, setMessages] = useState([]);
//   const [form, setForm] = useState({
//      title: "",
//       message: "", 
//       recipient: "", 
//       visibility: "team" 
//     });
//   const [employees, setEmployees] = useState([]);

//   useEffect(() => {
//     fetchMessages();
//     fetchEmployees();
//   }, []);
  
  

//   const fetchEmployees = async () => {
//     try {
//       const { data } = await API.get("/manager/my-team");
//       setEmployees(data);
//     } catch {
//       toast.error("Failed to load employees");
//     }
//   };
//   const fetchMessages = async () => {
//     try {
//       const { data } = await API.get("/communications/manager");
//       setMessages(data);
//     } catch {
//       toast.error("Failed to load communications");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await API.post("/communications", { type: tab, ...form });
//       toast.success(`${tab} sent`);
//       setForm({ title: "", message: "", recipient: "", visibility: "team" });
//       fetchMessages();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error sending message");
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6">📣 Communication & Feedback</h1>

//       {/* Tabs */}
//       <div className="flex gap-4 mb-6">
//         {["announcement", "feedback", "kudos"].map((t) => (
//           <button
//             key={t}
//             onClick={() => setTab(t)}
//             className={`px-4 py-2 rounded-lg text-sm font-medium ${
//               tab === t ? "bg-blue-600 text-white" : "bg-white text-gray-600 border"
//             }`}
//           >
//             {t === "announcement" && <Megaphone className="inline w-4 h-4 mr-1" />}
//             {t === "feedback" && <MessageCircle className="inline w-4 h-4 mr-1" />}
//             {t === "kudos" && <Star className="inline w-4 h-4 mr-1 text-yellow-500" />}
//             {t.charAt(0).toUpperCase() + t.slice(1)}
//           </button>
//         ))}
//       </div>

//       {/* Send Form */}
//       <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow mb-8">
//         {tab !== "kudos" && (
//           <input
//             type="text"
//             placeholder="Title"
//             className="border p-2 rounded w-full mb-3"
//             value={form.title}
//             onChange={(e) => setForm({ ...form, title: e.target.value })}
//           />
//         )}
//         <textarea
//           placeholder={`Write your ${tab} message...`}
//           className="border p-2 rounded w-full mb-3"
//           value={form.message}
//           onChange={(e) => setForm({ ...form, message: e.target.value })}
//         />
//         <select
//           className="border p-2 rounded w-full mb-3"
//           value={form.visibility}
//           onChange={(e) => setForm({ ...form, visibility: e.target.value })}
//         >
//           <option value="team">My Team</option>
//           <option value="all">All Employees</option>
//           <option value="individual">Individual</option>
//         </select>

//         {
//             form.visibility==="individual" &&(
//                 <select
//                  value={form.recipient}
//             onChange={(e) => setForm({ ...form, recipient: e.target.value })}
//             className="border rounded p-2 w-full mb-3"
//                 >
//                     <option value="">Select Employee</option>
//             {employees.map((emp) => (
//               <option key={emp._id} value={emp._id}>
//                 {emp.name} — {emp.department}
//               </option>
//             ))}

//                 </select>
//             )
//         }
//         <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
//           <Send size={16} /> Send
//         </button>
//       </form>

//       {/* Sent Messages */}
//       <div className="bg-white p-4 rounded-xl shadow">
//         <h2 className="text-xl font-semibold mb-4">🧾 Sent Messages</h2>
//         {messages.length === 0 ? (
//           <p className="text-gray-500">No messages yet.</p>
//         ) : (
//           <ul className="divide-y">
//             {messages.map((msg) => (
//               <li key={msg._id} className="py-3">
//                 <p className="font-medium">{msg.title || msg.type}</p>
//                 <p className="text-gray-600 text-sm">{msg.message}</p>
//                 <p className="text-xs text-gray-400 mt-1">
//                   {msg.recipient ? `To: ${msg.recipient.name}` : "To: Team"}
//                 </p>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }


import { useEffect, useState, useContext } from "react";
import API from "../api";
import toast from "react-hot-toast";
import { Send, Megaphone, MessageCircle, Star } from "lucide-react";
import { AuthContext } from "../context/AuthContext"; 
export default function ManagerCommunication() {
  const { user } = useContext(AuthContext); 
  const [tab, setTab] = useState("announcement");
  const [messages, setMessages] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    title: "",
    message: "",
    recipient: "",
    visibility: "team",
  });

  useEffect(() => {
    fetchMessages();
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data } = await API.get("/manager/my-team");
      setEmployees(data);
    } catch {
      toast.error("Failed to load employees");
    }
  };

  const fetchMessages = async () => {
    try {
      const { data } = await API.get("/communications/manager");
      setMessages(data);
    } catch {
      toast.error("Failed to load communications");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.message.trim()) return toast.error("Message cannot be empty");

      await API.post("/communications", { type: tab, ...form });
      toast.success(`${tab.charAt(0).toUpperCase() + tab.slice(1)} sent successfully`);
      setForm({ title: "", message: "", recipient: "", visibility: "team" });
      fetchMessages();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending message");
    }
  };

  
  const getVisibilityOptions = () => {
    const options = [{ value: "team", label: "My Team" }];
    if (user?.role === "hr" || user?.role === "admin") {
      options.push({ value: "all", label: "All Employees" });
    }
    options.push({ value: "individual", label: "Individual" });
    return options;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📣 Communication & Feedback</h1>

     
      <div className="flex gap-4 mb-6">
        {["announcement", "feedback", "kudos"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
              tab === t ? "bg-blue-600 text-white" : "bg-white text-gray-600 border"
            }`}
          >
            {t === "announcement" && <Megaphone className="w-4 h-4" />}
            {t === "feedback" && <MessageCircle className="w-4 h-4" />}
            {t === "kudos" && <Star className="w-4 h-4 text-yellow-500" />}
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-xl shadow mb-8 space-y-3"
      >
        {tab !== "kudos" && (
          <input
            type="text"
            placeholder="Title"
            className="border p-2 rounded w-full"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        )}

        <textarea
          placeholder={`Write your ${tab} message...`}
          className="border p-2 rounded w-full"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />

        <select
          className="border p-2 rounded w-full"
          value={form.visibility}
          onChange={(e) => setForm({ ...form, visibility: e.target.value })}
        >
          {getVisibilityOptions().map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {form.visibility === "individual" && (
          <select
            value={form.recipient}
            onChange={(e) => setForm({ ...form, recipient: e.target.value })}
            className="border rounded p-2 w-full"
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name} — {emp.department}
              </option>
            ))}
          </select>
        )}

        <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <Send size={16} /> Send
        </button>
      </form>

     
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">🧾 Sent Messages</h2>
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {messages.map((msg) => (
              <li key={msg._id} className="py-3">
                <p className="font-medium text-gray-800">
                  {msg.title || msg.type.toUpperCase()}
                </p>
                <p className="text-gray-600 text-sm">{msg.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {msg.visibility === "individual"
                    ? `To: ${msg.recipient?.name || "Employee"}`
                    : msg.visibility === "team"
                    ? "To: My Team"
                    : "To: All Employees"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
