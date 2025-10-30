import axios from 'axios';
import { BASE_URL } from '../config/api'; 

class UploadService {
  /**
   * Upload gambar
   * @param {File} file - File gambar
   */
  async uploadImage(file) { 
    try {
      // Validasi dasar [cite: 697-711]
      if (!file) throw new Error('No file provided'); 
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']; 
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Allowed: .jpg, .jpeg, .png, .webp'); 
      }
      const maxSize = 5 * 1024 * 1024; // 5MB [cite: 709]
      if (file.size > maxSize) throw new Error('File size exceeds 5MB limit'); 

      const formData = new FormData(); 
      formData.append('image', file);

      // Penting: Service ini menggunakan axios murni, BUKAN apiClient,
      // karena butuh 'Content-Type': 'multipart/form-data' [cite: 716-719]
      const response = await axios.post(`${BASE_URL}/api/v1/upload`, formData, { 
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
        timeout: 30000, 
      });
      return response.data; 
    } catch (error) {
      throw error; 
    }
  }
}

export default new UploadService(); 