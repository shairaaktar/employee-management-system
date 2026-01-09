
import { createContext,useState,useEffect} from "react";

export const AuthContext=createContext();


export const AuthProvider=({children})=>{
    const [user,setUser]=useState(JSON.parse(localStorage.getItem("user"))||null);

    const login=(data)=>{
         setUser(data.user);
        localStorage.setItem("token",data.token);
        localStorage.setItem("user",JSON.stringify(data.user));
       
    }

    const logout=()=>{
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
    };

    useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

    const isHR=user?.role==="hr"|| user?.role==="admin";
    const isEmployee=user?.role==="employee";

    return(
        <AuthContext.Provider value={{ user, login, logout,isHR,isEmployee }}>
      {children}
    </AuthContext.Provider>
    )
}