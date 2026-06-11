import axios from 'axios';
import { loadConfig } from '../utils/config.js';

export function apiClient() {
  const config = loadConfig();
  return axios.create({
    baseURL: config.apiBaseUrl,
    headers: config.token ? { Authorization: `Bearer ${config.token}` } : {},
    timeout: 10000,
  });
}
