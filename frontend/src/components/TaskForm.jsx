

import { useState, useEffect, useContext } from "react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";

const TaskForm = ({ refresh }) => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    assignedTo: "",
    assignedToAll: false,
  });
  const [employees, setEmployees] = useState([]);
  const [myteam, setMyteam] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      if (user?.role === "hr" || user?.role === "admin") {
        try {
          const { data } = await API.get("/employees/forHr");
          console.log("data",data)
          setEmployees(data);
        } catch (err) {
          console.error("Error fetching employees:", err);
        }
      }
    };
    fetchEmployees();

    const fetchMyTeam = async () => {
 if ( user?.role==="manager") {
        try {
          const { data } = await API.get("/manager/my-team");
          console.log("data",data)
          setEmployees(data);
        } catch (err) {
          console.error("Error fetching employees:", err);
        }
      }
};
fetchMyTeam()
  }, [user?.role]);




  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "assignedToAll" && checked ? { assignedTo: "" } : {}), // Clear assignedTo if assigning to all
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.assignedTo && !form.assignedToAll) {
      setMsg("Please assign to at least one employee.");
      return;
    }

    setLoading(true);
    try {
      await API.post("/tasks", form);
      setMsg(" Task created successfully!");
      setForm({
        title: "",
        description: "",
        deadline: "",
        assignedTo: "",
        assignedToAll: false,
      });
      refresh();
    } catch (err) {
      setMsg(err.response?.data?.message || " Failed to create task");
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-base-100 shadow-md p-6 rounded-xl mb-6 border border-gray-200 dark:border-gray-700 transition hover:shadow-lg"
    >
      <h2 className="text-lg font-semibold mb-4">Assign New Task</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            placeholder="Task Title"
            value={form.title}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Deadline</label>
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            placeholder="Task details..."
            value={form.description}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
            rows="3"
            required
          />
        </div>

        {(user?.role === "hr" || user?.role === "admin"|| user?.role=="manager") && (
          <div className="md:col-span-2 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Assign To</label>
              <select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                disabled={form.assignedToAll}
                className="select select-bordered w-full"
              >
                <option value="">Select Employee</option>
                {employees.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 mt-2 md:mt-6">
              <input
                type="checkbox"
                name="assignedToAll"
                checked={form.assignedToAll}
                onChange={handleChange}
                className="checkbox checkbox-primary"
              />
              <span>Assign to all employees</span>
            </label>
          </div>
        )}
        
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className={`btn btn-primary ${loading ? "loading" : ""}`}
        >
          {loading ? "Adding..." : "Add Task"}
        </button>

        {msg && (
          <p
            className={`text-sm ${
              msg.includes()
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {msg}
          </p>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
