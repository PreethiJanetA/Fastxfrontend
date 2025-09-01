import axios from "./axiosInstance";



export async function getSeatsByRoute(routeId, pageNumber = 1, pageSize = 50) {
  try {
    const response = await axios.get(`/Seat/by-route/${routeId}`, {
      params: { PageNumber: pageNumber, PageSize: pageSize },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    });
    return response.data.items; 
  } catch (err) {
    console.error("Axios error:", err.response?.status, err.response?.data || err);
    throw err;
  }
}


export const bookSelectedSeats = async (seatNumbers) => {
  const response = await axios.post(`/Seat/Book`, {
    seatNumbers: seatNumbers
  });
  return response.data;
};