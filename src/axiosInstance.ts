// src/axiosInstance.ts
// import { Message } from '@mui/icons-material';
import axios from 'axios';
import { useMessage } from './Component/Common/MessageContext';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Define your API base URL in your .env file
});

export const useAxiosInstance = () => {
  const { setError, setSuccess } = useMessage();
  
  axiosInstance.interceptors.request.use(
    (config) => {
      // showLoader();
      setError(null);
      setSuccess(null);
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      // hideLoader();
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      // hideLoader();
      // setSuccess('Operation successful');
      return response;
    },
    (error) => {
      // hideLoader();
      console.log("Axios catch error", error);
      setError(error.response ? error.response?.data : null);
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};


export default axiosInstance;
