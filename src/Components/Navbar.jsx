import { Link, useLocation, useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../services/authService";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, [location]);

  const handleLogout = () => {
    logout();
    setRole(null);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 shadow-sm">
      <Link className="navbar-brand fw-bold" to="/">🚌 FastX</Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          {!isAuthenticated() && (
            <>
              
            </>
          )}

          {isAuthenticated() && role === "User" && (
            
            <li className="nav-item">
              <Link className="nav-link" to="/user/dashboard">Dashboard</Link>
            </li>
          )}

          {isAuthenticated() && role === "Bus Operator" && (
            <li className="nav-item">
              <Link className="nav-link" to="/bus-operator/dashboard">Dashboard</Link>
            </li>
          )}

          {isAuthenticated() && role === "Admin" && (
            <li className="nav-item">
              <Link className="nav-link" to="/admin">Dashboard</Link>
            </li>
          )}
         {isAuthenticated() && ( 
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/profile">My Profile</Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-outline-danger ms-3">Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
} 