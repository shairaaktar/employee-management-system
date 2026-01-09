

import { useState, useContext } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContent";
import { useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import {jwtDecode}from "jwt-decode";
import { Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const { login } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", form);
      console,log("data",data)
      login(data);
      if (data.user?.mustChangePassword) {
        navigate("/change-password");
      } 
      // else {
      //   navigate("/dashboard/employee");
      // }

      if(data.user.role=="admin"){
        navigate("/dasboard/admin")

      }
      if(data.user.role=="hr"){
        navigate("/dasboard/hr")
        
      }
      if(data.user.role=="manager"){
        navigate("/dasboard/manager")
        
      }
      if(data.user.role=="employee"){
        navigate("/dasboard/employee")
        
      }
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 transition-colors">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-between">
            Login
            {/* <button onClick={toggleTheme} className="btn btn-ghost btn-sm">
              {theme === "light" ? "🌞" : "🌙"}
            </button> */}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-3">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input input-bordered w-full"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input input-bordered w-full"
              onChange={handleChange}
              required
            />
            <p className="text-center text-sm mt-3 mb-2">
 
  <Link to="/forgot-password" className="text-primary hover:underline">
   Fogot password
  </Link>
</p>
            <button className="btn btn-primary w-full">Login</button>
            <p className="text-sm text-center text-error">{msg}</p>
          </form>

          <div className="divider">OR</div>

          {/* <button className="btn bg-white text-black border w-full">
            <svg aria-label="Email icon" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="black">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </g>
            </svg>
            Login with Email
          </button> */}

          {/* <button className="btn bg-white text-black border w-full">
            <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
              <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
              <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
              <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
            </svg>
            Login with Google
          </button> */}
           <GoogleLogin
        onSuccess={async (credentialResponse) => {
          const decoded = jwtDecode(credentialResponse.credential);

          
          const { data } = await API.post("/auth/google-login", {
            email: decoded.email,
            name: decoded.name,
          });

          login(data);
          
          {data.user.role=="hr"&&(
            navigate("/dashboard/hr")

          )}
         {data.user.role=="employee"&&(
            navigate("/dashboard/employee")

          )}
          {data.user.role=="admin"&&(
            navigate("/dashboard/admin")

          )}
          {data.user.role=="manager"&&(
            navigate("/dashboard2/manager")

          )}
        }}
        onError={() => {
          console.log("Google login failed");
        }}
      />
    <p className="text-center text-sm mt-3">
  Don’t have an account?{" "}
  <Link to="/register" className="text-primary hover:underline">
    Register here
  </Link>
</p>
      
        </div>
        
      </div>
    </div>
  );
};

export default Login;
