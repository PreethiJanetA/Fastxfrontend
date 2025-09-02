
import React, { useEffect, useState } from "react";
import {
  getAllBookings,
  getBookingById,
  getBookingsByBusId,
  cancelBooking,
} from "../services/bookingService";
import { getUserById } from "../services/userService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchedBooking, setSearchedBooking] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;
  const busId = user?.busId;

  const loadBookings = async () => {
    try {
      let data = [];
      if (userRole === "Bus Operator" && busId) {
        
        data = await getBookingsByBusId(busId);
      } else if (userRole === "Admin") {
        
        data = await getAllBookings();
      }

      const validBookings = Array.isArray(data)
        ? data.filter((b) => b.isDeleted === 0)
        : [];

      setBookings(validBookings);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load bookings.");
      setBookings([]);
      toast.error("Failed to load bookings.");
    }
  };

  useEffect(() => {
    loadBookings();
  }, [userRole, busId]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await cancelBooking(id);
        toast.success("Booking Cancelled successfully.");
        if (searchedBooking) {
          setSearchedBooking(null);
          setSearchId("");
        }
        loadBookings();
      } catch (err) {
        toast.error("Failed to cancel booking.");
      }
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setSearchError("Please enter a Booking ID.");
      return;
    }
    try {
      const data = await getBookingById(searchId);

      if (!data || data.isDeleted === 1) {
        setSearchedBooking(null);
        setSearchError("Booking not found or deleted.");
        toast.info("No booking found.");
        return;
      }

      if (
        userRole === "Bus Operator" &&
        busId &&
        data.routeBusId !== parseInt(busId, 10)
      ) {
        setSearchedBooking(null);
        setSearchError("Booking not found in your bus routes.");
        toast.error("This booking does not belong to your bus.");
        return;
      }

      setSearchedBooking(data);
      setSearchError("");
    } catch (err) {
      setSearchedBooking(null);
      setSearchError("Booking not found.");
      toast.info("No booking found for the given ID.");
    }
  };

  const clearSearch = () => {
    setSearchId("");
    setSearchedBooking(null);
    setSearchError("");
  };

  const displayList = Array.isArray(searchedBooking ? [searchedBooking] : bookings)
    ? searchedBooking
      ? [searchedBooking]
      : bookings
    : [];

  const totalPages = Math.ceil(bookings.length / bookingsPerPage);
  const paginatedBookings = Array.isArray(bookings)
    ? bookings.slice(
        (currentPage - 1) * bookingsPerPage,
        currentPage * bookingsPerPage
      )
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
        <h2 className="text-center mb-4">Manage Bookings</h2>
        {error && <p className="text-danger">{error}</p>}

        <div className="mb-4">
          <label>Search Booking by ID:</label>
          <div className="d-flex gap-2 mt-2 flex-wrap">
            <input
              type="number"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Booking ID"
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

        {searchedBooking && (
          <div className="mb-4">
            <h5>Search Result:</h5>
            <table className="table table-bordered table-dark table-striped">
              <thead className="table-light text-dark">
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Route ID</th>
                  <th>No. of Seats</th>
                  <th>Total Fare</th>
                  <th>Status</th>
                  <th>Booking Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{searchedBooking.bookingId}</td>
                  <td>{searchedBooking.userId}</td>
                  <td>{searchedBooking.routeId}</td>
                  <td>{searchedBooking.noOfSeats}</td>
                  <td>₹{searchedBooking.totalFare}</td>
                  <td>{searchedBooking.status}</td>
                  <td>{new Date(searchedBooking.bookingDate).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(searchedBooking.bookingId)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {!searchedBooking && (
          <>
            <div className="table-responsive">
              <table className="table table-dark table-bordered table-striped text-center">
                <thead className="table-light text-dark">
                  <tr>
                    <th>ID</th>
                    <th>User ID</th>
                    <th>Route ID</th>
                    <th>No. of Seats</th>
                    <th>Total Fare</th>
                    <th>Status</th>
                    <th>Booking Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBookings.map((b) => (
                    <tr key={b.bookingId}>
                      <td>{b.bookingId}</td>
                      <td>{b.userId}</td>
                      <td>{b.routeId}</td>
                      <td>{b.noOfSeats}</td>
                      <td>₹{b.totalFare}</td>
                      <td>{b.status}</td>
                      <td>{new Date(b.bookingDate).toLocaleString()}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(b.bookingId)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {bookings.length > bookingsPerPage && (
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

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}
