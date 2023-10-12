import axios, { AxiosInstance } from 'axios';

class AxiosBase {
  protected axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
  });

  constructor() {
    this.axiosInstance.interceptors.request.use(config => {
      config.headers['Content-Type'] = 'application/json';
      return config;
    });
  }
}

export default AxiosBase;
