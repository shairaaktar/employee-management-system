


import API from "../api";
import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { Trash2, CheckCircle, RotateCcw, PlusCircle, ClockAlert } from "lucide-react";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";



const ManagerTasks = () => {
  const [managerName, setManagerName] = useState("");
  const [teamSize, setTeamSize] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all"); 
  const [showForm, setShowForm] = useState(false);


  const overdueTasks = tasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'completed');
const upcomingTasks = tasks.filter(t => t.deadline && new Date(t.deadline) >= new Date() && (new Date(t.deadline) - new Date()) / (1000*60*60*24) <= 7);
const blockedTasks = tasks.filter(t => t.blocked);
const otherTasks = tasks.filter(t => !overdueTasks.includes(t) && !upcomingTasks.includes(t) && !blockedTasks.includes(t));


  const fetchTasksForManager = async () => {
    try {
      const { data } = await API.get("/tasks/manager");

      setManagerName(data.manager || "Manager");
      setTeamSize(data.teamSize || 0);

     
      setTasks(data.enrichedTasks || []);
    } catch (err) {
      toast.error("Failed to fetch manager tasks");
    }
  };

  useEffect(() => {
    fetchTasksForManager();
  }, []);


  const approveTask = async (id) => {
  try {
    await API.put(`/tasks/${id}/approve`);
    toast.success("Task approved");
    fetchTasksForManager();
  } catch {
    toast.error("Error approving task");
  }
};

const returnTask = async (id) => {
  try {
    await API.put(`/tasks/${id}/return`);
    toast.success("Task returned for revision");
    fetchTasksForManager();
  } catch {
    toast.error("Error sending back for revision");
  }
};

  
  const categorized = useMemo(() => {
    const now = new Date();

    const overdue = tasks.filter((t) => t.overdue === true);
    const upcoming = tasks.filter(
      (t) => t.deadline && new Date(t.deadline) >= now && t.status !== "completed"
    );
    const completed = tasks.filter((t) => t.status === "completed");

    return { overdue, upcoming, completed };
  }, [tasks]);


  const filteredTasks = useMemo(() => {
    if (filter === "overdue") return categorized.overdue;
    if (filter === "upcoming") return categorized.upcoming;
    if (filter === "completed") return categorized.completed;
    return tasks;
  }, [filter, categorized, tasks]);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      toast.success("Task deleted");
      fetchTasksForManager();
    } catch (err) {
      toast.error("Error deleting task");
    }
  };

  const toggleStatus = async (task) => {
    try {
      const nextStatus =
        task.status === "todo"
          ? "in-progress"
          : task.status === "in-progress"
          ? "completed"
          : "todo";

      await API.put(`/tasks/${task._id}`, { ...task, status: nextStatus });
      toast.success("Task updated");
      fetchTasksForManager();
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
  
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold"> Manager Tasks</h1>
        <div className="text-gray-700 text-sm mt-3 md:mt-0">
          <p><strong>Manager:</strong> {managerName}</p>
          <p><strong>Team Size:</strong> {teamSize}</p>
        </div>
      </div>

      
      <div className="flex flex-wrap justify-between mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded border px-3 py-2 bg-white shadow-sm"
        >
          <option value="all">All Tasks</option>
          <option value="overdue">Overdue</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
        </select>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
        >
          <PlusCircle size={18} /> Create Task
        </button>
      </div>

     

      
      {filter === "all" && (
        <>
         
          {categorized.overdue.length > 0 && (
            <Section title=" Overdue Tasks" color="text-red-600" tasks={categorized.overdue} onDelete={handleDelete} onToggle={toggleStatus} />
          )}

          
          {categorized.upcoming.length > 0 && (
            <Section title=" Upcoming Tasks" color="text-blue-600" tasks={categorized.upcoming} onDelete={handleDelete} onToggle={toggleStatus} />
          )}

         
          {categorized.completed.length > 0 && (
            <Section title=" Completed Tasks" color="text-green-600" tasks={categorized.completed} onDelete={handleDelete} onToggle={toggleStatus} />
          )}
        </>
      )}

    
      {filter !== "all" && (
        <Section
          title={
            filter === "overdue"
              ? " Overdue Tasks"
              : filter === "upcoming"
              ? " Upcoming Tasks"
              : "Completed Tasks"
          }
          tasks={filteredTasks}
          onDelete={handleDelete}
          onToggle={toggleStatus}
        />
      )}

      
      {filteredTasks.length === 0 && (
        <p className="text-center text-gray-500 mt-10 italic">
          No tasks found in this category.
        </p>
      )}

      
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[90%] md:w-[400px] shadow-2xl relative">
            <h2 className="text-xl font-semibold mb-4">Assign New Task</h2>
            <TaskForm
              onClose={() => setShowForm(false)}
              onSuccess={() => {
                fetchTasksForManager();
                setShowForm(false);
              }}
            />
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800"
            >
              cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerTasks;


const Section = ({ title, color, tasks, onDelete, onToggle }) => (
  <div className="mb-10">
    <h2 className={`text-xl font-bold mb-3 ${color}`}>{title}</h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <div key={task._id} className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.description}</p>

          <p className="text-xs text-gray-500 mt-2">
            <strong>Deadline:</strong>{" "}
            {task.deadline ? task.deadline.split("T")[0] : "—"}
          </p>

          {task.overdue && (
            <p className="text-xs text-red-600 font-semibold mt-1 flex items-center gap-1">
              <ClockAlert size={14} /> Overdue
            </p>
          )}
         
{task.priority && (
  <p
    className={`inline-block px-3 py-1 text-xs rounded-full font-semibold mt-2 ${
      task.priority === "high"
        ? "bg-red-100 text-red-700"
        : task.priority === "medium"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-green-100 text-green-700"
    }`}
  >
    Priority: {task.priority}
  </p>
)}


{task.deadlineStatus === "upcoming" && (
  <p className="text-xs text-blue-600 mt-1">
    ⏳ {task.daysLeft} days left
  </p>
)}

{task.deadlineStatus === "overdue" && (
  <p className="text-xs text-red-600 font-semibold mt-1">
    ⚠️ Overdue by {Math.abs(task.daysLeft)} days
  </p>
)}


{task.status === "completed" && !task.approvedByManager && (
  <div className="mt-3 flex gap-2">
    <button
      onClick={() => approveTask(task._id)}
      className="text-green-600 hover:text-green-800 text-sm"
    >
      Approve
    </button>
    <button
      onClick={() => returnTask(task._id)}
      className="text-red-600 hover:text-red-800 text-sm"
    >
      Return
    </button>
  </div>
)}


          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => onToggle(task)}>
              {task.status === "completed" ? (
                <RotateCcw size={18} className="text-yellow-600" />
              ) : (
                <CheckCircle size={18} className="text-green-600" />
              )}
            </button>
            <button onClick={() => onDelete(task._id)}>
              <Trash2 size={18} className="text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
