import { useState, useEffect, useCallback } from 'react';
import recipeService from '../services/recipeService'; 

/**
 * Hook untuk fetch banyak resep (dengan filter, dll)
 */
export function useRecipes(params = {}) { 
  const [recipes, setRecipes] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [pagination, setPagination] = useState(null); 

  // Gunakan JSON.stringify(params) agar fetchRecipes
  // hanya dibuat ulang jika params benar-benar berubah
  const fetchRecipes = useCallback(async () => { 
    try {
      setLoading(true); 
      setError(null); 
      const response = await recipeService.getRecipes(params); 
      if (response.success) {
        setRecipes(response.data || []); 
        setPagination(response.pagination || null); 
      } else {
        setError(response.message || 'Failed to fetch recipes'); 
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching recipes'); 
      setRecipes([]); 
    } finally {
      setLoading(false); 
    }
  }, [JSON.stringify(params)]); 

  useEffect(() => {
    fetchRecipes(); 
  }, [fetchRecipes]); 

  return { recipes, loading, error, pagination, refetch: fetchRecipes }; 
}

/**
 * Hook untuk fetch satu resep by ID
 */
export function useRecipe(id) { 
  const [recipe, setRecipe] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const fetchRecipe = useCallback(async () => { 
    if (!id) { 
      setLoading(false); 
      return; 
    }
    try {
      setLoading(true); 
      setError(null); 
      const response = await recipeService.getRecipeById(id); 
      if (response.success) {
        setRecipe(response.data); 
      } else {
        setError(response.message || 'Failed to fetch recipe'); 
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching recipe'); 
      setRecipe(null); 
    } finally {
      setLoading(false); 
    }
  }, [id]); 

  useEffect(() => {
    fetchRecipe(); 
  }, [fetchRecipe]); 

  return { recipe, loading, error, refetch: fetchRecipe }; 
}