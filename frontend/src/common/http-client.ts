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

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response;
    if (status === 401) {
      const user = JSON.parse(localStorage.getItem('user') as string);

      if (user && user.tokenManager && user.tokenManager.refreshToken) {
        const { refreshToken } = user.tokenManager;
        return axios
          .post(`${import.meta.env.VITE_API_URL}/auth/token`, {
            refreshToken,
          })
          .then((response) => {
            if (response.status === 401) {
              localStorage.removeItem('user');
              window.location.href = '/login';
            }
            const tokenManager = response.data;
            localStorage.setItem(
              'user',
              JSON.stringify({ ...user, tokenManager })
            );
            error.config.headers.Authorization = `Bearer ${tokenManager.accessToken}`;
            return httpClient(error.config);
          });
      }
    }
    return Promise.reject(error);
  }
);

export default httpClient;
