

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  ClipboardList,
  Users,
  CheckCircle,
  FolderOpen,
  Bell,
  MessageSquare,
  FileBarChart,
 CalendarX,
  Target,
   TrendingUp 
} from "lucide-react";
import { Link } from "react-router-dom";
import API from "../api";
import toast from "react-hot-toast";

export default function ManagerDashboard2() {
  const [stats, setStats] = useState({
    teamCount: 0,
    pendingReviews: 0,
    completedReviews: 0,
    avgRating: 0,
    overdueTasks: 0,
    leaveRequests: 0,
    lndCount: 0,
    promotionCandidates: 0,
  });

  useEffect(() => {
    fetchManagerStats();
  }, []);

  const fetchManagerStats = async () => {
    try {
      const { data } = await API.get("/manager/overview");
      setStats(data);
    } catch {
      toast.error("Failed to load manager dashboard stats");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 bg-gray-50 min-h-screen"
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
         Manager Dashboard
      </h1>

   
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        
        
        <div className="bg-white p-5 rounded-xl shadow-md flex flex-col items-center">
          <Users className="text-indigo-500 mb-2" size={28} />
          <p className="text-gray-500 text-sm">Team Members</p>
          <p className="text-2xl font-semibold">{stats.teamCount}</p>
        </div>

        
        <div className="bg-white p-5 rounded-xl shadow-md flex flex-col items-center">
          <ClipboardList className="text-yellow-500 mb-2" size={28} />
          <p className="text-gray-500 text-sm">Pending Reviews</p>
          <p className="text-2xl font-semibold">{stats.pendingReviews}</p>
        </div>

        
        <div className="bg-white p-5 rounded-xl shadow-md flex flex-col items-center">
          <CheckCircle className="text-green-500 mb-2" size={28} />
          <p className="text-gray-500 text-sm">Completed Reviews</p>
          <p className="text-2xl font-semibold">{stats.completedReviews}</p>
        </div>

        
        <div className="bg-white p-5 rounded-xl shadow-md flex flex-col items-center">
          <Star className="text-yellow-500 mb-2" size={28} />
          <p className="text-gray-500 text-sm">Avg Team Rating</p>
          <p className="text-2xl font-semibold">{stats.avgRating}</p>
        </div>
      </div>

      
      <div className="grid md:grid-cols-4 gap-4 mb-10">

        
        <div className="bg-white p-5 rounded-xl shadow-md flex flex-col items-center">
          <CalendarX className="text-red-500 mb-2" size={28} />
          <p className="text-gray-500 text-sm">Overdue Tasks</p>
          <p className="text-2xl font-semibold">{stats.overdueTasks}</p>
        </div>

       
        <div className="bg-white p-5 rounded-xl shadow-md flex flex-col items-center">
          <Bell className="text-blue-500 mb-2" size={28} />
          <p className="text-gray-500 text-sm">Leave Requests</p>
          <p className="text-2xl font-semibold">{stats.leaveRequests}</p>
        </div>

        
        <div className="bg-white p-5 rounded-xl shadow-md flex flex-col items-center">
          <Target className="text-purple-500 mb-2" size={28} />
          <p className="text-gray-500 text-sm">L&D Recommended</p>
          <p className="text-2xl font-semibold">{stats.lndCount}</p>
        </div>

        
        <div className="bg-white p-5 rounded-xl shadow-md flex flex-col items-center">
          <TrendingUp className="text-green-600 mb-2" size={28} />
          <p className="text-gray-500 text-sm">Promotion Candidates</p>
          <p className="text-2xl font-semibold">{stats.promotionCandidates}</p>
        </div>
      </div>

     
      <div className="grid md:grid-cols-2 gap-6">

        
        <ModuleCard
          title="Performance Reviews"
          description="Review your team's performance, rate employees, and recommend promotions."
          link="/performance/manager"
        />

        
        <ModuleCard
          title="Task Management"
          description="Assign and monitor tasks, track deadlines, and ensure team productivity."
          link="/tasks/manager"
        />

        
        <ModuleCard
          title="Team Attendance"
          description="Monitor attendance patterns and view employee presence reports."
          link="/manager/attendance"
        />

        
        <ModuleCard
          title="Communication Center"
          description="Send announcements, feedback, or kudos to your team."
          link="/communication"
        />

       
        <ModuleCard
          title="Leave Requests"
          description="Approve or reject leave applications from your team."
          link="/manager/leaves"
        />

       
        <ModuleCard
          title="Employee Documents"
          description="View resumes, certificates, and important documents uploaded by your team."
          link="/manager/documents"
        />

        
        <ModuleCard
          title="Reports & Analytics"
          description="Analyze team data and export quarterly reports."
          link="/reports/manager"
        />
      </div>
    </motion.div>
  );
}


function ModuleCard({ title, description, link }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <Link
        to={link}
        className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition"
      >
        Open
      </Link>
    </div>
  );
}
