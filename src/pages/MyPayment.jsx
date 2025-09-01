import React, { useEffect, useState } from "react";
import { getPaymentByBookingId, getPaymentsByUser } from "../services/paymentService";
import { toast } from "react-toastify";

export default function MyPayment() {
  const [payments, setPayments] = useState([]);
  const [bookingId, setBookingId] = useState("");

  const fetchMyPayments = async () => {
    try {
      const data = await getPaymentsByUser();
      setPayments(data);
    } catch (err) {
      console.error(err);
      toast.error("Error loading your payments.");
    }
  };

  const handleSearch = async () => {
    if (!bookingId.trim()) return;

    try {
      const payment = await getPaymentByBookingId(bookingId);
      setPayments([payment]);
    } catch (err) {
      console.error(err);
      toast.info("No payment found for this Booking ID.");
      setPayments([]);
    }
  };

  const handleReset = () => {
    setBookingId("");
    fetchMyPayments();
  };

  useEffect(() => {
    fetchMyPayments();
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
        <h2 className="text-center mb-4">My Payments</h2>

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
                <th>Payment ID</th>
                <th>Booking ID</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                payments.map((p) => (
                  <tr key={p.paymentId}>
                    <td>{p.paymentId}</td>
                    <td>{p.bookingId}</td>
                    <td>₹{p.amount}</td>
                    <td>{p.paymentMethod}</td>
                    <td>{p.status}</td>
                    <td>{new Date(p.paymentDate).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-muted">
                    No payments to show
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}