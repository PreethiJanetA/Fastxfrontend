// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import { processPayment } from "../services/paymentService";
// import { getBookingById } from "../services/bookingService";

// export default function PaymentPage() {
//   const { bookingId } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);
//   const [bookingDetails, setBookingDetails] = useState(null);

//   useEffect(() => {
//     const fetchBookingDetails = async () => {
//       if (!bookingId) {
//         toast.error("No booking ID found.");
//         navigate("/my-bookings");
//         return;
//       }
//       try {
//         const details = await getBookingById(bookingId);
//         setBookingDetails(details);
//       } catch (err) {
//         toast.error("Failed to load booking details.");
//         navigate("/my-bookings");
//       }
//     };
//     fetchBookingDetails();
//   }, [bookingId, navigate]);

//   const handlePayment = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const user = JSON.parse(localStorage.getItem("user"));
//     if (!user || !user.userId) {
//       toast.error("User not authenticated.");
//       navigate("/login");
//       setLoading(false);
//       return;
//     }

//     const paymentData = {
//       bookingId: parseInt(bookingId),
//       userId: user.userId,
//       amount: bookingDetails.totalFare,
//       paymentMethod: "Credit Card",
//       paymentDate: new Date().toISOString(),
//     };

//     try {
//       await processPayment(paymentData);
//       toast.success("Payment successful! Your booking is confirmed.");
//       navigate("/payment-success", {
//   state: {
//     bookingId: bookingDetails.bookingId,
//     amount: bookingDetails.totalFare,
//     routeId: bookingDetails.routeId,
//     seats: bookingDetails.noOfSeats
//   },
// });
//     } catch (err) {
//       console.error("Payment failed", err);
//       toast.error("Payment failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!bookingDetails) {
//     return (
//       <div className="text-center p-5 text-white">
//         <h3>Loading booking details...</h3>
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         width: "100vw",
//         backgroundImage: `url('https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/58cf8758-02e9-4d59-970f-211df3402f18.png')`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         padding: "2rem",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         overflowY: "auto",
//       }}
//     >
//       <div
//         className="p-4"
//         style={{
//           backgroundColor: "rgba(0, 0, 0, 0.7)",
//           color: "#fff",
//           borderRadius: "16px",
//           width: "100%",
//           maxWidth: "600px",
//           backdropFilter: "blur(10px)",
//         }}
//       >
//         <h2 className="text-center mb-4">Confirm & Pay</h2>
//         <div className="card bg-light text-dark mb-4">
//           <div className="card-body">
//             <h5 className="card-title">Booking Summary</h5>
//             <p><strong>Booking ID:</strong> {bookingDetails.bookingId}</p>
//             <p><strong>Route:</strong> {bookingDetails.routeId}</p>
//             <p><strong>Number of Seats:</strong> {bookingDetails.noOfSeats}</p>
//             <h4 className="mt-3"><strong>Total Fare:</strong> ₹{bookingDetails.totalFare}</h4>
//           </div>
//         </div>

//         <form onSubmit={handlePayment}>
//           <h4 className="mb-3">Payment Now</h4>
          
//           <div className="d-grid gap-2">
//             <button className="btn btn-success" type="submit" disabled={loading}>
//               {loading ? "Processing..." : `Pay ₹${bookingDetails.totalFare}`}
//             </button>
//           </div>
//         </form>
//       </div>
//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { processPayment } from "../services/paymentService";
import { getBookingById } from "../services/bookingService";

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        toast.error("No booking ID found.");
        navigate("/my-bookings");
        return;
      }
      try {
        const details = await getBookingById(bookingId);
        setBookingDetails(details);
      } catch (err) {
        toast.error("Failed to load booking details.");
        navigate("/my-bookings");
      }
    };
    fetchBookingDetails();
  }, [bookingId, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    
     const user = JSON.parse(localStorage.getItem("user")); 

    const paymentData = {
      bookingId: parseInt(bookingId),
      userId: user?.userId || 0,
      amount: bookingDetails.totalFare, 
      paymentMethod: "Credit Card",
      paymentDate: new Date().toISOString(),
    };

    try {
      // Call backend to process payment
      await processPayment(paymentData);

      toast.success("Payment successful! Your booking is confirmed.");

      // Navigate to PaymentSuccess page with details
      navigate("/payment-success", { state: bookingDetails });
    } catch (err) {
      console.error("Payment failed", err);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!bookingDetails) {
    return (
      <div className="text-center p-5 text-white">
        <h3>Loading booking details...</h3>
      </div>
    );
  }

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
        alignItems: "center",
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
          maxWidth: "600px",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2 className="text-center mb-4">Confirm & Pay</h2>
        <div className="card bg-light text-dark mb-4">
          <div className="card-body">
            <h5 className="card-title">Booking Summary</h5>
            <p><strong>Booking ID:</strong> {bookingDetails.bookingId}</p>
            <p><strong>Route:</strong> {bookingDetails.routeId}</p>
            <p><strong>Number of Seats:</strong> {bookingDetails.noOfSeats}</p>
            <h4 className="mt-3"><strong>Total Fare:</strong> ₹{bookingDetails.totalFare}</h4>
          </div>
        </div>
        <form onSubmit={handlePayment}>
          <h4 className="mb-3">Payment Now</h4>
          <div className="d-grid gap-2">
            <button className="btn btn-success" type="submit" disabled={loading}>
              {loading ? "Processing..." : `Pay ₹${bookingDetails.totalFare}`}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
