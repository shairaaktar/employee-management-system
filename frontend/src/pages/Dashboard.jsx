import { useState, useEffect, useContext } from "react";
import API from "../api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { AuthContext } from "../context/AuthContext";
import ProgressChart from "../components/ProgressChart";
import toast from "react-hot-toast";

const Dashboard=()=> {
  const [tasks, setTasks] = useState([]);
  const [filter,setFilter]=useState("all");
  const [sort,setSort]=useState("none")
  const { logout } = useContext(AuthContext);

 const fetchTasks = async () => {
    try {
      const { data } = await API.get("/tasks/tasks");
      setTasks(data);
    } catch (err) {
      toast.error("Failed to fetch tasks");
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const filteredTasks=tasks
  .filter((t)=>
    filter==="all" ?true:t.status===filter
).sort((a,b)=>{
    if(sort==="deadline") return new Date(a.deadline)-new Date(b.deadline);
    return 0;
});

const completed=tasks.filter((t)=>t.status==="completed").length;
const total=tasks.length;
const progress=total>0?Math.round((completed/total)*100):0;

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">My Tasks</h1>
//         <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">
//           Logout
//         </button>
//       </div>

//       <ProgressChart tasks={tasks} />
//       <TaskForm refresh={fetchTasks} />
//       <TaskList tasks={tasks} refresh={fetchTasks} />
//     </div>
//   );

return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">My Tasks</h1>
        <button
          onClick={() => {
            logout();
            toast.success("Logged out");
          }}
          className="mt-3 md:mt-0 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        >
          <option value="all">All</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        >
          <option value="none">Sort By</option>
          <option value="deadline">Deadline</option>
        </select>
      </div>

     
      {total > 0 && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <p className="font-medium mb-2">{completed} of {total} tasks completed</p>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      
      <TaskForm refresh={fetchTasks} />
      <TaskList tasks={filteredTasks} refresh={fetchTasks} />
    </div>
  );
}

export default Dashboard