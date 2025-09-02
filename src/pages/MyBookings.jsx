import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getBookingsByuserId,
  getBookingById,
  cancelBooking,
} from "../services/bookingService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [bookingId, setBookingId] = useState("");
  const navigate = useNavigate();
  const fetchMyBookings = async () => {
    try {
      // Assuming your backend service needs the userId for this call
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("User ID not found. Please log in.");
        return;
      }
      const data = await getBookingsByuserId(userId);
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      //toast.error("Error loading your bookings.");
    }
  };

  const handleSearch = async () => {
    if (!bookingId.trim()) return;

    try {
      const booking = await getBookingById(bookingId);
      setBookings([booking]);
    } catch (err) {
      console.error(err);
      toast.info("No booking found for this ID.");
      setBookings([]);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await cancelBooking(id);
        toast.success("Booking cancelled successfully.");
        fetchMyBookings(); // Reload bookings after a successful cancellation
        navigate(`/cancel/${bookingId}`);
      } catch (err) {
        console.error(err);
        toast.error("Failed to cancel booking.");
      }
    }
  };

  const handleReset = () => {
    setBookingId("");
    fetchMyBookings();
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage: `url('https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/58cf8758-02e9-4d59-970f-211df3402f18.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        padding: "2rem",
        overflowY: "auto",
      }}
    >
      <div
        className="p-4"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "#fff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "1000px",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2 className="text-center mb-4">My Bookings</h2>

        <div className="d-flex flex-wrap gap-2 justify-content-center mb-4">
          <input
            type="number"
            placeholder="Search by Booking ID"
            className="form-control"
            style={{ maxWidth: "250px" }}
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
          />
          <button className="btn btn-warning" onClick={handleSearch}>
            Search
          </button>
          <button className="btn btn-secondary" onClick={handleReset}>
            Reset
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-dark table-striped table-bordered text-center">
            <thead className="table-light text-dark">
              <tr>
                <th>Booking ID</th>
                <th>Route ID</th>
                <th>No. of Seats</th>
                <th>Total Fare</th>
                <th>Status</th>
                <th>Booking Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((b) => (
                  <tr key={b.bookingId}>
                    <td>{b.bookingId}</td>
                    <td>{b.routeId}</td>
                    <td>{b.noOfSeats}</td>
                    <td>₹{b.totalFare}</td>
                    <td>{b.status}</td>
                    <td>{new Date(b.bookingDate).toLocaleString()}</td>
                    <td>
                      {b.status === "Completed" && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancel(b.bookingId)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-muted">
                    No bookings to show
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}


