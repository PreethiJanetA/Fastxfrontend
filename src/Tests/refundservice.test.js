import axios from '../services/axiosInstance';
import * as refundService from '../services/refundService';

// Mock axios
jest.mock('../services/axiosInstance');

describe('Refund Service', () => {
  afterEach(() => jest.clearAllMocks());

  test('getAllRefunds should fetch all refunds with default pagination', async () => {
    axios.get.mockResolvedValue({ data: [{ id: 1 }, { id: 2 }] });

    const result = await refundService.getAllRefunds();

    expect(axios.get).toHaveBeenCalledWith('/Refund', { params: { pageNumber: 1, pageSize: 10 } });
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  test('getRefundByBookingId should fetch refund by booking ID', async () => {
    axios.get.mockResolvedValue({ data: { id: 1, bookingId: 123 } });

    const result = await refundService.getRefundByBookingId(123);

    expect(axios.get).toHaveBeenCalledWith('/Refund/GetRefundBybookingId/123');
    expect(result).toEqual({ id: 1, bookingId: 123 });
  });

  test('getPendingRefunds should fetch pending refunds', async () => {
    axios.get.mockResolvedValue({ data: [{ id: 1, status: 'pending' }] });

    const result = await refundService.getPendingRefunds();

    expect(axios.get).toHaveBeenCalledWith('/Refund/GetpendingRefunds');
    expect(result).toEqual([{ id: 1, status: 'pending' }]);
  });

  test('approveRefund should approve a refund', async () => {
    axios.post.mockResolvedValue({ data: { id: 1, status: 'approved' } });

    const result = await refundService.approveRefund(1);

    expect(axios.post).toHaveBeenCalledWith('/Refund/approve/1');
    expect(result).toEqual({ id: 1, status: 'approved' });
  });

  test('getRefundsByUserId should fetch refunds by user ID', async () => {
    axios.get.mockResolvedValue({ data: [{ id: 1, userId: 5 }] });

    const result = await refundService.getRefundsByUserId(5);

    expect(axios.get).toHaveBeenCalledWith('/Refund/GetRefundsByUserId/5');
    expect(result).toEqual([{ id: 1, userId: 5 }]);
  });

  test('getRefundsByUser should fetch refunds by user with pagination', async () => {
    axios.get.mockResolvedValue({ data: [{ id: 1, userId: 5 }] });

    const result = await refundService.getRefundsByUser(5, 2, 20);

    expect(axios.get).toHaveBeenCalledWith('/Refund/GetRefundsByUserId/5?PageNumber=2&PageSize=20');
    expect(result).toEqual([{ id: 1, userId: 5 }]);
  });
});
