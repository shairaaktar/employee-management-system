import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContent";
import { useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-6">
    
      <div className="flex-1">
        <a className="text-xl font-bold text-primary cursor-pointer" onClick={() => navigate("/dashboard")}>
          ManagePro
        </a>
      </div>

      
      <div className="flex-none gap-3 items-center">
        <NotificationBell/>
      
        <button onClick={toggleTheme} className="btn btn-ghost btn-circle text-xl">
          {theme === "light" ? "🌞" : "🌙"}
        </button>

      
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
            <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
              <span className="text-lg">
                {user?.name ? user.name[0].toUpperCase() : "?"}
              </span>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li className="text-center font-semibold">
              👤 {user?.name || "User"}
            </li>
            <li><a onClick={() => navigate("/profile")}>Profile</a></li>
            <li><a onClick={() => navigate("/settings")}>Settings</a></li>
            <li>
              <button onClick={handleLogout} className="text-error font-semibold">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
