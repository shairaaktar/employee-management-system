import { Link, Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContent";
import { AuthContext } from "../context/AuthContext";

export default function DashboardLayout() {
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

 
  const employeeLinks = [
    { to: "/dashboard/employee", label: "Overview" },
    { to: "/my-tasks", label: "My Tasks" },
    { to: "/attendance", label: "My Attendance" },
    { to: "/payroll/employee", label: "My Payroll" },
    { to: "/performance/employee", label: "Performance" },
    { to: "/documents/employee", label: "Documents" },
  ];

  const hrLinks = [
    { to: "/dashboard/hr", label: "HR Overview" },
   
    { to: "/employees", label: "Employee List" },
     { to: "/tasks", label: "Tasks" },
    
    
    { to: "/attendance", label: "Attendance Management" },
     { to: "/performance/hr", label: "Performance Management" },
      { to: "/performance/manager", label: "Maanger Management" },
    { to: "/payrolls", label: "Payroll Management" },
    { to: "/notifications", label: "Notifications" },
    { to: "/dashboard2/hr", label: "Analytics" },
  ];

  const adminLinks = [
    { to: "/dashboard/admin", label: "Admin Overview" },
    { to: "/users", label: "User Management" },
    { to: "/departments/list", label: "Departments" },
    { to: "/hr", label: "HR Management" },
    { to: "/settings", label: "System Settings" },
    { to: "/admin/performance", label: "Performance Reports" },
    { to: "/admin/analytics", label: "Reports" },
  ];

  
  let links = [];
  if (user?.role === "admin") links = adminLinks;
  else if (user?.role === "hr") links = hrLinks;
  else links = employeeLinks;

  return (
    <div className="flex flex-col min-h-screen bg-base-200 text-base-content transition-colors duration-300">
      
      <Navbar />

      <div className="flex flex-1">
     
        <aside className="w-64 bg-base-100 shadow-lg border-r border-base-300 hidden md:flex flex-col justify-between">
          <div>
            <h1 className="text-xl font-bold text-primary text-center py-4">
              ManagePro
            </h1>
            <nav className="menu p-2 space-y-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`menu-item rounded-lg p-2 ${
                    location.pathname === l.to
                      ? "bg-primary text-primary-content"
                      : "hover:bg-base-300"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

         
          <div className="p-4 border-t border-base-300">
            <button onClick={toggleTheme} className="btn btn-outline w-full">
              {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>
          </div>
        </aside>

        
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
