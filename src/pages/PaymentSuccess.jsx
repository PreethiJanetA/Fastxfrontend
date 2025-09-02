import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getPaymentByBookingId } from "../services/paymentService";
import { generateTicketPDF } from "../utils/pdfGenerator";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = location.state || {};

  const [payment, setPayment] = useState(null);

  useEffect(() => {
    if (!bookingId) {
      navigate("/");
      return;
    }

    const fetchPayment = async () => {
      try {
        const data = await getPaymentByBookingId(bookingId);
        setPayment(data);
      } catch (error) {
        console.error("Failed to fetch payment:", error);
      }
    };

    fetchPayment();
  }, [bookingId, navigate]);

  const handleDownloadTicket = () => {
    if (payment) {
      generateTicketPDF({
        bookingId: payment.bookingId,
        userId: payment.userId,
        routeId: payment.routeId,
        bookingDate: payment.paymentDate,
        amountPaid: payment.amount,
        status: payment.paymentStatus,
      });
    }
  };
  if (!payment) {
    return (
      <div className="text-center p-5 text-white">
        <h3>Loading payment details...</h3>
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
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "#fff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "600px",
          padding: "2rem",
          backdropFilter: "blur(10px)",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#4ade80" }}>
          🎉 Payment Successful!
        </h1>
        <p style={{ marginTop: "1rem", fontSize: "1.1rem" }}>
          Your booking has been confirmed.
        </p>

        <div style={{ marginTop: "1.5rem", textAlign: "left" }}>
          <p><strong>Booking ID:</strong> {payment.bookingId}</p>
          <p><strong>Payment ID:</strong> {payment.paymentId}</p>
          <p><strong>Amount Paid:</strong> ₹{payment.amount}</p>
          <p><strong>Method:</strong> {payment.paymentMethod}</p>
          <p><strong>Status:</strong> {payment.paymentStatus}</p>
          <p><strong>Date:</strong> {new Date(payment.paymentDate).toLocaleString()}</p>
          <button
  className="btn btn-danger mt-3"
  onClick={() => navigate(`/my-bookings`)}
>
  Cancel Booking
</button>
        </div>
         <button onClick={handleDownloadTicket}style={{
            marginTop: "2rem",
            padding: "0.5rem 2rem",
            backgroundColor: "#2563eb",
            color: "#fff",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}>Download Ticket PDF</button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
