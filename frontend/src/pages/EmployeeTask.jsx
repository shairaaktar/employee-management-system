

import { useEffect, useState,useContext } from "react";
import API from "../api";
import {toast} from "react-hot-toast"
import { AuthContext } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";


export default function EmployeeTasks() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const {user}=useContext(AuthContext);
  const [managertask,setManagerTask]=useState([])
  const {socket}=useSocket()



  useEffect(() => {
    fetchTasks();
    if (socket) {
      socket.on("taskAssigned", (data) => {
        toast.success(data.message);
        setTasks((prev) => [...prev, data.task]);
      });

      
      return () => {
        socket.off("taskAssigned");
      };
    }


  }, [socket]);





  async function fetchTasks() {
    const { data } = await API.get("/tasks/tasks");
    setTasks(data);
  }

  const filteredTasks = tasks
    .filter((t) => (statusFilter === "all" ? true : t.status === statusFilter))
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortBy === "deadline"
        ? new Date(a.deadline) - new Date(b.deadline)
        : 0
    );

  async function handleStatusChange(id, newStatus) {
    await API.put(`/tasks/${id}`, { status: newStatus });
    fetchTasks();
  }

  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>

      
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search tasks"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-full md:w-1/3"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select select-bordered w-full md:w-1/4"
        >
          <option value="all">All</option>
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


      <div className="grid md:grid-cols-2 gap-4">
        {filteredTasks.map((t) => (
          <div key={t._id} className="card bg-base-100 shadow-md p-4">
            <h3 className="font-semibold">{t.title}</h3>
            <p className="text-sm text-gray-500 mb-2">{t.description}</p>
            <p className="text-sm">Deadline: {t.deadline?.split("T")[0]}</p>
            <div className="mt-2 flex justify-between items-center">
              <span
                className={`badge ${
                  t.status === "completed"
                    ? "badge-success"
                    : t.status === "in-progress"
                    ? "badge-warning"
                    : "badge-neutral"
                }`}
              >
                {t.status}
              </span>

              <select
                value={t.status}
                onChange={(e) => handleStatusChange(t._id, e.target.value)}
                className="select select-sm select-bordered"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No tasks found.</p>
      )}
    </div>
  );
}
