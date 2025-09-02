import React, { useEffect, useState } from "react";
import { getAllRoutes, getRouteById } from "../services/routeService";
import { toast } from "react-toastify";

export default function ViewAllRoutes() {
  const [routes, setRoutes] = useState([]);        
  const [searchId, setSearchId] = useState("");    
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  
  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const data = await getAllRoutes();
      
      setRoutes(Array.isArray(data.items) ? data.items : []);
      setError("");
      setCurrentPage(1);
    } catch (err) {
      toast.error("Failed to fetch routes");
      setRoutes([]);
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return fetchRoutes();

    try {
      const route = await getRouteById(searchId);
      if (route) {
        setRoutes([route]); 
        setError("");
        setCurrentPage(1);
      } else {
        setRoutes([]);
        setError("Route not found");
        toast.warning("Route not found");
      }
    } catch (err) {
      setRoutes([]);
      setError("Route not found");
      toast.warning("Route not found");
    }
  };

  
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = routes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(routes.length / itemsPerPage);

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
          maxWidth: "1100px",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2 className="text-center mb-4">All Routes</h2>

        
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
          <input
            type="number"
            className="form-control"
            style={{ maxWidth: "300px" }}
            placeholder="Enter Route ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button className="btn btn-warning" onClick={handleSearch}>
            Search
          </button>
        </div>

        
        <div className="table-responsive">
          <table className="table table-dark table-bordered text-center">
            <thead className="table-light text-dark">
              <tr>
                <th>Route ID</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Fare</th>
                <th>Bus ID</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((r) => (
                  <tr key={r.routeId}>
                    <td>{r.routeId}</td>
                    <td>{r.origin}</td>
                    <td>{r.destination}</td>
                    <td>{r.departureTime}</td>
                    <td>{r.arrivalTime}</td>
                    <td>₹{r.fare}</td>
                    <td>{r.busId}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-light text-center">
                    {error || "No routes found"}
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
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`btn mx-1 ${currentPage === i + 1 ? "btn-primary" : "btn-outline-light"}`}
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
      </div>
    </div>
  );
}
