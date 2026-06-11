import { apiClient } from './client.js';

export const photoApi = {
  async login(username: string, password: string) {
    const { data } = await apiClient().post('/api/auth/login', { username, password });
    return data;
  },
  async register(username: string, password: string) {
    const { data } = await apiClient().post('/api/auth/register', { username, password });
    return data;
  },
  async createSchedules(payload: unknown) {
    const { data } = await apiClient().post('/api/schedules/batch', payload);
    return data;
  },
  async listBookings() {
    const { data } = await apiClient().get('/api/bookings', { params: { status: 'pending' } });
    return data;
  },
  async updateBooking(id: number, action: 'confirm' | 'reject') {
    const { data } = await apiClient().patch(`/api/bookings/${id}/${action}`);
    return data;
  },
  async listOrders(status?: string) {
    const { data } = await apiClient().get('/api/orders', { params: { status } });
    return data;
  },
  async completeOrder(id: number) {
    const { data } = await apiClient().patch(`/api/orders/${id}/complete`);
    return data;
  },
  async stats(params: { year?: number; month?: number }) {
    const { data } = await apiClient().get('/api/stats/income', { params });
    return data;
  },
  async updateProfile(payload: unknown) {
    const { data } = await apiClient().put('/api/profile', payload);
    return data;
  },
};
