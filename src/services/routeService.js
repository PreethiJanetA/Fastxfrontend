 import axios from "./axiosInstance";






// export const searchRoutes = async (origin, destination, travelDate) => {
//   const response = await axios.get("/Route/search_Routes", {
//     params: { origin, destination, travelDate },
//   });
//   return response.data;
// };


// export const getAllRoutes = async () => {
//   const response = await axios.get("/Route");
//   return response.data;
// };

// export const getRouteById = async (id) => {
//   const response = await axios.get(`/Route/${id}`);
//   return response.data;
// };

// export const addRoute = async (routeData) => {
//   const response = await axios.post("/Route", routeData);
//   return response.data;
// };

// export const updateRoute = async (id, routeData) => {
//   const response = await axios.put(`/Route/${id}`, routeData);
//   return response.data;
// };

// export const deleteRoute = async (id) => {
//   const response = await axios.delete(`/Route/${id}`);
//   return response.data;
// };
// export const getRoutesByBusId = async (busId) => {
//   const response = await axios.get(`/Route/GetRoutesByBusId/${busId}`);
//   return response.data;
// };





const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  Accept: "application/json",
});

export const searchRoutes = async (origin, destination, travelDate) => {
  const response = await axios.get("/Route/Search", {
    params: { origin, destination, travelDate },
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getAllRoutes = async () => {
  const response = await axios.get("/Route", { headers: getAuthHeaders() });
  return response.data;
};

export const getRouteById = async (id) => {
  const response = await axios.get(`/Route/${id}`, { headers: getAuthHeaders() });
  return response.data;
};

export const addRoute = async (routeData) => {
  const response = await axios.post("/Route", routeData, { headers: getAuthHeaders() });
  return response.data;
};

export const updateRoute = async (id, routeData) => {
  const response = await axios.put(`/Route/${id}`, routeData, { headers: getAuthHeaders() });
  return response.data;
};

export const deleteRoute = async (id) => {
  const response = await axios.delete(`/Route/${id}`, { headers: getAuthHeaders() });
  return response.data;
};

export const getRoutesByBusId = async (busId) => {
  const response = await axios.get(`/Route/GetRoutesByBusId/${busId}`, { headers: getAuthHeaders() });
  return response.data;
};



