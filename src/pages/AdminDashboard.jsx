import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout } from "../services/authService";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "Admin") {
      toast.error("Access Denied: Only admins allowed.");
      setTimeout(() => navigate("/"), 2000); 
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return null;

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        backgroundImage:
          "url('https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/58cf8758-02e9-4d59-970f-211df3402f18.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        style={{
          width: "220px",
          backgroundColor: "rgba(0,0,0,0.7)",
          color: "#fff",
          padding: "2rem 1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <h3 style={{ marginBottom: "1.5rem", fontWeight: "bold", textAlign: "center" }}>
          Dashboard
        </h3>
        <button onClick={() => navigate("/admin/users")} className="btn btn-outline-light mb-2">
          Manage Users
        </button>
        <button onClick={() => navigate("/admin/buses")} className="btn btn-outline-light mb-2">
          Manage Buses
        </button>
        <button onClick={() => navigate("/manage-routes")} className="btn btn-outline-light mb-2">
          Manage Routes
        </button>
        <button onClick={() => navigate("/manage-bookings")} className="btn btn-outline-light mb-2">
          Manage Bookings
        </button>
        <button onClick={() => navigate("/admin/manage-payments")} className="btn btn-outline-light mb-2">
          Manage Payments
        </button>
        <button onClick={() => navigate("/admin/manage-refunds")} className="btn btn-outline-light mb-2">
          Manage Refunds
        </button>
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="btn btn-danger mt-3"
        >
          Logout
        </button>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            color: "#fff",
            padding: "3rem",
            borderRadius: "16px",
            width: "100%",
            height: "115%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backdropFilter: "blur(1px)",
          }}
        >
          <h2 className="mb-3">Welcome Admin</h2>
          <p
            style={{
                   fontSize: "1.2rem",
                   fontFamily: "'Lora', serif", 
                   color: "#f5f5f5", 
                   fontStyle: "italic",
                   lineHeight: "2", 
                   }}
          >
          Your command center awaits. Navigate the system from the sidebar.
         </p>
        </div>
      </div>
    </div>
  );
}