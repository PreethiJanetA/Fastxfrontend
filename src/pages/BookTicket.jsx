import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { bookTicket } from "../services/bookingService"; 

export default function BookTicket() {
  const { routeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedSeatIds = [], selectedSeatNumbers = [] } = location.state || {};
  const [bookingDetails, setBookingDetails] = useState(null);

  const handleConfirmBooking = async () => {
  if (selectedSeatIds.length === 0) {
    toast.warning("No seats selected!");
    return;
  }

  const userId = localStorage.getItem("userId");
  const payload = {
    userId: parseInt(userId),
    routeId: parseInt(routeId),
    seatNumbers: selectedSeatNumbers.map(String), 
  };

  console.log("Payload being sent:", payload);
  try {
  const response = await bookTicket(payload);
  console.log("Booking API Response:", response);

  let bookingId = null;

  // Case 1: backend returns string "Ticket booked successfully. Booking ID: 19"
  if (typeof response === "string") {
    const match = response.match(/Booking ID:\s*(\d+)/);
    if (match) {
      bookingId = match[1];
    }
  }

  // Case 2: backend returns proper JSON { bookingId: 19, ... }
  if (response && response.bookingId) {
    bookingId = response.bookingId;
  }

  if (bookingId) {
    toast.success(`Booking Confirmed! ID: ${bookingId}`);
    setTimeout(() => {
      navigate(`/payment/${bookingId}`);
    }, 1500);
  } else {
    toast.success("Booking Confirmed!");
  }
} catch (error) {
  console.error("Booking failed:", error.response?.data || error.message);
  toast.error("Booking failed. Try again.");
}

};

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        margin: 0,
        padding: "2rem",
        backgroundImage: `url('https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/58cf8758-02e9-4d59-970f-211df3402f18.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          borderRadius: "16px",
          padding: "2rem",
          color: "white",
          maxWidth: "600px",
          width: "100%",
          backdropFilter: "blur(6px)",
        }}
      >
        <h3 className="text-center mb-4">Confirm Your Booking</h3>

        {selectedSeatIds.length > 0 ? (
          <div className="text-center">
            <p>
              <strong>Route ID:</strong> {routeId}
            </p>
            <p>
              <strong>Selected Seats:</strong> {selectedSeatNumbers.join(", ")}
            </p>
            <p>
              <strong>Total Seats:</strong> {selectedSeatIds.length}
            </p>

            {bookingDetails && (
              <div style={{ marginTop: "1rem" }}>
                <p style={{ color: "#4caf50", fontWeight: "bold" }}>
                  ✅ Booking ID: {bookingDetails.bookingId}
                </p>
                <p>
                  <strong>Payment Status:</strong> {bookingDetails.paymentStatus}
                </p>
                <p>
                  <strong>Total Fare:</strong> ₹{bookingDetails.totalFare}
                </p>
              </div>
            )}

            <button
              className="btn btn-success mt-3"
              onClick={handleConfirmBooking}
            >
              Confirm Booking
            </button>
          </div>
        ) : (
          <p className="text-center">
            No seats selected. Please go back and choose seats.
          </p>
        )}
      </div>

      <ToastContainer position="top-center" autoClose={2500} />
    </div>
  );
}