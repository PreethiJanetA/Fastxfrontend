import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "User") {
      alert("Access Denied. Only users allowed.");
      navigate("/");
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
          width: "200px",
          backgroundColor: "rgba(0,0,0,0.7)",
          color: "#fff",
          padding: "2rem 1rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3 className="text-center fw-bold mb-4">Dashboard</h3>
        <button onClick={() => navigate("/view-buses")} className="btn btn-outline-light mb-2">
          All Buses
        </button>
         <button onClick={() => navigate("/view-routes")} className="btn btn-outline-light mb-2">
          All Routes
        </button>
        <button onClick={() => navigate("/SearchRoutes")} className="btn btn-outline-light mb-2">
          Available Routes
        </button>
        <button onClick={() => navigate("/my-bookings")} className="btn btn-outline-light mb-2">
          Booking History
        </button>
        <button onClick={() => navigate("/my-payment")} className="btn btn-outline-light mb-2">
          Payment History
        </button>
        <button onClick={() => navigate("/my-refunds")} className="btn btn-outline-light mb-2">
          Refund History
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
          <h2 className="mb-3">Welcome User</h2>
          <p
            style={{
                   fontSize: "1.2rem",
                   fontFamily: "'Lora', serif", 
                   color: "#f5f5f5", 
                   fontStyle: "italic",
                   lineHeight: "2", 
                   }}
          >
          Your journey awaits.
         </p>
         
        </div>
      </div>
    </div>
  );
}
