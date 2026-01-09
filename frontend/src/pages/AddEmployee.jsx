


import { useState } from "react";
import API from "../api";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function AddEmployee() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    role: "",
    salary: "",
    manager:"",
  });
  const [msg, setMsg] = useState("");
  const [managers, setManagers] = useState([]);

  useEffect(() => {
  // API.get("/employees/managers")
  //   .then((res) => setManagers(res.data))
   
  //   .catch(() => toast.error("Failed to load managers"));
  fetchManagers()

     
}, []);

  const fetchManagers = async () => {
    try{
      const { data } = await API.get("/employees/managers")
       setManagers(data);
       console.log(data)

    }catch(err){
      toast.error("Failed to load managers")
    }
       
     };
 

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/employees", form);
      setMsg(res.data.message);
      setForm({ name: "", email: "", department: "", role: "", salary: "" ,manager:""});
    } catch (err) {
      setMsg(err.response?.data?.message || "Error adding employee");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-3">Add New Employee</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="border p-2 rounded" required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 rounded" required />
        <input name="department" placeholder="Department" value={form.department} onChange={handleChange} className="border p-2 rounded" required />
        <input name="role" placeholder="Role (e.g., Developer)" value={form.role} onChange={handleChange} className="border p-2 rounded" required />
        <input name="salary" type="number" placeholder="Salary" value={form.salary} onChange={handleChange} className="border p-2 rounded" required />
        <select
  value={form.manager || ""}
  onChange={(e) => setForm({ ...form, manager: e.target.value })}
  className="border p-2 rounded w-full"
>
  <option value="">Select Manager</option>
  {managers.map((m) => (
    <option key={m._id} value={m._id}>
      {m.name} ({m.userAccount.email})
    </option>
  ))}
</select>

 

        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">

          Add Employee
        </button>
      </form>
      {msg && <p className="mt-3 text-sm text-gray-700">{msg}</p>}
    </div>
  );
}
