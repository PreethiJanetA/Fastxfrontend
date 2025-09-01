import axios from '../services/axiosInstance';
import * as userService from '../services/userService';

// Mock Axios
jest.mock('../services/axiosInstance');

describe('User Service', () => {
  afterEach(() => jest.clearAllMocks());

  test('getAllUsers should fetch all users', async () => {
    const mockData = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
    axios.get.mockResolvedValue({ data: mockData });

    const result = await userService.getAllUsers();

    expect(axios.get).toHaveBeenCalledWith('/User');
    expect(result).toEqual(mockData);
  });

  test('getUserById should fetch a user by ID', async () => {
    const mockData = { id: 1, name: 'Alice' };
    axios.get.mockResolvedValue({ data: mockData });

    const result = await userService.getUserById(1);

    expect(axios.get).toHaveBeenCalledWith('/User/1');
    expect(result).toEqual(mockData);
  });

  test('deleteUser should delete a user by ID', async () => {
    const mockResponse = { success: true };
    axios.delete.mockResolvedValue({ data: mockResponse });

    const result = await userService.deleteUser(1);

    expect(axios.delete).toHaveBeenCalledWith('/User/1');
    expect(result).toEqual(mockResponse);
  });

  test('updateUserProfile should update user profile', async () => {
    const mockData = { success: true };
    const profileData = { name: 'Alice Updated', email: 'alice@example.com' };
    axios.put.mockResolvedValue({ data: mockData });

    const result = await userService.updateUserProfile(1, profileData);

    expect(axios.put).toHaveBeenCalledWith('/User/UpdateUser_profile', profileData, {
      headers: { 'Content-Type': 'application/json' }
    });
    expect(result).toEqual(mockData);
  });
});
