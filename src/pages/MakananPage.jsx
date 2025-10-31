// src/pages/MakananPage.jsx
import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext'; // Impor hook cache kita
import recipeService from '../services/recipeService'; // Impor service
import RecipeGrid from '../components/makanan/RecipeGrid';
import AdvancedFilter from '../components/common/AdvancedFilter';

export default function MakananPage({ onRecipeClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    difficulty: '',
    sortBy: 'created_at',
    order: 'desc',
    prepTimeMax: '',
  });
  const [page, setPage] = useState(1);

  // Panggil hook context kita
  const { cache, loading, error, fetchAndCache } = useData();

  const queryParams = {
    category: 'makanan',
    search: searchQuery || undefined,
    difficulty: filters.difficulty || undefined,
    page,
    limit: 12,
    sort_by: filters.sortBy,
    order: filters.order
  };
  
  // Buat cache key unik
  const cacheKey = `recipes_${JSON.stringify(queryParams)}`;

  // Gunakan useEffect untuk mengambil data
  useEffect(() => {
    fetchAndCache(cacheKey, () => recipeService.getRecipes(queryParams));
  }, [cacheKey, fetchAndCache]); // Tambahkan fetchAndCache

  // Ambil state spesifik untuk key ini dari context
  const data = cache[cacheKey];
  const isLoading = loading[cacheKey];
  const errorMessage = error[cacheKey];

  // Ambil data resep dan pagination
  const recipes = data?.data || [];
  const pagination = data?.pagination;

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setPage(1); 
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); 
  };

  const filteredRecipes = filters.prepTimeMax
    ? recipes.filter(recipe => recipe.prep_time <= parseInt(filters.prepTimeMax))
    : recipes;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 pb-20 md:pb-8">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4">
            Resep Makanan
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Temukan berbagai resep makanan nusantara yang lezat
          </p>
        </div>

        <AdvancedFilter
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          initialFilters={{ ...filters, search: searchQuery }}
        />

        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat resep...</p>
          </div>
        )}

        {errorMessage && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600 font-semibold mb-2">Terjadi Kesalahan</p>
              <p className="text-red-500">{errorMessage}</p> 
              <button
                onClick={() => fetchAndCache(cacheKey, () => recipeService.getRecipes(queryParams), { force: true })} // Paksa ambil ulang
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}

        {!isLoading && !errorMessage && (
          <>
            {filteredRecipes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  Tidak ada resep ditemukan
                </p>
                <p className="text-gray-500 mt-2">
                  Coba ubah filter atau kata kunci pencarian
                </p>
              </div>
            ) : (
              <RecipeGrid recipes={filteredRecipes} onRecipeClick={onRecipeClick} />
            )}

            {pagination && pagination.total_pages > 1 && (
              <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-6 py-3 bg-white/80 backdrop-blur border border-slate-300 rounded-xl hover:bg-blue-50 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-slate-700"
                >
                  &larr; Sebelumnya
                </button>
                <div className="flex flex-col md:flex-row items-center gap-2 bg-white/60 backdrop-blur px-4 py-2 rounded-xl border border-white/40">
                  <span className="text-slate-700 font-semibold">
                    Halaman {pagination.page} dari {pagination.total_pages}
                  </span>
                  <span className="text-slate-500 text-sm">
                    ({pagination.total} resep)
                  </span>
                </div>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page === pagination.total_pages}
                  className="px-6 py-3 bg-white/80 backdrop-blur border border-slate-300 rounded-xl hover:bg-blue-50 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-slate-700"
                >
                  Selanjutnya &rarr;
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}