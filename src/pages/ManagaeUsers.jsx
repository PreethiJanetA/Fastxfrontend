import React, { useEffect, useState } from "react";
import {
  getUserById,
  getAllUsers,
  deleteUser,
} from "../services/userService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Frontend role mapping based on RoleId
  const roleMapping = {
    1: "User",
    2: "Admin",
    3: "Bus Operator",
    // add other roles if any
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
      setError("");
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setError("Failed to load users.");
      toast.error("Failed to load users.");
    }
  };

  const handleSearch = async () => {
    setError("");
    if (!userId.trim()) {
      toast.warning("Please enter a User ID.");
      return;
    }

    try {
      const user = await getUserById(parseInt(userId));
      if (user) {
        setUsers([user]);
        setCurrentPage(1);
      } else {
        setUsers([]);
        toast.info("User not found with given ID.");
      }
    } catch (err) {
      setError("Error fetching user.");
      setUsers([]);
      toast.error("Error fetching user.");
    }
  };

  const handleClear = () => {
    setUserId("");
    setUsers([]);
    loadUsers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(id);
      toast.success("User deleted successfully.");
      setUsers(users.filter((u) => u.userId !== id));
    } catch {
      toast.error("Error deleting user.");
    }
  };

  const totalPages = Math.ceil(users.length / usersPerPage);
  const displayedUsers = Array.isArray(users)
    ? users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)
    : [];

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
        overflowY: "auto",
      }}
    >
      <div
        className="p-4"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderRadius: "16px",
          color: "#fff",
          width: "100%",
          maxWidth: "1100px",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2 className="text-center mb-4">Manage Users</h2>

        <div className="mb-3 d-flex gap-2 flex-wrap">
          <input
            type="number"
            placeholder="Search by User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="form-control"
            style={{ maxWidth: "250px" }}
          />
          <button className="btn btn-warning" onClick={handleSearch}>
            Search
          </button>
          <button className="btn btn-secondary" onClick={handleClear}>
            Reset
          </button>
        </div>

        {error && <p className="text-danger">{error}</p>}

        {users.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-dark table-bordered table-striped text-center">
              <thead className="table-light text-dark">
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedUsers.map((u) => (
                  <tr key={u.userId}>
                    <td>{u.userId}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.gender}</td>
                    <td>{u.contactNumber}</td>
                    <td>{u.address}</td>
                    <td>{roleMapping[u.roleId] || "Unknown"}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(u.userId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No users found.</p>
        )}

        {users.length > usersPerPage && (
          <div className="d-flex justify-content-center mt-3 flex-wrap">
            <button
              className="btn btn-outline-light mx-1"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`btn mx-1 ${
                  currentPage === index + 1 ? "btn-primary" : "btn-outline-light"
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="btn btn-outline-light mx-1"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
