import axios from "./axiosInstance";

export const bookTicket = async (bookingData) => {
  const response = await axios.post("/Bookings/bookTicket", bookingData);
  console.log("Book Ticket API Response:", response.data);
  return response.data;
};

// export const getMyBookings = async () => {
//   const token = localStorage.getItem("token"); 
//   const userId = localStorage.getItem("userId");

//   const response = await axios.get(
//     `http://localhost:5092/api/Bookings/GetBookingsbyuser/${userId}`,
//     {
     
//       params: {
//         PageNumber: 1,
//         PageSize: 50,
//       },
//     }
//   );
//   return response.data;
// };

export const getMyBookings = async (userId, page = 1, size = 50) => {
  const response = await axios.get(`/Bookings/GetBookingsbyuserId/${userId}`, {
    params: {
      PageNumber: page,
      PageSize: size,
    },
  });
  return response.data;
};



export const cancelBooking = async (bookingId) => {
  const response = await axios.post(`/Bookings/cancel/${bookingId}`);
  return response.data;
};

export const getSeatsForBooking = async (bookingId) => {
  const response = await axios.get(`/Bookings/${bookingId}/GetSeatsByBookingId`);
  return response.data;
};

export const cancelSelectedSeats = async (dto) => {
  await axios.post(`/Bookings/cancel-seats`, dto);
};

export const getAllBookings = async () => {
  const response = await axios.get("/Bookings/GetAllBookings");
  return response.data;
};


export const getBookingById = async (id) => {
  const response = await axios.get(`/Bookings/${id}`);
  return response.data;
};

export const getBookingsByBusId = async (busId) => {
  const response = await axios.get(`/Bookings/getbookingsBybusId/${busId}`);
  return response.data;
};

export const getBookingsByuserId = async (userId) => {
  const response = await axios.get(`/Bookings/GetBookingsbyuserId/${userId}`);
  return response.data;
};

