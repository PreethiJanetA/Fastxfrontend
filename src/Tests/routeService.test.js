import axios from '../services/axiosInstance';
import * as routeService from '../services/routeService';

// Mock axios
jest.mock('../services/axiosInstance');

describe('Route Service', () => {
  afterEach(() => jest.clearAllMocks());

  test('searchRoutes should fetch routes with given parameters', async () => {
    const mockData = [{ id: 1 }, { id: 2 }];
    axios.get.mockResolvedValue({ data: mockData });

    const result = await routeService.searchRoutes('CityA', 'CityB', '2025-08-30');

    expect(axios.get).toHaveBeenCalledWith('/Route/search_Routes', {
      params: { origin: 'CityA', destination: 'CityB', travelDate: '2025-08-30' },
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, Accept: 'application/json' },
    });
    expect(result).toEqual(mockData);
  });

  test('getAllRoutes should fetch all routes', async () => {
    const mockData = [{ id: 1 }, { id: 2 }];
    axios.get.mockResolvedValue({ data: mockData });

    const result = await routeService.getAllRoutes();

    expect(axios.get).toHaveBeenCalledWith('/Route', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, Accept: 'application/json' },
    });
    expect(result).toEqual(mockData);
  });

  test('getRouteById should fetch route by ID', async () => {
    const mockData = { id: 1 };
    axios.get.mockResolvedValue({ data: mockData });

    const result = await routeService.getRouteById(1);

    expect(axios.get).toHaveBeenCalledWith('/Route/1', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, Accept: 'application/json' },
    });
    expect(result).toEqual(mockData);
  });

  test('addRoute should create a new route', async () => {
    const mockData = { id: 3 };
    const routeData = { origin: 'CityA', destination: 'CityB' };
    axios.post.mockResolvedValue({ data: mockData });

    const result = await routeService.addRoute(routeData);

    expect(axios.post).toHaveBeenCalledWith('/Route', routeData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, Accept: 'application/json' },
    });
    expect(result).toEqual(mockData);
  });

  test('updateRoute should update a route', async () => {
    const mockData = { id: 1, origin: 'CityX' };
    const routeData = { origin: 'CityX' };
    axios.put.mockResolvedValue({ data: mockData });

    const result = await routeService.updateRoute(1, routeData);

    expect(axios.put).toHaveBeenCalledWith('/Route/1', routeData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, Accept: 'application/json' },
    });
    expect(result).toEqual(mockData);
  });

  test('deleteRoute should delete a route', async () => {
    const mockData = { success: true };
    axios.delete.mockResolvedValue({ data: mockData });

    const result = await routeService.deleteRoute(1);

    expect(axios.delete).toHaveBeenCalledWith('/Route/1', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, Accept: 'application/json' },
    });
    expect(result).toEqual(mockData);
  });

  test('getRoutesByBusId should fetch routes by bus ID', async () => {
    const mockData = [{ id: 1 }];
    axios.get.mockResolvedValue({ data: mockData });

    const result = await routeService.getRoutesByBusId(5);

    expect(axios.get).toHaveBeenCalledWith('/Route/GetRoutesByBusId/5', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, Accept: 'application/json' },
    });
    expect(result).toEqual(mockData);
  });
});
