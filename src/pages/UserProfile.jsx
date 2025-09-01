import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById, updateUserProfile } from "../services/userService";
import { toast } from "react-toastify";

export default function UserProfile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    gender: "",
    contactNumber: "",
    address: ""
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getUserById(userId);
        setUser(res);
        setForm({
          name: res.name || "",
          gender: res.gender || "",
          contactNumber: res.contactNumber || "",
          address: res.address || ""
        });
      } catch (err) {
        toast.error("Error fetching user data");
      }
    }

    if (userId) fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value.trimStart() });
  };

  const handleSave = async () => {
    if (!form.name || !form.gender || !form.contactNumber || !form.address) {
      toast.warn("All fields are required.");
      return;
    }

    try {
      const updatedData = {
        userId,
        name: form.name,
        email: form.email,
        gender: form.gender,
        contactNumber: form.contactNumber,
        address: form.address,
        roleId: role,
      };

      await updateUserProfile(userId, updatedData);
      toast.success("Profile updated successfully");
      setEditMode(false);
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      toast.error("Profile update failed");
    }
  };

  const handleCancel = () => {
    setForm({
      name: user.name,
      gender: user.gender,
      contactNumber: user.contactNumber,
      address: user.address
    });
    setEditMode(false);
    toast.info("Edit cancelled.");
  };

  if (!user) return <p className="text-white text-center mt-5">Loading...</p>;

  const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);

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
          maxWidth: "600px",
          backdropFilter: "blur(10px)"
        }}
      >
        <h2 className="text-center mb-4">My Profile</h2>

        <div className="mb-3"><strong>User ID:</strong> {userId}</div>
        <div className="mb-3"><strong>Email:</strong> {email}</div>
        <div className="mb-3"><strong>Role:</strong> {capitalizedRole}</div>

        {role.toLowerCase() === "bus operator" && user.busId && (
          <div className="mb-3"><strong>Bus ID:</strong> {user.busId}</div>
        )}

        {editMode ? (
          <>
            <div className="mb-3">
              <label>Name:</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label>Gender:</label>
              <input
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label>PhoneNumber:</label>
              <input
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label>Address:</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="form-control"
              />
            </div>

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
              <button
                className="btn btn-warning me-2"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
              <button
                className="btn btn-danger"
                onClick={() => navigate("/change-password")}
              >
                Change Password
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
