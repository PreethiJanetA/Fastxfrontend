import React, { useEffect, useState } from "react";
import { getAllBuses, getBusById } from "../services/busService";
import { toast } from "react-toastify";

export default function ViewAllBuses() {
  const [buses, setBuses] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const data = await getAllBuses();
      
      const busArray = Array.isArray(data) ? data : data.items || [];
      setBuses(busArray);
      setError("");
    } catch (err) {
      setError("Failed to fetch buses.");
      toast.error("Failed to fetch buses.");
    }
  };

  const handleSearch = async () => {
    const trimmedId = searchId.trim();
    if (!trimmedId) return fetchBuses();

    try {
      const bus = await getBusById(trimmedId);
      setBuses(bus ? [bus] : []);
      setError(bus ? "" : "Bus not found.");
      setCurrentPage(1);
    } catch (err) {
      setBuses([]);
      setError("Bus not found.");
      toast.error("Bus not found.");
    }
  };

  
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = buses.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(buses.length / itemsPerPage);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url('https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/58cf8758-02e9-4d59-970f-211df3402f18.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "2rem",
      }}
    >
      <div
        className="p-4"
        style={{
          marginTop: "2rem",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "#fff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "900px",
          backdropFilter: "blur(8px)",
          boxShadow: "0 0 15px rgba(0,0,0,0.5)",
        }}
      >
        <h2 className="text-center mb-4">All Buses</h2>

        
        <div className="d-flex mb-4 justify-content-center gap-2">
          <input
            type="number"
            className="form-control"
            placeholder="Enter Bus ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={{ maxWidth: "200px" }}
          />
          <button className="btn btn-warning" onClick={handleSearch}>
            Search
          </button>
        </div>

        
        <div className="table-responsive">
          <table className="table table-bordered table-hover table-dark table-striped">
            <thead className="table-light text-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Number</th>
                <th>Type</th>
                <th>Seats</th>
                <th>Amenities</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((bus) => (
                  <tr key={bus.busId}>
                    <td>{bus.busId}</td>
                    <td>{bus.busName}</td>
                    <td>{bus.busNumber}</td>
                    <td>{bus.busType}</td>
                    <td>{bus.totalSeats}</td>
                    <td>{bus.amenities}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-light">
                    {error || "No buses found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-3">
            <button
              className="btn btn-light mx-1"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
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
              className="btn btn-light mx-1"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
