import {Navigate} from "react-router-dom";
import {useAuth} from "./AuthContext";

export default function PrivateRoute({children}){
    const {auth}=useAuth();
    if(!auth.isLoggedIn){
        return <Navigate to="/" />;
    }
    return children;
}