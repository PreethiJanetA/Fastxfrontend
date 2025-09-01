// import { useEffect, useState } from "react";
// import { useLocation, useParams, useNavigate } from "react-router-dom";
// import {
//   cancelBooking,
//   cancelSelectedSeats,
//   getSeatsForBooking,
// } from "../services/bookingService";
// import { toast } from "react-toastify";

// export default function CancelPage() {
//   const { bookingId } = useParams();
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [seats, setSeats] = useState([]);
//   const [error, setError] = useState("");
//   const [mode] = useState(state?.mode || "booking");
//   const booking = state?.booking;

//   useEffect(() => {
//     if (mode === "seats") {
//       getSeatsForBooking(bookingId)
//         .then((res) => setSeats(res.filter((s) => !s.isCancelled)))
//         .catch(() => setError("Failed to load seat data."));
//     }
//   }, [bookingId, mode]);

//   const handleSeatToggle = (seatId) => {
//     setSelectedSeats((prev) =>
//       prev.includes(seatId)
//         ? prev.filter((id) => id !== seatId)
//         : [...prev, seatId]
//     );
//   };

//   const handleConfirm = async () => {
//     if (mode === "seats" && selectedSeats.length === 0) {
//       toast.info("Please select at least one seat to cancel.");
//       return;
//     }

//     try {
//       if (mode === "booking") {
//         await cancelBooking(booking.bookingId);
//         toast.success("Booking cancelled successfully.");
//       } else if (mode === "seats") {
//         await cancelSelectedSeats({
//           bookingId: booking.bookingId,
//           seatIds: selectedSeats,
//         });
//         toast.success(`${selectedSeats.length} seat(s) cancelled successfully.`);
//       }
//       navigate("/mybookings");
//     } catch (err) {
//       console.error(err);
//       toast.error("Cancellation failed. Try again.");
//     }
//   };

//   return (
//     <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
//       <h2>{mode === "booking" ? "Cancel Booking" : "Cancel Seats"}</h2>
//       <p>
//         Booking ID: {bookingId} <br />
//         Route: {booking?.origin} → {booking?.destination}
//       </p>

//       {mode === "seats" && (
//         <>
//           <h4>Select seats to cancel:</h4>
//           {seats.map((seat) => (
//             <div key={seat.seatId}>
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={selectedSeats.includes(seat.seatId)}
//                   onChange={() => handleSeatToggle(seat.seatId)}
//                 />
//                 Seat {seat.seatNumber}
//               </label>
//             </div>
//           ))}
//         </>
//       )}

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <button className="btn btn-danger mt-3" onClick={handleConfirm}>
//         {mode === "booking" ? "Cancel Booking" : "Cancel Selected Seats"}
//       </button>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function CancelPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`http://localhost:5152/api/Booking/${bookingId}`);
        setBooking(response.data);
      } catch (error) {
        toast.error("Failed to fetch booking details.");
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handleSeatToggle = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleCancelBooking = async () => {
    try {
      await axios.put(`http://localhost:5152/api/Booking/cancel/${bookingId}`);
      toast.success("Booking cancelled successfully. Refund request created.");
      navigate("/mybookings");
    } catch (error) {
      toast.error(error.response?.data || "Failed to cancel booking.");
    }
  };

  const handleCancelSelectedSeats = async () => {
    if (selectedSeats.length === 0) {
      toast.warning("Please select at least one seat to cancel.");
      return;
    }

    try {
      await axios.put(`http://localhost:5152/api/Booking/cancel-seats`, {
        bookingId: parseInt(bookingId),
        seatIds: selectedSeats,
      });
      toast.success("Selected seats cancelled successfully. Refund request created.");
      navigate("/mybookings");
    } catch (error) {
      toast.error(error.response?.data || "Failed to cancel selected seats.");
    }
  };

  if (!booking) {
    return <div className="container mt-5">Loading booking details...</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Cancel Booking</h2>
      <p><strong>Booking ID:</strong> {booking.bookingId}</p>
      <p><strong>Route:</strong> {booking.route.origin} → {booking.route.destination}</p>
      <p><strong>Total Seats:</strong> {booking.noOfSeats}</p>
      <p><strong>Total Fare:</strong> ₹{booking.totalFare}</p>

      <h4 className="mt-4">Seats</h4>
      <div className="d-flex flex-wrap">
        {booking.bookingSeats.map((bs) => (
          <div key={bs.seatId} className="form-check m-2">
            <input
              type="checkbox"
              className="form-check-input"
              id={`seat-${bs.seatId}`}
              checked={selectedSeats.includes(bs.seatId)}
              onChange={() => handleSeatToggle(bs.seatId)}
            />
            <label htmlFor={`seat-${bs.seatId}`} className="form-check-label">
              Seat {bs.seat.seatNumber}
            </label>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button className="btn btn-danger me-3" onClick={handleCancelBooking}>
          Cancel Full Booking
        </button>
        <button className="btn btn-warning" onClick={handleCancelSelectedSeats}>
          Cancel Selected Seats
        </button>
      </div>
    </div>
  );
}
