import React, { useEffect, useState } from "react";
import { getRefundsByUser, getRefundByBookingId } from "../services/refundService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MyRefund() {
  const [refunds, setRefunds] = useState([]);
  const [bookingId, setBookingId] = useState("");

  const fetchMyRefunds = async (userId) => {
    if (!userId) {
      toast.error("User ID not found. Please log in.");
      return;
    }
    try {
      const data = await getRefundsByUser(userId); // Now correctly passing userId
      setRefunds(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      //toast.error("Error loading your refunds.");
    }
  };

  const handleSearch = async () => {
    if (!bookingId.trim()) return;

    try {
      const refund = await getRefundByBookingId(bookingId);
      setRefunds([refund]);
    } catch (err) {
      console.error(err);
      toast.info("No refund found for this Booking ID.");
      setRefunds([]);
    }
  };

  const handleReset = () => {
    setBookingId("");
    const userId = localStorage.getItem("userId");
    fetchMyRefunds(userId);
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    fetchMyRefunds(userId);
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
        <h2 className="text-center mb-4">My Refunds</h2>

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
                <th>Refund ID</th>
                <th>Booking ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Processed By</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {refunds.length > 0 ? (
                refunds.map((r) => (
                  <tr key={r.refundId}>
                    <td>{r.refundId}</td>
                    <td>{r.bookingId}</td>
                    <td>₹{r.refundAmount}</td>
                    <td>{r.status}</td>
                    <td>{r.processedBy || "N/A"}</td>
                    <td>{new Date(r.refundDate).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-muted">
                    No refunds to show
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

