import { useState,useEffect } from "react";
import API from "../api";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyEmail=() =>{
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const location = useLocation();
  const [timer,setTimer]=useState(0)
  const navigate = useNavigate();
  const email = location.state?.email;
  const [loading,setLoading]=useState(false);

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setTimeout(() => setTimer(timer - 1), 1000);
    }
    return () => clearTimeout(countdown);
  }, [timer]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/verify-email", { email, code });
      setMsg("Email verified! Redirecting....");
      setTimeout(() => navigate("/login"), 1500);

      navigate("/login");
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  const handleResend=async()=>{
    setLoading(true);
    try{
        await API.post("/auth/resend-code", { email });
      setMsg("New verification code sent to your email.");
      setTimer(60); 

    }catch(err){
        setMsg(err.response?.data?.message || "Error resending code");
    }
    setLoading(false);
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Verify Email</h2>
        <input
        type="text" 
        placeholder="Enter Code"
        className="border p-2 w-full mb-2" value={code}
          onChange={(e) => setCode(e.target.value)} 
          />
        <button 
        className="bg-green-500 text-white px-4 py-2 rounded w-full">Verify
        </button>
        <button
        type="button"
          onClick={handleResend}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full disabled:opacity-50"
          disabled={loading || timer > 0}
        >
           {timer > 0 ? `Resend Code in ${timer}s` : "Resend Code"}
        </button>
        <p className="text-sm mt-2 text-gray-600">{msg}</p>
      </form>
    </div>
  );
}

export default VerifyEmail
