// src/pages/HomePage.jsx
import { useEffect } from 'react'; // Impor useEffect
import { useData } from '../context/DataContext'; // Impor hook cache kita
import recipeService from '../services/recipeService'; // Impor service
import HeroSection from '../components/home/HeroSection';
import FeaturedMakananSection from '../components/home/FeaturedMakananSection';
import FeaturedMinumanSection from '../components/home/FeaturedMinumanSection';

export default function HomePage({ onRecipeClick, onNavigate }) {
  const { cache, loading, error, fetchAndCache } = useData();

  // Definisikan params dan cache keys
  const makananParams = { category: 'makanan', limit: 3, sort_by: 'created_at', order: 'desc' };
  const minumanParams = { category: 'minuman', limit: 2, sort_by: 'created_at', order: 'desc' };
  const makananKey = `recipes_${JSON.stringify(makananParams)}`;
  const minumanKey = `recipes_${JSON.stringify(minumanParams)}`;

  // Ambil data saat komponen dimuat
  useEffect(() => {
    fetchAndCache(makananKey, () => recipeService.getRecipes(makananParams));
    fetchAndCache(minumanKey, () => recipeService.getRecipes(minumanParams));
  }, [makananKey, minumanKey, fetchAndCache]); // Tambahkan fetchAndCache

  // Ambil data spesifik dari cache
  const featuredMakanan = cache[makananKey]?.data || [];
  const loadingMakanan = loading[makananKey];
  const errorMakanan = error[makananKey];

  const featuredMinuman = cache[minumanKey]?.data || [];
  const loadingMinuman = loading[minumanKey];
  const errorMinuman = error[minumanKey];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <FeaturedMakananSection
          recipes={featuredMakanan}
          loading={loadingMakanan}
          error={errorMakanan}
          onRecipeClick={onRecipeClick}
          onNavigate={onNavigate}
        />
        <FeaturedMinumanSection
          recipes={featuredMinuman}
          loading={loadingMinuman}
          error={errorMinuman}
          onRecipeClick={onRecipeClick}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
}