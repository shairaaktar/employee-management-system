import API from "../api";
import { useState } from "react";
import toast from "react-hot-toast";
import {Trash2,CheckCircle,RotateCcw} from "lucide-react"

const TaskList = ({ tasks, refresh }) => {
  const [msg, setMsg] = useState("");

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`); 
      toast.success("Task deleted");
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting task");
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
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating task");
    }
  };

return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex flex-col justify-between"
        >
          <div>
            <h3 className="text-lg font-semibold">{task.title}</h3>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
            {task.deadline && (
              <p className="text-xs text-gray-500 mt-1">
                Deadline: {task.deadline.split("T")[0]}
              </p>
            )}
            <p
              className={`text-xs mt-2 font-medium ${
                task.status === "completed"
                  ? "text-green-600"
                  : task.status === "in-progress"
                  ? "text-yellow-600"
                  : "text-blue-600"
              }`}
            >
              Status: {task.status}
            </p>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => toggleStatus(task)}
              className="text-green-600 hover:text-green-800"
              title="Next status"
            >
              {task.status === "completed" ? <RotateCcw size={18} /> : <CheckCircle size={18} />}
            </button>
            <button
              onClick={() => handleDelete(task._id)}
              className="text-red-600 hover:text-red-800"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}

      {tasks.length === 0 && (
        <p className="col-span-full text-center text-gray-500 mt-6">
          No tasks found.
        </p>
      )}
    </div>
  );

};

export default TaskList;
