import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const axiosConfig = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:7000',
});

export default axiosConfig;
