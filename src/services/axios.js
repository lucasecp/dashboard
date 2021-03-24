import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const axiosConfig = axios.create({
  baseURL: 'https://app-dashboardapi.herokuapp.com'
});

export default axiosConfig;