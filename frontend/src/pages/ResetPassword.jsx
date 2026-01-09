import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function ResetPassword() {
  const { token } = useParams();
  console.log("token",token)
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const { data } = await API.post(`/auth/reset-password/${token}`, { password ,token});
      setMsg(data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-center mb-2">Reset Password</h2>
          <p className="text-sm text-gray-500 mb-4">
            Enter your new password below.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full"
              required
            />
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          {msg && <p className="text-sm text-center mt-3">{msg}</p>}

          <div className="divider"></div>
          <p className="text-sm text-center">
            Go back to{" "}
            <Link to="/login" className="link text-primary">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
