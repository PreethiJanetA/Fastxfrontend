import React, { useEffect, useState } from "react";
import {
  getAllRoutes,
  getRoutesByBusId,
  addRoute,
  updateRoute,
  deleteRoute,
  getRouteById,
} from "../services/routeService";
import AddRouteModal from "../Components/AddRouteModal";
import EditRouteModal from "../Components/EditRouteModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageRoutes() {
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editRoute, setEditRoute] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const routesPerPage = 5;

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // This effect runs once to load the user from local storage
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
    
    // This is the initial data fetch, which now depends on the user being loaded
    if (user) {
        const userRole = user?.role;
        const busId = user?.busId;
        loadRoutes(userRole, busId);
    }
  }, []);

  const loadRoutes = async (userRole, busId) => {
    try {
      let data = [];
      const trimmedRole = userRole?.trim();
      const pagenation = { PageNumber: currentPage, PageSize: routesPerPage };
      if (trimmedRole === "Admin") {
        data = await getAllRoutes(pagenation);
      } else if (trimmedRole === "Bus Operator" && busId) {
        data = await getRoutesByBusId(busId, pagenation);
      }
      setRoutes(Array.isArray(data.items) ? data.items : []);
      setError("");
      
    } catch (err) {
      console.error(err);
      setError("Failed to load routes.");
      setRoutes([]);
      toast.error("Failed to load routes.");
    }
  };

  const handleAdd = async (route) => {
    try {
      await addRoute(route);
      toast.success("Route added successfully!");
      setShowAdd(false);
      loadRoutes(currentUser?.role, currentUser?.busId);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add route.");
    }
  };

  const handleEdit = async (route) => {
    try {
      await updateRoute(route.routeId, route);
      toast.success("Route updated successfully.");
      setEditRoute(null);
      loadRoutes(currentUser?.role, currentUser?.busId);
    } catch (err) {
      console.error("Failed to update route:", err);
      toast.error("Failed to update route.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this route?");
    if (!confirmDelete) return;

    try {
      await deleteRoute(id);
      toast.success("Route deleted successfully.");
      loadRoutes(currentUser?.role, currentUser?.busId);
    } catch {
      toast.error("Failed to delete route.");
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setSearchError("Please enter a Route ID.");
      return;
    }
    try {
      const route = await getRouteById(searchId);
      setSearchResult(route);
      setSearchError("");
    } catch {
      setSearchResult(null);
      setSearchError("Route not found.");
      toast.info("No route found for the given ID.");
    }
  };

  const clearSearch = () => {
    setSearchId("");
    setSearchResult(null);
    setSearchError("");
  };

  const userRole = currentUser?.role?.trim();
  //console.log("DEBUG: userRole =", userRole, "| Length =", userRole?.length);
  const busId = currentUser?.busId;

  const displayList = searchResult ? [searchResult] : (Array.isArray(routes) ? routes : []);
  const totalPages = Math.ceil(displayList.length / routesPerPage);
  const paginatedRoutes = Array.isArray(displayList) ? displayList.slice(
    (currentPage - 1) * routesPerPage,
    currentPage * routesPerPage
  ) : [];

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
        <h2 className="text-center mb-4">Manage Routes</h2>
        {error && <p className="text-danger">{error}</p>}

        <div className="mb-4">
          <label>Search Route by ID:</label>
          <div className="d-flex gap-2 mt-2 flex-wrap">
            <input
              type="number"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Route ID"
              className="form-control"
              style={{ maxWidth: "250px" }}
            />
            <button className="btn btn-warning" onClick={handleSearch}>
              Search
            </button>
            <button
              className="btn btn-secondary"
              onClick={clearSearch}
            >
              Clear
            </button>
          </div>
          {searchError && <p className="text-danger mt-2">{searchError}</p>}
        </div>

        {(userRole === "Admin" || userRole === "Bus Operator") && (
            <button className="btn btn-success mb-3" onClick={() => setShowAdd(true)}>
                Add New Route
            </button>
        )}

        <div className="table-responsive">
          <table className="table table-dark table-bordered table-striped text-center">
            <thead className="table-light text-dark">
              <tr>
                <th>ID</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Fare</th>
                <th>Bus ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRoutes.length > 0 ? (
                paginatedRoutes.map((r) => (
                  <tr key={r.routeId}>
                    <td>{r.routeId}</td>
                    <td>{r.orgin}</td>
                    <td>{r.destination}</td>
                    <td>{r.departureTime}</td>
                    <td>{r.arrivalTime}</td>
                    <td>₹{r.fare}</td>
                    <td>{r.busId}</td>
                    <td>
                      {(userRole === "Admin" || userRole === "Bus Operator") && (
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => setEditRoute(r)}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(r.routeId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-light">
                    No routes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {displayList.length > routesPerPage && (
          <div className="d-flex justify-content-center mt-3">
            <button
              className="btn btn-light mx-1"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`btn mx-1 ${
                  currentPage === i + 1 ? "btn-primary" : "btn-outline-light"
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="btn btn-light mx-1"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}

        {showAdd && (
          <AddRouteModal
            show={showAdd}
            onClose={() => setShowAdd(false)}
            onSubmit={handleAdd}
          />
        )}
        {editRoute && (
          <EditRouteModal
            show={!!editRoute}
            route={editRoute}
            onClose={() => setEditRoute(null)}
            onSubmit={handleEdit}
          />
        )}
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}