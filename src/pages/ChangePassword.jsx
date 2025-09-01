import React, { useState } from "react";
import { changePassword } from "../services/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
    alert("All fields are required.");
    return;
  }

  if (form.newPassword !== form.confirmPassword) {
    alert("New password and confirm password do not match.");
    return;
  }

  try {
    const dto = {
      userId: parseInt(userId),
      currentPassword: form.currentPassword,
      newPassword: form.newPassword
    };

    const res = await changePassword(dto);
    alert(res.message || "Password changed successfully.");
    navigate("/profile");
  } catch (err) {
  const backendMessage =
    err?.response?.data?.message || 
    err?.response?.data?.status || 
    err.message ||                
    "Something went wrong";

  alert(backendMessage); 
}

};


  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url('https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/58cf8758-02e9-4d59-970f-211df3402f18.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        overflowY: "auto"
      }}
    >
      <div
        className="p-4"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderRadius: "16px",
          color: "#fff",
          width: "100%",
          maxWidth: "500px",
          backdropFilter: "blur(10px)"
        }}
      >
        <h2 className="text-center mb-4">Change Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="form-control"
              required
              minLength={6}
            />
          </div>

          <div className="mb-3">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-success me-2">
              Change Password
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}