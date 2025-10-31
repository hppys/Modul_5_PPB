// src/context/DataContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';

// 1. Buat Context
const DataContext = createContext();

// 2. Buat Provider (si "Tas Ransel")
export function DataProvider({ children }) {
  const [cache, setCache] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});

  /**
   * Fungsi utama untuk mengambil dan menyimpan data di cache
   * key: Nama unik untuk data ini (cth: "recipes_makanan_page_1")
   * apiFn: Fungsi yang memanggil API (cth: () => recipeService.getRecipes(params))
   * options: { force: true } jika ingin memaksa ambil data baru
   */
  const fetchAndCache = useCallback(async (key, apiFn, options = {}) => {
    // Jika data sudah ada di cache DAN kita tidak memaksa, jangan lakukan apa-apa
    if (cache[key] && !options.force) {
      return;
    }

    // Jika sedang loading, jangan panggil lagi
    if (loading[key]) {
      return;
    }

    try {
      setLoading(prev => ({ ...prev, [key]: true }));
      setError(prev => ({ ...prev, [key]: null }));
      
      const response = await apiFn(); // Panggil fungsi API
      
      if (response.success) {
        // Simpan data ke cache
        setCache(prev => ({ ...prev, [key]: response }));
      } else {
        setError(prev => ({ ...prev, [key]: response.message || 'Gagal mengambil data' }));
      }
    } catch (err) {
      setError(prev => ({ ...prev, [key]: err.message || 'Terjadi error' }));
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  }, [cache, loading]); // Perlu 'cache' dan 'loading' di dependency

  /**
   * Fungsi untuk membersihkan cache.
   * Kita panggil ini setelah membuat, mengedit, atau menghapus resep.
   */
  const invalidateCache = useCallback((keyPrefix) => {
    setCache(prevCache => {
      const newCache = { ...prevCache };
      // Hapus semua cache yang diawali dengan prefix (cth: 'recipes')
      Object.keys(newCache).forEach(key => {
        if (key.startsWith(keyPrefix)) {
          delete newCache[key];
        }
      });
      console.log(`Cache invalidated for: ${keyPrefix}`, newCache);
      return newCache;
    });
  }, []);

  const value = { cache, loading, error, fetchAndCache, invalidateCache };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// 3. Buat Hook kustom untuk memakai context ini
export const useData = () => useContext(DataContext);