import axios from '../services/axiosInstance';
import * as paymentService from '../services/paymentService';

// Mock axios
jest.mock('../services/axiosInstance');

describe('Payment Service', () => {
  afterEach(() => jest.clearAllMocks());

  test('processPayment should post payment data', async () => {
    const mockData = { amount: 100 };
    axios.post.mockResolvedValue({ data: { success: true, id: 1 } });

    const result = await paymentService.processPayment(mockData);

    expect(axios.post).toHaveBeenCalledWith('/Payment/process_Payment', mockData);
    expect(result).toEqual({ success: true, id: 1 });
  });

  test('getAllPayments should fetch all payments', async () => {
    axios.get.mockResolvedValue({ data: [{ id: 1 }, { id: 2 }] });

    const result = await paymentService.getAllPayments();

    expect(axios.get).toHaveBeenCalledWith('/Payment/Get_allpayments');
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  test('getPaymentByBookingId should fetch payment by booking ID', async () => {
    axios.get.mockResolvedValue({ data: { id: 1, amount: 100 } });

    const result = await paymentService.getPaymentByBookingId(1);

    expect(axios.get).toHaveBeenCalledWith('/Payment/GetPaymentByBookingId/1');
    expect(result).toEqual({ id: 1, amount: 100 });
  });
});
 