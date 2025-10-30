import { apiClient } from '../config/api'; 

class FavoriteService {
  /**
   * Get semua favorit milik user
   * @param {string} userIdentifier - ID unik user
   */
  async getFavorites(userIdentifier) { 
    try {
      const response = await apiClient.get('/api/v1/favorites', { 
        params: { user_identifier: userIdentifier } 
      });
      return response;
    } catch (error) {
      throw error; 
    }
  }

  /**
   * Toggle status favorit
   * @param {Object} data - { recipe_id, user_identifier }
   */
  async toggleFavorite(data) { 
    try {
      const response = await apiClient.post('/api/v1/favorites/toggle', data);
      return response; 
    } catch (error) {
      throw error; 
    }
  }
}

export default new FavoriteService(); 