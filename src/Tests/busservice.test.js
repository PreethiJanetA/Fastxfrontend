import axios from '../services/axiosInstance';
import * as busService from '../services/busService';

// Mock axios
jest.mock('../services/axiosInstance');

describe('Bus Service', () => {
  afterEach(() => jest.clearAllMocks());

  test('getAllBuses should fetch all buses', async () => {
    axios.get.mockResolvedValue({ data: [{ id: 1 }, { id: 2 }] });

    const result = await busService.getAllBuses();

    expect(axios.get).toHaveBeenCalledWith('/Bus');
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  test('getBusById should fetch a bus by ID', async () => {
    axios.get.mockResolvedValue({ data: { id: 1, name: 'Bus1' } });

    const result = await busService.getBusById(1);

    expect(axios.get).toHaveBeenCalledWith('/Bus/1');
    expect(result).toEqual({ id: 1, name: 'Bus1' });
  });

  test('addBus should post new bus data', async () => {
    const newBus = { name: 'Bus2' };
    axios.post.mockResolvedValue({ data: { id: 2, name: 'Bus2' } });

    const result = await busService.addBus(newBus);

    expect(axios.post).toHaveBeenCalledWith('/Bus', newBus);
    expect(result).toEqual({ id: 2, name: 'Bus2' });
  });

  test('updateBus should update a bus', async () => {
    const updatedBus = { name: 'Bus1 Updated' };
    axios.put.mockResolvedValue({ data: { id: 1, name: 'Bus1 Updated' } });

    const result = await busService.updateBus(1, updatedBus);

    expect(axios.put).toHaveBeenCalledWith('/Bus/1', updatedBus);
    expect(result).toEqual({ id: 1, name: 'Bus1 Updated' });
  });

  test('deleteBus should delete a bus', async () => {
    axios.delete.mockResolvedValue({ data: { success: true } });

    const result = await busService.deleteBus(1);

    expect(axios.delete).toHaveBeenCalledWith('/Bus/1');
    expect(result).toEqual({ success: true });
  });
});
