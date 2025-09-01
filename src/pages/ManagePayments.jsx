import React, { useEffect, useState } from "react";
import {
  getAllPayments,
  getPaymentByBookingId,
  getPaymentsByUser,
} from "../services/paymentService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManagePayments() {
  const [payments, setPayments] = useState([]);
  const [bookingId, setBookingId] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const totalPages = Math.ceil(payments.length / recordsPerPage);
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = payments.slice(indexOfFirst, indexOfLast);

  const loadAllPayments = async () => {
    try {
      const data = await getAllPayments();
      setPayments(Array.isArray(data) ? data : []);
      setError("");
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch payments.");
      toast.error("Failed to fetch payments.");
      setPayments([]);

    }
  };

  const handleSearchByBooking = async () => {
    if (!bookingId.trim()) return;
    try {
      const payment = await getPaymentByBookingId(bookingId);
      setPayments(payment ? [payment] : []);
      setError("");
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setPayments([]);
      setError("");
      toast.info("No payment found for this Booking ID.");
    }
  };

  const handleSearchByUser = async () => {
  if (!userId.trim()) {
    setError("");
    toast.warning("Please enter a User ID.");
    return;
  }

  try {
    const response = await getPaymentsByUser(userId); 
    const paymentsArray = response.data?.items || []; 
    setPayments(paymentsArray);
    setError("");
    setCurrentPage(1);
  } catch (err) {
    console.error(err);
    setPayments([]);
    setError("");
    toast.info("No payments found for the given User ID.");
  }
};


  const handleReset = () => {
    setBookingId("");
    setUserId("");
    setError("");
    loadAllPayments();
  };

  useEffect(() => {
    loadAllPayments();
  }, []);

  return (
    <>
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
          <h2 className="text-center mb-4">Manage Payments</h2>

          <div className="d-flex flex-wrap gap-2 mb-4">
            <input
              type="number"
              placeholder="Search by Booking ID"
              className="form-control"
              style={{ maxWidth: "200px" }}
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
            />
            <button className="btn btn-warning" onClick={handleSearchByBooking}>
              Search Booking
            </button>

            <input
              type="number"
              placeholder="Search by User ID"
              className="form-control"
              style={{ maxWidth: "200px" }}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <button className="btn btn-success" onClick={handleSearchByUser}>
              Search User
            </button>

            <button className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>

          {error && <p className="text-danger">{error}</p>}

          <div className="table-responsive">
            <table className="table table-dark table-bordered table-striped text-center">
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
                {currentRecords.length > 0 ? (
                  currentRecords.map((p) => (
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
                    <td colSpan="6" className="text-center">
                      No payments to show
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

         
          {Array.isArray(payments) && payments.length > recordsPerPage && (
            <div className="d-flex justify-content-center mt-3 flex-wrap">
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
                    currentPage === i + 1 ? "btn-primary" : "btn-outline-light"
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
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}