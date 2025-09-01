import axios from "axios";

const instance=axios.create({
    baseURL:"http://localhost:5152/api",
});

instance.interceptors.request.use((config)=>{
    const token=localStorage.getItem("token");
    if(token){
        config.headers.Authorization=`Bearer ${token}`;
    }
    if (["post", "put", "patch"].includes(config.method)) {
    config.headers["Content-Type"] = "application/json";
    }
    return config;
});

export default instance;