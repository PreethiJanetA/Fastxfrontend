import axios from "./axiosInstance";


export const getAllBuses = async () => {
  const response = await axios.get("/Buses/GetAllBuses");
  return response.data;
};

export const getBusById = async (id) => {
  const response = await axios.get(`/Buses/GetBusById/${id}`); 
  return response.data;
};

export const addBus = async (busData) => {
  const response = await axios.post("/Buses/addBus", busData);
  return response.data;
};

export const updateBus = async (id, busData) => {
  const response = await axios.put(`/Buses/updateBus/${id}`, busData);
  return response.data;
};

export const deleteBus = async (id) => {
  const response = await axios.delete(`/Buses/deleteBus/${id}`);
  return response.data;
};
