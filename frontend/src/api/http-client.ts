import axios from 'axios';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  withCredentials: true,
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response;
    if (status === 401) {
      return axios
        .post(`${import.meta.env.VITE_API_URL}/auth/token`, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.status === 401) {
            window.location.href = '/login';
            return Promise.reject(error);
          }
          return httpClient(error.config);
        });
    }
    return Promise.reject(error);
  }
);

export default httpClient;
