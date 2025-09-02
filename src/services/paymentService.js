import axios from "./axiosInstance";

export const processPayment = async (data) => {
  const response = await axios.post("/Payments/processPayment", data);
  return response.data;
};

export const getAllPayments = async () => {
  const response = await axios.get("/Payments/GetAllPayments");
  return response.data;
};

export const getPaymentByBookingId = async (bookingId) => {
  const response = await axios.get(`/Payments/GetPaymentByBookingId/${bookingId}`);

  return response.data;
};

const api = axios.create({
  baseURL: "http://localhost:5152/api",
});

export const getPaymentsByUser = async (userId, pageNumber, pageSize) => {
  return api.get(`/Payments/GetPaymentsByUserId/${userId}`, {
    params: {
      "pagenation.PageNumber": pageNumber,
      "pagenation.PageSize": pageSize,
    },
  });
};
