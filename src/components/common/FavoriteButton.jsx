// src/components/common/FavoriteButton.jsx
import { useEffect, useState } from 'react'; // Impor useState
import { Heart, Loader } from 'lucide-react';
import { useData } from '../../context/DataContext'; // Impor hook cache kita
import favoriteService from '../../services/favoriteService'; // Impor service
import userService from '../../services/userService'; // Impor service

export default function FavoriteButton({ recipeId, size = 'md' }) {
  // Panggil hook cache kita
  const { cache, loading, fetchAndCache, invalidateCache } = useData();
  const userId = userService.getUserIdentifier();
  
  // Buat cache key unik untuk favorites
  const cacheKey = `favorites_${userId}`;

  // State lokal untuk loading saat 'toggle'
  const [isToggling, setIsToggling] = useState(false);

  // Ambil data favorites dari cache
  useEffect(() => {
    fetchAndCache(cacheKey, () => favoriteService.getFavorites(userId));
  }, [cacheKey, fetchAndCache]); // Tambahkan fetchAndCache

  // Cek state loading dari cache
  const isLoadingFavorites = loading[cacheKey];
  
  // Ambil data dari cache
  const favorites = cache[cacheKey]?.data || [];
  
  // Tentukan apakah resep ini difavoritkan
  const isFavorited = favorites.some(fav => fav.id === recipeId);

  // Fungsi untuk handle toggle
  const handleToggle = async (e) => {
    e.stopPropagation(); // Mencegah klik pada kartu
    setIsToggling(true);
    
    try {
      // Panggil service secara langsung
      await favoriteService.toggleFavorite({
        recipe_id: recipeId,
        user_identifier: userId,
      });
      
      // BERSIHKAN CACHE setelah berhasil
      // Ini akan memaksa semua komponen yang menggunakan cache 'favorites' dan 'recipes'
      // untuk mengambil data baru
      invalidateCache('favorites_');
      invalidateCache('recipes_'); 
    } catch (error) {
      console.error("Gagal toggle favorit:", error);
      alert("Gagal memperbarui favorit.");
    } finally {
      setIsToggling(false);
    }
  };

  // --- Opsi Ukuran (Sama seperti sebelumnya) ---
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' };
  const iconSizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoadingFavorites || isToggling} // Disable saat data awal dimuat atau saat proses toggle
      className={`
        ${sizes[size]} rounded-full flex items-center justify-center gap-1.5
        transition-all duration-200
        ${isFavorited
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : 'bg-white/90 hover:bg-white text-slate-700 hover:text-red-500'
        }
        backdrop-blur-sm shadow-md hover:shadow-lg
        group
        disabled:opacity-70 disabled:cursor-not-allowed
      `}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {/* Tampilkan spinner jika salah satu sedang loading */}
      {isLoadingFavorites || isToggling ? (
        <Loader className={`animate-spin ${iconSizes[size]}`} />
      ) : (
        <Heart
          className={`
            ${iconSizes[size]}
            transition-all duration-200
            ${isFavorited ? 'fill-current' : ''}
          `}
        />
      )}
    </button>
  );
}