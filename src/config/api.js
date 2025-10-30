import axios from 'axios';

// 1. Ambil Base URL dari file .env [cite: 109-110]
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 2. Buat instance axios [cite: 112]
const apiClient = axios.create({
  baseURL: BASE_URL, 
  headers: { 
    'Content-Type': 'application/json', 
  },
  timeout: 10000, 
});

// 3. Request Interceptor (Tidak melakukan apa-apa saat ini, tapi siap digunakan)
apiClient.interceptors.request.use( 
  (config) => {
    // Anda bisa menambahkan logic di sini, misal: menambah token auth
    return config; 
  },
  (error) => {
    return Promise.reject(error); 
  }
);

// 4. Response Interceptor (Sangat penting!)
// Ini akan otomatis mengambil "response.data" dari setiap respons sukses [cite: 133-134]
// dan melempar error yang sudah terstruktur jika gagal [cite: 136-137]
apiClient.interceptors.response.use( 
  (response) => {
    return response.data; 
  },
  (error) => {
    // Ambil pesan error dari API jika ada, atau buat pesan default [cite: 136]
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    
    // Kembalikan error dalam format yang konsisten
    return Promise.reject(error.response?.data || { success: false, message: errorMessage }); 
  }
);

export { apiClient, BASE_URL }; 