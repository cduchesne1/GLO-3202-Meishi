import axios from 'axios';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
});

export default httpClient;
