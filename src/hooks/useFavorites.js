import { useState, useEffect, useCallback } from 'react';
import favoriteService from '../services/favoriteService'; 
import userService from '../services/userService'; 

/**
 * Ambil user identifier
 */
const getUserIdentifier = () => { 
  return userService.getUserIdentifier(); 
}; 

/**
 * Hook untuk fetch daftar favorit
 */
export function useFavorites() { 
  const [favorites, setFavorites] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const userIdentifier = getUserIdentifier(); 

  const fetchFavorites = useCallback(async () => { 
    try {
      setLoading(true); 
      setError(null); 
      const response = await favoriteService.getFavorites(userIdentifier); 
      if (response.success) {
        setFavorites(response.data || []); 
      } else {
        setError(response.message || 'Failed to fetch favorites'); 
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching favorites'); 
      setFavorites([]); 
    } finally {
      setLoading(false); 
    }
  }, [userIdentifier]); 

  useEffect(() => {
    fetchFavorites(); 
  }, [fetchFavorites]); 

  return { favorites, loading, error, refetch: fetchFavorites }; 
}

/**
 * Hook untuk toggle (add/remove) favorit
 */
export function useToggleFavorite() { 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const userIdentifier = getUserIdentifier(); 

  const toggleFavorite = async (recipeId) => { 
    try {
      setLoading(true); 
      setError(null); 
      const response = await favoriteService.toggleFavorite({ 
        recipe_id: recipeId, 
        user_identifier: userIdentifier, 
      });
      if (response.success) {
        return response.data; 
      } else {
        setError(response.message || 'Failed to toggle favorite'); 
        return null; 
      }
    } catch (err) {
      setError(err.message || 'An error occurred while toggling favorite'); 
      return null; 
    } finally {
      setLoading(false);
    }
  }; 

  return { toggleFavorite, loading, error }; 
}

/**
 * Hook untuk mengecek status favorit & men-toggle nya
 */
export function useIsFavorited(recipeId) { 
  const { favorites, loading: fetchLoading, refetch } = useFavorites(); 
  const { toggleFavorite: toggle, loading: toggleLoading } = useToggleFavorite(); 

  const isFavorited = favorites.some(fav => fav.id === recipeId); 

  const toggleFavorite = async () => { 
    const result = await toggle(recipeId); 
    if (result) {
      await refetch(); 
    }
    return result; 
  };

  return {
    isFavorited,
    loading: fetchLoading || toggleLoading, 
    toggleFavorite, 
  };
}

export { getUserIdentifier }; 