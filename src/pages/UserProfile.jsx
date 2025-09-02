import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById, updateUserProfile } from "../services/userService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserProfile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", gender: "", contactNumber: "", address: "" });

  useEffect(() => {
    async function fetchUser() {
      try {
        if (!userId) return;
        const res = await getUserById(userId);
        setUser(res);
        setForm({
          name: res.name || "",
          gender: res.gender || "",
          contactNumber: res.contactNumber || "",
          address: res.address || ""
        });
      } catch {
        toast.error("Error fetching user data");
      }
    }
    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.name || !form.gender || !form.contactNumber || !form.address) {
      toast.warn("All fields are required.");
      return;
    }
    try {
      const storedUser = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : {};
      const roleId = storedUser?.roleId || 2; // default to User

      const updatedData = {
        userId: Number(userId),
        name: form.name,
        email: email || "",
        gender: form.gender,
        contactNumber: form.contactNumber,
        address: form.address,
        roleId: Number(roleId),
      };

      await updateUserProfile(userId, updatedData);
      toast.success("Profile updated successfully");
      setUser(updatedData);
      setEditMode(false);
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      toast.error("Profile update failed");
    }
  };

  const handleCancel = () => {
    if (user) setForm({ name: user.name, gender: user.gender, contactNumber: user.contactNumber, address: user.address });
    setEditMode(false);
    toast.info("Edit cancelled.");
  };

  if (!user) return <p className="text-white text-center mt-5">Loading...</p>;

  const capitalizedRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : "";

  return (
    <div style={{ minHeight: "100vh", width: "100vw", backgroundImage: `url('https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/58cf8758-02e9-4d59-970f-211df3402f18.png')`, backgroundSize: "cover", backgroundPosition: "center", padding: "2rem", display: "flex", justifyContent: "center", alignItems: "start", overflowY: "auto" }}>
      <div className="p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", borderRadius: "16px", color: "#fff", width: "100%", maxWidth: "600px", backdropFilter: "blur(10px)" }}>
        <h2 className="text-center mb-4">My Profile</h2>
        <div className="mb-3"><strong>User ID:</strong> {userId}</div>
        <div className="mb-3"><strong>Email:</strong> {email}</div>
        <div className="mb-3"><strong>Role:</strong> {capitalizedRole}</div>

        {role?.toLowerCase() === "bus operator" && user.busId && <div className="mb-3"><strong>Bus ID:</strong> {user.busId}</div>}

        {editMode ? (
          <>
            {["name","gender","contactNumber","address"].map(field => (
              <div key={field} className="mb-3">
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                <input name={field} value={form[field]} onChange={handleChange} className="form-control" />
              </div>
            ))}
            <div className="text-center">
              <button className="btn btn-success me-2" onClick={handleSave}>Save</button>
              <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-3"><strong>Name:</strong> {user.name}</div>
            <div className="mb-3"><strong>Gender:</strong> {user.gender}</div>
            <div className="mb-3"><strong>Contact:</strong> {user.contactNumber}</div>
            <div className="mb-3"><strong>Address:</strong> {user.address}</div>
            <div className="text-center mt-4">
              <button className="btn btn-warning me-2" onClick={() => setEditMode(true)}>Edit Profile</button>
              <button className="btn btn-danger" onClick={() => navigate("/change-password")}>Change Password</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

