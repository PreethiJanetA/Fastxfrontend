import axios from "./axiosInstance";

export const getAllUsers = async () => {
  const res = await axios.get("/User");
  return res.data;
};

export const getUserById = async (id) => {
  const res = await axios.get(`/User/${id}`);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await axios.delete(`/User/delete/${id}`);
  return res.data;
};

export const updateUserProfile = async (userId, profileData) => {
  const response = await axios.put(`/User/Update`, profileData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};
