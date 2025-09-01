import axios from '../services/axiosInstance';
import * as seatService from '../services/seatService';

// Mock axios
jest.mock('../services/axiosInstance');

describe('Seat Service', () => {
  afterEach(() => jest.clearAllMocks());

  test('getSeatsByRoute should fetch available seats for a route', async () => {
    const mockData = { items: [{ seatNumber: 1 }, { seatNumber: 2 }] };
    axios.get.mockResolvedValue({ data: mockData });

    const result = await seatService.getSeatsByRoute(10, 1, 50);

    expect(axios.get).toHaveBeenCalledWith('/Seat/by-route/10/available', {
      params: { PageNumber: 1, PageSize: 50 },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        Accept: 'application/json',
      },
    });

    expect(result).toEqual(mockData.items);
  });

  test('deleteSeat should delete a seat by ID', async () => {
    const mockResponse = { success: true };
    axios.delete.mockResolvedValue({ data: mockResponse });

    const result = await seatService.deleteSeat(5);

    expect(axios.delete).toHaveBeenCalledWith('/Seat/5');
    expect(result).toEqual(mockResponse);
  });

  test('bookSelectedSeats should book seats for a route', async () => {
    const mockResponse = { success: true };
    axios.put.mockResolvedValue({ data: mockResponse });

    const result = await seatService.bookSelectedSeats(10, [1, 2, 3]);

    expect(axios.put).toHaveBeenCalledWith('/Seat/BookSeats/10', {
      seatNumbers: [1, 2, 3],
    });

    expect(result).toEqual(mockResponse);
  });
});
