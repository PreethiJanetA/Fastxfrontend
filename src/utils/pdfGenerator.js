import jsPDF from "jspdf";

export function generateTicketPDF(booking) {
  try {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("FastX Bus Ticket", 70, 20);

    doc.setFontSize(12);
    doc.text(`Booking ID: ${booking.bookingId}`, 20, 40);
    doc.text(`User ID: ${booking.userId}`, 20, 50);
    doc.text(`Route ID: ${booking.routeId}`, 20, 60);
    doc.text(`Date: ${new Date(booking.bookingDate).toLocaleString()}`, 20, 70);
    doc.text(`Amount Paid: ₹${booking.amountPaid ?? "-"}`, 20, 90);
    doc.text(`Status: ${booking.status}`, 20, 100);

    doc.save(`ticket-${booking.bookingId}.pdf`);
  } catch (err) {
    console.error("Error generating PDF:", err);
    throw err;
  }
}