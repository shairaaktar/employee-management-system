import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./context/routes/ProtectedRoutes";
import DashboardLayout from "./layouts/DashboardLayout";
import Notifications from "./pages/Notification";
import HrDashboard2 from "./pages/HRDashboard2";
import EmployeeDashboard2 from "./pages/EmployeeDashboard2";

import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmployeeList from "./pages/EmployeeList";
import AddEmployee from "./pages/AddEmployee";
import AddPayroll from "./pages/AddPayroll";
import PayrollList from "./pages/PayrollList";
import HrDashboard from "./pages/HrDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ChangePassword from "./pages/ChnagePassword"
import DepartmentList from "./pages/DepartmentList";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmployeeTask from "./pages/EmployeeTask";
import TaskForm from "./components/TaskForm";
import HRTasks from "./pages/HRTask";
import EmployeeDocuments from "./pages/EmployeeDocuments";
import HRDocuments from "./pages/HRDocuments";
import AttendanceHistory from "./pages/AttendanceHistory";
import PayrollHistory from "./pages/PayrollHistory"
import EmployeePerformance from "./pages/EmployeePerformance";

import HrPerformance from "./pages/HrPerformance";
import ManagerReview from "./pages/ManagerReview";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminFinalization from "./pages/AdminFinalization";
import ManagerDashboard2 from "./pages/ManagerDashboard2";
import ManagerAttendance from "./pages/ManagerAttendance";
import ManagerTasks from "./pages/ManagerTasks";
import ManagerTeamAnalytics from "./pages/ManagerTeamAnalytics";
import ManagerCommunication from "./pages/ManagerCommunication";
import ManagerLeaveRequests from "./pages/ManagerLeaveRequest";
import ManagerDocument from "./pages/ManagerDocument";

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
         <Route path="/unauthorized" element={<div className="p-10 text-center text-xl text-red-600">Unauthorized Access 🚫</div>} />
          <Route path="/change-password" element={<ChangePassword />} />
           <Route path="/reset-password/:token" element={<ResetPassword />} />

        
         <Route element={<DashboardLayout/>}>
          
        <Route path="/employees" element={<EmployeeList />} />
       <Route path="/add-employee" element={<AddEmployee />} />
       <Route path="/payrolls" element={<PayrollList />} />
      <Route path="/add-payroll" element={<AddPayroll />} />
      <Route path="/dashboard/hr" element={<HrDashboard />} />
      <Route path="/dashboard2/hr"element={<HrDashboard2/>}/>
      <Route path="/dashboard/admin"element={<AdminDashboard/>}/>
       <Route path="/admin/analytics"element={<AdminAnalytics/>}/>
        <Route path="/admin/performance"element={<AdminFinalization/>}/>
      <Route path="/departments/list" element={<DepartmentList/>}/>
       <Route path="/task-form" element={<TaskForm/>}/>
       <Route path="/tasks" element={<HRTasks/>}/>
       <Route path="/documents/hr" elememt={<HRDocuments/>}/>
        
       
       
        {/* <Route path="/performance/hr" elememt={<HrPerformance/>}/> */}
        <Route path="/performance">
  <Route path="hr" element={<HrPerformance />} />
  
</Route>
<Route path="/reports">
  <Route path="manager" element={<ManagerTeamAnalytics />} />
  
</Route>
 <Route path="/tasks">
  <Route path="manager" element={<ManagerTasks />} />
  
</Route>
  {/* <Route path="/performance/hr" elememt={<HrPerformance/>}/> */}
       
  <Route path="/performance/manager" element={<ManagerReview/>} />
  <Route path="/manager/attendance" element={<ManagerAttendance/>} />
  

         </Route>

         
          <Route element={<DashboardLayout />}>
          <Route path="/notifications" element={<Notifications />} />

          <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
                    <Route path="/dashboard2/employee" element={<EmployeeDashboard2 />} />
        
          </Route>
          
        
          <Route path="/my-tasks" element={<EmployeeTask />} />
           <Route path="/payroll/employee" element={<PayrollHistory />} />
          <Route path="/documents/employee" element={<EmployeeDocuments/>}/>
        <Route path="/attendance" element={<AttendanceHistory/>}/>
        <Route path="/performance/employee" element={<EmployeePerformance/>}/>
         <Route path="/dashboard2/manager" element={<ManagerDashboard2/>}/>
          <Route path="/communication" element={<ManagerCommunication/>}/>
           <Route path="/manager/leaves" element={<ManagerLeaveRequests/>}/>
            <Route path="/manager/documents" element={<ManagerDocument/>}/>

          <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />

      </Routes>
    </BrowserRouter>
  );
}
