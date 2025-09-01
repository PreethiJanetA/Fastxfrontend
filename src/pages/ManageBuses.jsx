import React, { useEffect, useState } from "react";
import {
  getAllBuses,
  getBusById,
  addBus,
  updateBus,
  deleteBus,
} from "../services/busService";
import AddBusModal from "../Components/AddBusModal";
import EditBusModal from "../Components/EditBusModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageBuses() {
  const [buses, setBuses] = useState([]);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editBus, setEditBus] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchedBus, setSearchedBus] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const busesPerPage = 5;

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    try {
      const data = await getAllBuses();
      setBuses(data);
    } catch (err) {
      setError("Failed to load buses.");
    }
  };

  const handleAdd = async (bus) => {
    try {
      await addBus(bus);
      toast.success("Bus added successfully!");
      setShowAdd(false);
      loadBuses();
    } catch (err) {
      toast.error("Failed to add bus.");
    }
  };

  const handleEdit = async (bus) => {
    try {
      await updateBus(bus.busId, bus);
      toast.success("Bus updated successfully!");
      setEditBus(null);
      loadBuses();
    } catch (err) {
      toast.error("Failed to update bus.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this bus?")) {
      try {
        await deleteBus(id);
        toast.success("Bus deleted successfully.");
        loadBuses();
      } catch {
        toast.error("Failed to delete bus.");
      }
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setSearchError("Please enter a Bus ID.");
      return;
    }
    try {
      const data = await getBusById(searchId);
      setSearchedBus(data);
      setSearchError("");
    } catch {
      setSearchedBus(null);
      setSearchError("Bus not found.");
      toast.info("No bus found for the given ID.");
    }
  };

  const clearSearch = () => {
    setSearchId("");
    setSearchedBus(null);
    setSearchError("");
  };

  const paginatedBuses = Array.isArray(buses)? buses.slice(
    (currentPage - 1) * busesPerPage,
    currentPage * busesPerPage
  ):[];

  const totalPages = Math.ceil(buses.length / busesPerPage);

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
        <h2 className="text-center mb-4">Manage Buses</h2>
        {error && <p className="text-danger">{error}</p>}


        <div className="mb-4">
          <label>Search Bus by ID:</label>
          <div className="d-flex gap-2 mt-2 flex-wrap">
            <input
              type="number"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Bus ID"
              className="form-control"
              style={{ maxWidth: "250px" }}
            />
            <button className="btn btn-warning" onClick={handleSearch}>
              Search
            </button>
            <button className="btn btn-secondary" onClick={clearSearch}>
              Clear
            </button>
          </div>
          {searchError && (
            <small className="text-danger mt-1 d-block">{searchError}</small>
          )}
        </div>

        
        {searchedBus && (
          <div className="mb-4">
            <h5>Search Result:</h5>
            <table className="table table-bordered table-dark table-striped">
              <thead className="table-light text-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Number</th>
                  <th>Type</th>
                  <th>Seats</th>
                  <th>Amenities</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{searchedBus.busId}</td>
                  <td>{searchedBus.busName}</td>
                  <td>{searchedBus.busNumber}</td>
                  <td>{searchedBus.busType}</td>
                  <td>{searchedBus.totalSeats}</td>
                  <td>{searchedBus.amenities}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => setEditBus(searchedBus)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(searchedBus.busId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        
        {!searchedBus && (
          <>
            <button
              className="btn btn-success mb-3"
              onClick={() => {console.log("setting showadd to true"); setShowAdd(true);}}
            >
              Add New Bus
            </button>

            <div className="table-responsive">
              <table className="table table-dark table-bordered table-striped text-center">
                <thead className="table-light text-dark">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Number</th>
                    <th>Type</th>
                    <th>Seats</th>
                    <th>Amenities</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBuses.map((bus) => (
                    <tr key={bus.busId}>
                      <td>{bus.busId}</td>
                      <td>{bus.busName}</td>
                      <td>{bus.busNumber}</td>
                      <td>{bus.busType}</td>
                      <td>{bus.totalSeats}</td>
                      <td>{bus.amenities}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => setEditBus(bus)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(bus.busId)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

           
            {buses.length > busesPerPage && (
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
                      currentPage === i + 1
                        ? "btn-primary"
                        : "btn-outline-light"
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
          </>
        )}

        
        {showAdd && (
          <AddBusModal
            show={showAdd}
            onClose={() => setShowAdd(false)}
            onSubmit={handleAdd}
          />
        )}
        {editBus && (
          <EditBusModal
            show={!!editBus}
            bus={editBus}
            onClose={() => setEditBus(null)}
            onSubmit={handleEdit}
          />
        )}
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}


