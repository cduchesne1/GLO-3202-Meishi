import axios from 'axios';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
});

httpClient.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') as string);

  if (user && user.tokenManager && user.tokenManager.accessToken) {
    config.headers.Authorization = `Bearer ${user.tokenManager.accessToken}`;
  }
  return config;
});

export default httpClient;
