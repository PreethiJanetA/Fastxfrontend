import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../services/axiosInstance";
import { toast } from "react-toastify";

export default function CancelPage() {
  const { bookingId } = useParams();
  const [refund, setRefund] = useState(null);

  useEffect(() => {
    const fetchRefund = async () => {
      try {
        const response = await axios.get(`/Refund/GetRefundbybookingId/${bookingId}`);
        setRefund(response.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load refund info.");
      }
    };

    fetchRefund();
  }, [bookingId]);

  if (!refund) return <div>Loading refund details...</div>;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url('https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/58cf8758-02e9-4d59-970f-211df3402f18.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
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
        <h2>Refund Details</h2>
        <div className="mt-3 p-3 border rounded" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
          <p><strong>Refund ID:</strong> {refund.refundId}</p>
          <p><strong>Booking ID:</strong> {refund.bookingId}</p>
          <p><strong>Refund Amount:</strong> ₹{refund.refundAmount}</p>
          <p><strong>Status:</strong> {refund.status}</p>
        </div>
      </div>
    </div>
  );
}

