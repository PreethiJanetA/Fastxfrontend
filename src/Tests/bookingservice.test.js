

import axios from '../services/axiosInstance';
import * as bookingService from '../services/bookingService';

// Mock axios
jest.mock('../services/axiosInstance');

describe('Booking Service', () => {
  afterEach(() => jest.clearAllMocks());

  test('bookTicket should post booking data', async () => {
    axios.post.mockResolvedValue({ data: { success: true } });
    const data = { userId: 1, routeId: 2 };
    const result = await bookingService.bookTicket(data);

    expect(axios.post).toHaveBeenCalledWith('/Bookings/bookTicket', data);
    expect(result).toEqual({ success: true });
  });

  test('getMyBookings should call GET with params', async () => {
    axios.get.mockResolvedValue({ data: ['booking1', 'booking2'] });

    const result = await bookingService.getMyBookings(1, 1, 50);

    expect(axios.get).toHaveBeenCalledWith('/Bookings/GetBookingsbyuser/1', {
      params: { PageNumber: 1, PageSize: 50 },
    });
    expect(result).toEqual(['booking1', 'booking2']);
  });

  test('cancelBooking should call POST with bookingId', async () => {
    axios.post.mockResolvedValue({ data: { cancelled: true } });

    const result = await bookingService.cancelBooking(5);

    expect(axios.post).toHaveBeenCalledWith('/Bookings/cancel/5');
    expect(result).toEqual({ cancelled: true });
  });

  test('getSeatsForBooking should GET seats', async () => {
    axios.get.mockResolvedValue({ data: ['A1', 'A2'] });

    const result = await bookingService.getSeatsForBooking(10);

    expect(axios.get).toHaveBeenCalledWith('/Bookings/10/GetSeatsByBookingId');
    expect(result).toEqual(['A1', 'A2']);
  });

  test('cancelSelectedSeats should POST dto', async () => {
    axios.post.mockResolvedValue({ data: { success: true } });
    const dto = { bookingId: 10, seats: ['A1'] };

    await bookingService.cancelSelectedSeats(dto);

    expect(axios.post).toHaveBeenCalledWith('/Bookings/cancel-seats', dto);
  });

  test('getAllBookings should GET all bookings', async () => {
    axios.get.mockResolvedValue({ data: [{ id: 1 }, { id: 2 }] });

    const result = await bookingService.getAllBookings();

    expect(axios.get).toHaveBeenCalledWith('/Bookings');
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  test('getBookingById should GET booking by ID', async () => {
    axios.get.mockResolvedValue({ data: { id: 5 } });

    const result = await bookingService.getBookingById(5);

    expect(axios.get).toHaveBeenCalledWith('/Bookings/5');
    expect(result).toEqual({ id: 5 });
  });

  test('getBookingsByBusId should GET bookings by busId', async () => {
    axios.get.mockResolvedValue({ data: ['b1', 'b2'] });

    const result = await bookingService.getBookingsByBusId(2);

    expect(axios.get).toHaveBeenCalledWith('/Bookings/getbookingsBybusId/2');
    expect(result).toEqual(['b1', 'b2']);
  });

  test('getBookingsByuserId should GET bookings by userId', async () => {
    axios.get.mockResolvedValue({ data: ['u1', 'u2'] });

    const result = await bookingService.getBookingsByuserId(3);

    expect(axios.get).toHaveBeenCalledWith('/Bookings/GetBookingsbyuserId/3');
    expect(result).toEqual(['u1', 'u2']);
  });
});
