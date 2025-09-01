import axios from "./axiosInstance";

export const register = async (data) => {
  try {
    const response = await axios.post("/Authentication/Register", data);
    return response.data;
  } catch (err) {
    console.error("Backend Error Response:", err.response?.data);

    if (err.response && err.response.data) {
      const message = err.response.data.status || JSON.stringify(err.response.data);
      throw new Error(message);
    }

    throw new Error("Something went wrong during registration.");
  }
};



export const login=async(credentials)=>{
    try{
    const response=await axios.post("/Authentication/Login",credentials);

   
    const {token,email,userId,role}=response.data;

    console.log("Token from backend:", token);
        console.log("User ID from backend:", userId);
        console.log("Role from backend:", role);
        console.log("Email from backend:", email);

    localStorage.setItem("token",token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("email", email);
    localStorage.setItem("role", role);

    return role;
}catch(err){
     if (err.response && err.response.data) {
      throw new Error(err.response.data.status || "Login failed");
    }
    throw err;
}
};

export const isAuthenticated=()=>{
  const token=localStorage.getItem("token");
  return !!token;
};

export const logout=()=>{
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
};

export const changePassword = async (dto) => {
  const response = await axios.put("/Authentication/ChangePassword", dto);
  return response.data;
};

export const forgotPassword = async (dto) => {
  const response = await axios.put("/Authentication/ForgotPassword", dto);
  return response.data;
};



















// import axios from "./axiosInstance";

// const API_URL = "http://localhost:5092/api/Authentication";

// // A helper function to get the token and set the header
// const authHeader = () => {
//     const token = localStorage.getItem("token");
//     if (token) {
//         return { Authorization: `Bearer ${token}` };
//     } else {
//         return {};
//     }
// };

// export const register = async (data) => {
//     try {
//         const response = await axios.post(`${API_URL}/Register`, data);
//         return response.data;
//     } catch (err) {
//         console.error("Backend Error Response:", err.response?.data);
//         if (err.response && err.response.data) {
//             const message = err.response.data.status || JSON.stringify(err.response.data);
//             throw new Error(message);
//         }
//         throw new Error("Something went wrong during registration.");
//     }
// };

// export const login = async (credentials) => {
//     try {
//         const response = await axios.post(`${API_URL}/Login`, credentials);
//         const { token, email, userId, role } = response.data;

//         // Create a single user object and store it
//         const user = {
//             userId,
//             email,
//             role,
//         };
//         localStorage.setItem("user", JSON.stringify(user));
//         localStorage.setItem("token", token); // Store token separately for convenience

//         return role;
//     } catch (err) {
//         if (err.response && err.response.data) {
//             throw new Error(err.response.data.status || "Login failed");
//         }
//         throw err;
//     }
// };

// export const isAuthenticated = () => {
//     const token = localStorage.getItem("token");
//     return !!token;
// };

// export const logout = () => {
//     // Clear the user and token keys
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
// };

// export const changePassword = async (dto) => {
//     try {
//         const response = await axios.put(`${API_URL}/ChangePassword`, dto, { headers: authHeader() });
//         return response.data;
//     } catch (err) {
//         console.error("Change password failed:", err.response);
//         throw err;
//     }
// };

// export const forgotPassword = async (dto) => {
//     try {
//         const response = await axios.put(`${API_URL}/ForgotPassword`, dto); // This endpoint is typically not authorized
//         return response.data;
//     } catch (err) {
//         console.error("Forgot password failed:", err.response);
//         throw err;
//     }
// };


// import axios from "./axiosInstance";

// const API_URL = "http://localhost:5092/api/Authentication";

// // A helper function to get the token and set the Authorization header
// const authHeader = () => {
//     const token = localStorage.getItem("token");
//     if (token) {
//         return { Authorization: `Bearer ${token}` };
//     } else {
//         return {};
//     }
// };

// export const register = async (data) => {
//     try {
//         const response = await axios.post(`${API_URL}/Register`, data);
//         return response.data;
//     } catch (err) {
//         console.error("Backend Error Response:", err.response?.data);
//         if (err.response && err.response.data) {
//             const message = err.response.data.status || JSON.stringify(err.response.data);
//             throw new Error(message);
//         }
//         throw new Error("Something went wrong during registration.");
//     }
// };

// export const login = async (credentials) => {
//     try {
//         const response = await axios.post(`${API_URL}/Login`, credentials);
//         const { token, email, userId, role } = response.data;

//         // Create a single user object and store it
//         const user = {
//             userId,
//             email,
//             role,
//         };
//         localStorage.setItem("user", JSON.stringify(user));
//         localStorage.setItem("token", token); // Store token separately for convenience

//         return role;
//     } catch (err) {
//         if (err.response && err.response.data) {
//             throw new Error(err.response.data.status || "Login failed");
//         }
//         throw err;
//     }
// };

// export const isAuthenticated = () => {
//     const token = localStorage.getItem("token");
//     return !!token;
// };

// export const logout = () => {
//     // Clear the user and token keys
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
// };

// export const changePassword = async (dto) => {
//     try {
//         const response = await axios.put(`${API_URL}/ChangePassword`, dto, { headers: authHeader() });
//         return response.data;
//     } catch (err) {
//         console.error("Change password failed:", err.response);
//         throw err;
//     }
// };

// export const forgotPassword = async (dto) => {
//     try {
//         const response = await axios.put(`${API_URL}/ForgotPassword`, dto); // This endpoint is typically not authorized
//         return response.data;
//     } catch (err) {
//         console.error("Forgot password failed:", err.response);
//         throw err;
//     }
// };

// import axios from "./axiosInstance";
// import { useNavigate } from "react-router-dom"; // for programmatic navigation

// const API_URL = "http://localhost:5092/api/Authentication";

// // A helper function to get the token and set the Authorization header
// const authHeader = () => {
//     const token = localStorage.getItem("token");
//     if (token) {
//         return { Authorization: `Bearer ${token}` };
//     } else {
//         return {};
//     }
// };

// export const register = async (data) => {
//     try {
//         const response = await axios.post(`${API_URL}/Register`, data);
//         return response.data;
//     } catch (err) {
//         console.error("Backend Error Response:", err.response?.data);
//         if (err.response && err.response.data) {
//             const message = err.response.data.status || JSON.stringify(err.response.data);
//             throw new Error(message);
//         }
//         throw new Error("Something went wrong during registration.");
//     }
// };

// export const login = async (credentials) => {
//     try {
//         const response = await axios.post(`${API_URL}/Login`, credentials);
//         const { token, email, userId, role } = response.data;

//         // Store each piece of info separately like the old service
//         localStorage.setItem("token", token);
//         localStorage.setItem("userId", userId);
//         localStorage.setItem("email", email);
//         localStorage.setItem("role", role);

//         return role; // still return role if needed
//     } catch (err) {
//         if (err.response && err.response.data) {
//             throw new Error(err.response.data.status || "Login failed");
//         }
//         throw err;
//     }
// };

// export const isAuthenticated = () => {
//     const token = localStorage.getItem("token");
//     return !!token;
// };

// // Updated logout function to optionally redirect
// export const logout = (redirectCallback) => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userId");
//     localStorage.removeItem("email");
//     localStorage.removeItem("role");

//     if (redirectCallback && typeof redirectCallback === "function") {
//         redirectCallback(); // trigger navigation if provided
//     }
// };

// export const changePassword = async (dto) => {
//     try {
//         const response = await axios.put(`${API_URL}/ChangePassword`, dto, { headers: authHeader() });
//         return response.data;
//     } catch (err) {
//         console.error("Change password failed:", err.response);
//         throw err;
//     }
// };

// export const forgotPassword = async (dto) => {
//     try {
//         const response = await axios.put(`${API_URL}/ForgotPassword`, dto);
//         return response.data;
//     } catch (err) {
//         console.error("Forgot password failed:", err.response);
//         throw err;
//     }
// };
