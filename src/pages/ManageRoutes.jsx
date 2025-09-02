import React, { useEffect, useState } from "react";
import {
  getAllRoutes,
  getRouteById,
  addRoute,
  updateRoute,
  deleteRoute,
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
  const [searchedRoute, setSearchedRoute] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const routesPerPage = 5;

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      const data = await getAllRoutes();
      setRoutes(data);
    } catch (err) {
      setError("Failed to load routes.");
    }
  };

  const handleAdd = async (route) => {
    try {
      await addRoute(route);
      toast.success("Route added successfully!");
      setShowAdd(false);
      loadRoutes();
    } catch (err) {
      toast.error("Failed to add route.");
    }
  };

  const handleEdit = async (route) => {
    try {
      await updateRoute(route.routeId, route);
      toast.success("Route updated successfully!");
      setEditRoute(null);
      loadRoutes();
    } catch (err) {
      toast.error("Failed to update route.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      try {
        await deleteRoute(id);
        toast.success("Route deleted successfully.");
        loadRoutes();
      } catch {
        toast.error("Failed to delete route.");
      }
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setSearchError("Please enter a Route ID.");
      return;
    }
    try {
      const data = await getRouteById(searchId);
      setSearchedRoute(data);
      setSearchError("");
    } catch {
      setSearchedRoute(null);
      setSearchError("Route not found.");
      toast.info("No route found for the given ID.");
    }
  };

  const clearSearch = () => {
    setSearchId("");
    setSearchedRoute(null);
    setSearchError("");
  };

  const paginatedRoutes = Array.isArray(routes)
    ? routes.slice((currentPage - 1) * routesPerPage, currentPage * routesPerPage)
    : [];

  const totalPages = Math.ceil(routes.length / routesPerPage);

  return (
    <div style={{
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
    }}>
      <div className="p-4" style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderRadius: "16px",
        color: "#fff",
        width: "100%",
        maxWidth: "1100px",
        backdropFilter: "blur(10px)",
      }}>
        <h2 className="text-center mb-4">Manage Routes</h2>
        {error && <p className="text-danger">{error}</p>}

        {/* Search */}
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
            <button className="btn btn-warning" onClick={handleSearch}>Search</button>
            <button className="btn btn-secondary" onClick={clearSearch}>Clear</button>
          </div>
          {searchError && <small className="text-danger mt-1 d-block">{searchError}</small>}
        </div>

        {/* Search Result */}
        {searchedRoute && (
          <div className="mb-4">
            <h5>Search Result:</h5>
            <table className="table table-bordered table-dark table-striped">
              <thead className="table-light text-dark">
                <tr>
                  <th>ID</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Travel Date</th>
                  <th>Fare</th>
                  <th>Bus ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{searchedRoute.routeId}</td>
                  <td>{searchedRoute.origin}</td>
                  <td>{searchedRoute.destination}</td>
                  <td>{searchedRoute.departureTime}</td>
                  <td>{searchedRoute.arrivalTime}</td>
                  <td>{searchedRoute.travelDate}</td>
                  <td>{searchedRoute.fare}</td>
                  <td>{searchedRoute.busId}</td>
                  <td>
                    <button className="btn btn-primary btn-sm me-2" onClick={() => setEditRoute(searchedRoute)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(searchedRoute.routeId)}>Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* All Routes */}
        {!searchedRoute && (
          <>
            <button className="btn btn-success mb-3" onClick={() => setShowAdd(true)}>Add New Route</button>

            <div className="table-responsive">
              <table className="table table-dark table-bordered table-striped text-center">
                <thead className="table-light text-dark">
                  <tr>
                    <th>ID</th>
                    <th>Origin</th>
                    <th>Destination</th>
                    <th>Departure</th>
                    <th>Arrival</th>
                    <th>Travel Date</th>
                    <th>Fare</th>
                    <th>Bus ID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRoutes.map((route) => (
                    <tr key={route.routeId}>
                      <td>{route.routeId}</td>
                      <td>{route.origin}</td>
                      <td>{route.destination}</td>
                      <td>{route.departureTime}</td>
                      <td>{route.arrivalTime}</td>
                      <td>{route.travelDate}</td>
                      <td>{route.fare}</td>
                      <td>{route.busId}</td>
                      <td>
                        <button className="btn btn-primary btn-sm me-2" onClick={() => setEditRoute(route)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(route.routeId)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {routes.length > routesPerPage && (
              <div className="d-flex justify-content-center mt-3">
                <button className="btn btn-light mx-1" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} className={`btn mx-1 ${currentPage === i + 1 ? "btn-primary" : "btn-outline-light"}`} onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </button>
                ))}
                <button className="btn btn-light mx-1" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
              </div>
            )}
          </>
        )}

        {/* Modals */}
        {showAdd && <AddRouteModal show={showAdd} onClose={() => setShowAdd(false)} onSubmit={handleAdd} />}
        {editRoute && <EditRouteModal show={!!editRoute} route={editRoute} onClose={() => setEditRoute(null)} onSubmit={handleEdit} />}
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}
