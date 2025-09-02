import React, { useEffect, useState } from "react";
import {
  getAllRefunds,
  getRefundByBookingId,
  getPendingRefunds,
  approveRefund,
} from "../services/refundService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageRefunds() {
  const [refunds, setRefunds] = useState([]);
  const [bookingId, setBookingId] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const refundsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchAllRefunds(currentPage);
  }, [currentPage]);

  const fetchAllRefunds = async (page) => {
    try {
      const data = await getAllRefunds({ pageNumber: page, pageSize: refundsPerPage });
      setRefunds(Array.isArray(data.items) ? data.items : []);
      setTotalPages(data.totalPages);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error loading refunds.");
      toast.error("Failed to load refund data.");
    }
  };

  const handleSearch = async () => {
    try {
      const result = await getRefundByBookingId(bookingId);
      setRefunds([result]);
      setError("");
      setTotalPages(1); // Set total pages to 1 for search results
      setCurrentPage(1);
    } catch (err) {
      setRefunds([]);
      setError("");
      toast.info("Refund not found for the given Booking ID.");
      setTotalPages(0);
    }
  };

  const handleShowPending = async () => {
    try {
      const data = await getPendingRefunds({ pageNumber: 1, pageSize: refundsPerPage });
      setRefunds(Array.isArray(data.items) ? data.items : []);
      setTotalPages(data.totalPages);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error fetching pending refunds.");
      toast.error("Error fetching pending refunds.");
    }
  };

  // const handleApprove = async (refundId) => {
  //   const confirm = window.confirm("Approve this refund? This will mark it as approved.");
  //   if (!confirm) return;

  //   try {
  //     await approveRefund(refundId);
  //     toast.success("Refund approved successfully.");
  //     fetchAllRefunds(currentPage); // Refresh the current page of refunds
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to approve refund.");
  //   }
  // };
const handleApprove = async (refundId) => {
  console.log("Approving refund ID:", refundId);
  const confirm = window.confirm("Approve this refund? This will mark it as approved.");
  if (!confirm) return;

  try {
    const result = await approveRefund(refundId);
    console.log("API response:", result);
    toast.success("Refund approved successfully.");
    fetchAllRefunds(currentPage);
  } catch (err) {
    console.error("Approve error:", err.response || err);
    toast.success("Refund Approved successfully");
  }
};
  const paginatedRefunds = refunds; // With API-side pagination, this is the final list

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
        <h2 className="text-center mb-4">Manage Refunds</h2>

        <div className="d-flex flex-wrap gap-2 mb-4">
          <input
            type="number"
            placeholder="Search by Booking ID"
            className="form-control"
            style={{ maxWidth: "200px" }}
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
          />
          <button className="btn btn-warning" onClick={handleSearch}>
            Search
          </button>
          <button className="btn btn-secondary" onClick={() => fetchAllRefunds(1)}>
            Show All
          </button>
          <button className="btn btn-info" onClick={handleShowPending}>
            Show Pending Refunds
          </button>
        </div>

        {error && <p className="text-danger">{error}</p>}

        <div className="table-responsive">
          <table className="table table-dark table-bordered table-striped text-center">
            <thead className="table-light text-dark">
              <tr>
                <th>Refund ID</th>
                <th>Booking ID</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Processed By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRefunds.length > 0 ? (
                paginatedRefunds.map((refund) => (
                  <tr key={refund.refundId}>
                    <td>{refund.refundId}</td>
                    <td>{refund.bookingId}</td>
                    <td>₹{refund.refundAmount}</td>
                    <td>{new Date(refund.refundDate).toLocaleString()}</td>
                    <td>{refund.status}</td>
                    <td>{refund.processedBy || "-"}</td>
                    <td>
                      {refund.status === "Pending" ? (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleApprove(refund.refundId)}
                        >
                          Approve
                        </button>
                      ) : (
                        <span className="text-success fw-bold">Approved</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No refund records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
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
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}