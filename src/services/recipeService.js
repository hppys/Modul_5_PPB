import { apiClient } from '../config/api'; 

class RecipeService {
  /**
   * Get semua resep (dengan filter/search/pagination)
   * @param {Object} params - Query params (page, limit, category, dll)
   */
  async getRecipes(params = {}) { 
    try {
      const response = await apiClient.get('/api/v1/recipes', { params }); 
      return response; 
    } catch (error) {
      throw error; 
    }
  }

  /**
   * Get resep tunggal berdasarkan ID
   * @param {string} id - Recipe ID
   */
  async getRecipeById(id) { 
    try {
      const response = await apiClient.get(`/api/v1/recipes/${id}`); 
      return response; 
    } catch (error) {
      throw error; 
    }
  }

  /**
   * Buat resep baru
   * @param {Object} recipeData - Data resep baru
   */
  async createRecipe(recipeData) { 
    try {
      const response = await apiClient.post('/api/v1/recipes', recipeData); 
      return response; 
    } catch (error) {
      throw error; 
    }
  }

  /**
   * Update resep (full replacement)
   * @param {string} id - Recipe ID
   * @param {Object} recipeData - Data resep lengkap
   */
  async updateRecipe(id, recipeData) { 
    try {
      const response = await apiClient.put(`/api/v1/recipes/${id}`, recipeData); 
      return response; 
    } catch (error) {
      throw error; 
    }
  }

  /**
   * Update resep (parsial)
   * @param {string} id - Recipe ID
   * @param {Object} partialData - Data parsial yang ingin di-update
   */
  async patchRecipe(id, partialData) { 
    try {
      const response = await apiClient.patch(`/api/v1/recipes/${id}`, partialData); 
      return response; 
    } catch (error) {
      throw error; 
    }
  }

  /**
   * Hapus resep
   * @param {string} id - Recipe ID
   */
  async deleteRecipe(id) { 
    try {
      const response = await apiClient.delete(`/api/v1/recipes/${id}`); 
      return response; 
    } catch (error) {
      throw error;
    }
  }
}

export default new RecipeService(); 