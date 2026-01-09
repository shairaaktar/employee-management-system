import { useState } from "react";
import API from "../api";
import {useNavigate} from "react-router-dom";

 const Register=()=>{
    const [form,setForm]=useState({name:"",email:"",password:""});
    const [msg,setMsg]=useState("");
    const navigate=useNavigate();


    const handleChange=(e)=>setForm({...form,[e.target.name]:e.target.value});

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{

           await API.post("/auth/register", form);
          setMsg("Registered successfully! Check your email for the code.");
          navigate("/verify-email", { state: { email: form.email } });

        }catch(err){
           setMsg(err.response?.data?.message || "Error");
        }
    };

     return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <input type="text" name="name" placeholder="Name"
          className="border p-2 w-full mb-2" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email"
          className="border p-2 w-full mb-2" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password"
          className="border p-2 w-full mb-2" onChange={handleChange} />
        <button 
        className="bg-blue-500 text-white px-4 py-2 rounded w-full">
          Register
          </button>
        <p className="text-sm mt-2 text-gray-600">{msg}</p>
      </form>
    </div>
  );
    

}

export default Register