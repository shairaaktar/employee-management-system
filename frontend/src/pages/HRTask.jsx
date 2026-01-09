import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

export default function HRTasks() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const { data } = await API.get("/tasks/tasks");
    setTasks(data);
    setFilteredTasks(data);
  }

  useEffect(() => {
    let filtered = [...tasks];

    
    if (statusFilter !== "all")
      filtered = filtered.filter((t) => t.status === statusFilter);

    
    if (search.trim() !== "")
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.assignedTo?.name?.toLowerCase().includes(search.toLowerCase())
      );

   
    if (sortBy === "deadline")
      filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    setFilteredTasks(filtered);
  }, [tasks, statusFilter, sortBy, search]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Task Management</h1>

      
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by employee or title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-full md:w-1/3"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select select-bordered w-full md:w-1/4"
        >
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="select select-bordered w-full md:w-1/4"
        >
          <option value="">Sort By</option>
          <option value="deadline">Deadline</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-3 mb-3">
        <Link to="/task-form" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          + Add Task
        </Link>
        
      </div>

      
      <div className="grid md:grid-cols-2 gap-4">
        {filteredTasks.map((task) => (
          <div key={task._id} className="card bg-base-100 shadow-md p-4">
            <h2 className="font-bold text-lg">{task.title}</h2>
            <p className="text-sm text-gray-500 mb-2">
              Assigned To: {task.assignedTo?.name || "N/A"} ({task.assignedTo?.department})
            </p>
            <p>{task.description}</p>
            <p className="text-sm mt-2">
              Deadline: {task.deadline?.split("T")[0]}
            </p>
            <p className="text-sm font-medium mt-1">
              Status:{" "}
              <span
                className={`badge ${
                  task.status === "completed"
                    ? "badge-success"
                    : task.status === "in-progress"
                    ? "badge-warning"
                    : "badge-neutral"
                }`}
              >
                {task.status}
              </span>
            </p>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No tasks found.</p>
      )}
    </div>
  );
}
