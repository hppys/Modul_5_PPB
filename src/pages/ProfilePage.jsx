// src/pages/ProfilePage.jsx
import { useState, useEffect, useRef } from 'react'; // Impor useRef
import { useFavorites } from '../hooks/useFavorites';
// Impor fungsi-fungsi yang kita butuhkan
import { getUserProfile, updateUsername, updateAvatar } from '../services/userService';
import { User, Loader, Heart, Clock, ChefHat, Star, Edit, X, Check, Camera } from 'lucide-react'; // Impor Camera
import FavoriteButton from '../components/common/FavoriteButton';

export default function ProfilePage({ onRecipeClick }) {
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  
  // 1. Tambahkan ref untuk input file yang tersembunyi
  const fileInputRef = useRef(null);

  const { favorites, loading, error, refetch } = useFavorites();

  useEffect(() => {
    const profile = getUserProfile();
    setUserProfile(profile);
    setNewUsername(profile.username);
  }, []);

  const handleSaveUsername = () => {
    if (!newUsername.trim()) {
      alert('Nama pengguna tidak boleh kosong.');
      setNewUsername(userProfile.username);
      setIsEditing(false);
      return;
    }
    
    const result = updateUsername(newUsername);
    
    if (result.success) {
      setUserProfile(result.data); 
      alert('Nama pengguna berhasil diperbarui!');
    } else {
      alert('Gagal menyimpan nama pengguna.');
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setNewUsername(userProfile.username); 
    setIsEditing(false);
  };

  // 2. Fungsi untuk memicu klik pada input file
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  // 3. Fungsi untuk memproses file yang di-upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi sederhana (Maks 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File terlalu besar! Maksimal 2MB.');
      return;
    }

    // Gunakan FileReader untuk mengubah gambar menjadi string Base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result;
      
      // Simpan string Base64 ke localStorage via userService
      const result = updateAvatar(base64String);
      
      if (result.success) {
        // Update state lokal agar gambar langsung berubah
        setUserProfile(result.data);
        alert('Foto profil berhasil diperbarui!');
      } else {
        alert('Gagal memperbarui foto.');
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      alert('Gagal membaca file.');
    };
  };

  const handleFavoriteClick = (recipeId, category) => {
    onRecipeClick(recipeId, category);
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 pb-20 md:pb-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              
              {/* 4. Ganti UI Avatar */}
              <div className="relative flex-shrink-0">
                {userProfile.avatar ? (
                  // Tampilkan foto jika ada
                  <img 
                    src={userProfile.avatar} 
                    alt="Avatar" 
                    className="w-20 h-20 rounded-full object-cover" 
                  />
                ) : (
                  // Tampilkan ikon User jika tidak ada foto
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-12 h-12 text-blue-500" />
                  </div>
                )}
                {/* Tombol edit foto */}
                <button
                  onClick={handleAvatarClick}
                  className="absolute -bottom-1 -right-1 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  title="Ganti foto profil"
                >
                  <Camera className="w-4 h-4 text-blue-600" />
                </button>
                {/* 5. Input file yang tersembunyi */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg"
                  className="hidden"
                />
              </div>

              {/* (UI Ganti Nama - tidak berubah) */}
              {!isEditing ? (
                <div className="w-full">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 break-all">
                    {userProfile.username}
                  </h1>
                  <p className="text-slate-500 text-sm break-all">
                    ID: {userProfile.userId}
                  </p>
                </div>
              ) : (
                <div className="w-full">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="text-2xl md:text-3xl font-bold text-gray-800 border-b-2 border-blue-500 focus:outline-none w-full"
                  />
                  <p className="text-slate-500 text-sm break-all">
                    ID: {userProfile.userId}
                  </p>
                </div>
              )}
            </div>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-shrink-0 p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                title="Edit Nama"
              >
                <Edit className="w-5 h-5" />
              </button>
            ) : (
              <div className="flex-shrink-0 flex gap-2">
                <button
                  onClick={handleSaveUsername}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                  title="Simpan"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                  title="Batal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ... (Sisa kode untuk Statistik Favorit dan Daftar Favorit tidak berubah) ... */}
        
        <div className="grid grid-cols-1 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Resep Favorit</p>
              {loading ? (
                <p className="text-2xl font-bold text-gray-800">Memuat...</p>
              ) : (
                <p className="text-2xl font-bold text-gray-800">
                  {favorites.length} Resep
                </p>
              )}
            </div>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Heart className="text-red-500" />
          Resep Favorit Saya
        </h2>

        {loading && (
          <div className="text-center py-12">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Memuat resep favorit...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12 bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600 font-semibold mb-2">Terjadi Kesalahan</p>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {favorites.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-md">
                <p className="text-slate-500 text-lg">Anda belum memiliki resep favorit.</p>
                <p className="text-slate-400 mt-2">Cari resep dan klik ikon hati untuk menambahkannya!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {favorites.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="group transform transition-all duration-700 opacity-100"
                  >
                    <div
                      onClick={() => handleFavoriteClick(recipe.id, recipe.category)}
                      className="relative bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-2xl shadow-blue-500/5 hover:shadow-blue-500/15 transition-all duration-500 cursor-pointer group-hover:scale-105 group-hover:bg-white/20"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative h-32 md:h-56 overflow-hidden">
                        <img
                          src={recipe.image_url}
                          alt={recipe.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        <div className="absolute top-3 right-3 z-10">
                          <FavoriteButton recipeId={recipe.id} size="sm" />
                        </div>
                      </div>
                      <div className="relative z-10 p-4 md:p-8">
                        <div className="flex items-center justify-between mb-3 md:mb-4">
                          <span className={`text-xs font-semibold ${
                            recipe.category === 'makanan'
                              ? 'text-blue-700 bg-blue-100/90'
                              : 'text-green-700 bg-green-100/90'
                          } px-2 md:px-3 py-1 md:py-1.5 rounded-full`}>
                            {recipe.category}
                          </span>
                          {recipe.average_rating > 0 && (
                            <div className="flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-full">
                              <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-current" />
                              <span className="text-xs md:text-sm font-semibold text-slate-700">{recipe.average_rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-800 mb-3 md:mb-4 text-base md:text-xl group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                          {recipe.name}
                        </h3>
                        <div className="flex items-center justify-between text-xs md:text-sm text-slate-600">
                          <div className="flex items-center space-x-1 md:space-x-2 bg-white/70 px-2 md:px-3 py-1 md:py-2 rounded-full">
                            <Clock className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="font-medium">{recipe.prep_time} menit</span>
                          </div>
                          <div className="flex items-center space-x-1 md:space-x-2 bg-white/70 px-2 md:px-3 py-1 md:py-2 rounded-full">
                            <ChefHat className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="font-medium">{recipe.difficulty}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}