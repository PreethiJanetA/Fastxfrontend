import axios from "./axiosInstance";

export const getAllRefunds = async (pageNumber = 1, pageSize = 10) => {
  const response = await axios.get("/Refund", {
    params: { pageNumber, pageSize }
  });
  return response.data;
};


export const getRefundByBookingId = async (bookingId) => {
  const response = await axios.get(`/Refund/GetRefundBybookingId/${bookingId}`);
  return response.data;
};

export const getPendingRefunds = async () => {
  const response = await axios.get("/Refund/GetpendingRefunds");
  return response.data;
};

export const approveRefund = async (refundId) => {
  const response = await axios.put(`/Refund/approve/${refundId}`);
  return response.data;
};

export const getRefundsByUserId = async (userId) => {
  const response = await axios.get(`/Refund/GetRefundsByUserId/${userId}`);
  return response.data;
};

// export const getRefundsByUser = async (userId, pageNumber = 1, pageSize = 10) => {
//   //if (!userId) throw new Error("userId is required for getRefundsByUser");
  
//   const url = `/Refund/GetRefundsByUserId/${userId}?PageNumber=${pageNumber}&PageSize=${pageSize}`;
//   const response = await axios.get(url);
//   return response.data;
// };


export const getRefundsByUser = async (userId, pageNumber = 1, pageSize = 10) => {
  const url = `/Refund/GetRefundsByUserId/${userId}?PageNumber=${pageNumber}&PageSize=${pageSize}`;
  const response = await axios.get(url);
  return response.data;
};
// const api = axios.create({
//   baseURL: "http://localhost:5092/api",
// });

// export const getRefundsByUser = async (userId, pageNumber, pageSize) => {
//   return api.get(`/Refund/GetRefundsByUserId/${userId}`, {
//     params: {
//       "pagenation.PageNumber": pageNumber,
//       "pagenation.PageSize": pageSize,
//     },
//   });
// };



// export const getRefundsByUser = async (userId, pageNumber, pageSize) => {
//   if (!userId) throw new Error("userId is required for getRefundsByUser");

//   const token = localStorage.getItem("token"); // or however you save it after login

//   const response = await axios.get(
//     `http://localhost:5092/api/Refund/GetRefundsByUserId/${userId}?PageNumber=${pageNumber}&PageSize=${pageSize}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   return response.data;
// };
