import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSeatsByRoute } from "../services/seatService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ViewSeats() {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  console.log("Current seats state:", seats);

  useEffect(() => {
    const fetchSeats = async () => {
      setIsLoading(true);
      try {
        const data = await getSeatsByRoute(routeId, 1, 50);
        console.log("API response data:", data);

        if (Array.isArray(data)) {
          setSeats(data);
        } else if (data && Array.isArray(data.items)) {
          setSeats(data.items);
        } else {
          setSeats([]);
        }

        setError("");
      } catch (err) {
        setError("Failed to load seats.");
        toast.error("Error loading seat data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSeats();
  }, [routeId]);

  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleProceedBooking = () => {
    if (selectedSeats.length === 0) {
      toast.warning("Please select at least one seat.");
      return;
    }

    // ✅ Get full seat objects for the selected ones
    const selectedSeatsData = seats.filter((seat) =>
      selectedSeats.includes(seat.seatId)
    );

    navigate(`/book-ticket/${routeId}`, {
      state: {
        selectedSeatIds: selectedSeatsData.map((seat) => seat.seatId),
        selectedSeatNumbers: selectedSeatsData.map((seat) => seat.seatNumber),
      },
    });
  };

  const renderSeatRows = (seatGroup) => {
    const seatRows = [];
    for (let i = 0; i < seatGroup.length; i += 4) {
      seatRows.push(seatGroup.slice(i, i + 4));
    }

    return seatRows.map((row, rowIndex) => (
      <div
        key={rowIndex}
        style={{ display: "flex", justifyContent: "center", gap: "10px" }}
      >
        {row.map((seat, index) => (
          <React.Fragment key={seat.seatId}>
            {index === 2 && <div style={{ width: "30px" }}></div>}
            <button
              onClick={() => toggleSeat(seat.seatId)}
              disabled={seat.isBooked}
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: seat.isBooked
                  ? "#888"
                  : selectedSeats.includes(seat.seatId)
                  ? "#28a745"
                  : "#fff",
                color: seat.isBooked
                  ? "#fff"
                  : selectedSeats.includes(seat.seatId)
                  ? "#fff"
                  : "#000",
                border: "1px solid #000",
                borderRadius: "5px",
                cursor: seat.isBooked ? "not-allowed" : "pointer",
              }}
            >
              {seat.seatNumber}
            </button>
          </React.Fragment>
        ))}
      </div>
    ));
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
      {isLoading ? (
        <p className="text-white text-center">Loading seats...</p>
      ) : (
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
          <h3 className="text-center mb-4">Select Your Seats</h3>
          {error && <p className="text-danger text-center">{error}</p>}
          {seats.length > 0 ? (
            <div className="mt-4">
              <h5 className="text-white mb-2 text-center">Available Seats</h5>
              {renderSeatRows(seats)}
            </div>
          ) : (
            <p className="text-center">No seats found for this route.</p>
          )}

          <div className="text-center mt-4">
            <p>Selected Seats: {selectedSeats.length}</p>
            <button
              className="btn btn-warning"
              onClick={handleProceedBooking}
              disabled={selectedSeats.length === 0}
            >
              Proceed to Booking
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

