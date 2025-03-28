import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001', // local
<<<<<<< HEAD
  //baseURL: 'http://18.234.187.66:5001', // live
=======
  //baseURL: 'http://3.26.96.188:5001', // live
>>>>>>> 6acaafe9b9fc5f71347a09db32b43a6f1f423e99
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
