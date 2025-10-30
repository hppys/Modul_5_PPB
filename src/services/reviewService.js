import { apiClient } from '../config/api'; 

class ReviewService {
  /**
   * Get semua ulasan untuk 1 resep
   * @param {string} recipeId - Recipe ID
   */
  async getReviews(recipeId) { 
    try {
      const response = await apiClient.get(`/api/v1/recipes/${recipeId}/reviews`);
      return response;
    } catch (error) {
      throw error; 
    }
  }

  /**
   * Buat ulasan baru
   * @param {string} recipeId - Recipe ID
   * @param {Object} reviewData - Data ulasan (rating, comment, user_identifier)
   */
  async createReview(recipeId, reviewData) { 
    try {
      const response = await apiClient.post(`/api/v1/recipes/${recipeId}/reviews`, reviewData); 
      return response; 
    } catch (error) {
      throw error; 
    }
  }
  
  // Fungsi updateReview dan deleteReview juga ada di modul [cite: 656-681]
  // ... (bisa ditambahkan jika perlu)
}

export default new ReviewService(); 