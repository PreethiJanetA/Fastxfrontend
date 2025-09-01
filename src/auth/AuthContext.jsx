import React,{useState,useEffect,createContext,useContext} from "react";
import {isAuthenticated} from "../services/authService";

const AuthContext=createContext();

export const AuthProvider=({children})=>{
  const[auth,setAuth]=useState({isLoggedIn:false});

  useEffect(()=>{
      setAuth({isLoggedIn:isAuthenticated()})
  },[]);

  const loginUser=()=>setAuth({isLoggedIn:true});
  const logoutUser=()=>{
    localStorage.clear();
  setAuth({isLoggedIn:false});

};

return(
  <AuthContext.Provider value={{auth,loginUser,logoutUser}}>
    {children}
  </AuthContext.Provider>
);
};

export const useAuth=()=>useContext(AuthContext);
