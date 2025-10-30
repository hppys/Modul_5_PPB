// src/main.jsx
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import SplashScreen from './pages/SplashScreen';
import HomePage from './pages/HomePage';
import MakananPage from './pages/MakananPage';
import MinumanPage from './pages/MinumanPage';
import ProfilePage from './pages/ProfilePage';
import CreateRecipePage from './pages/CreateRecipePage';
import EditRecipePage from './pages/EditRecipePage';
import RecipeDetail from './components/recipe/RecipeDetail';
import DesktopNavbar from './components/navbar/DesktopNavbar';
import MobileNavbar from './components/navbar/MobileNavbar';
import './index.css';
import PWABadge from './PWABadge';

function AppRoot() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  
  // State baru untuk mengelola tampilan aplikasi
  const [mode, setMode] = useState('list'); // 'list', 'detail', 'create', 'edit'
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('makanan');
  const [editingRecipeId, setEditingRecipeId] = useState(null);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Navigasi utama (Beranda, Makanan, Minuman)
  const handleNavigation = (page) => {
    setCurrentPage(page);
    setMode('list');
    setSelectedRecipeId(null);
    setEditingRecipeId(null);
  };

  // Dipanggil saat tombol "Buat Resep" diklik
  const handleCreateRecipe = () => {
    setMode('create');
  };

  // Dipanggil saat kartu resep diklik
  const handleRecipeClick = (recipeId, category) => {
    setSelectedRecipeId(recipeId);
    setSelectedCategory(category || currentPage);
    setMode('detail');
  };

  // Dipanggil saat tombol "Edit" di halaman detail diklik
  const handleEditRecipe = (recipeId) => {
    setEditingRecipeId(recipeId);
    setMode('edit');
  };

  // Dipanggil saat tombol "Kembali" diklik (dari detail, create, edit)
  const handleBack = () => {
    setMode('list');
    setSelectedRecipeId(null);
    setEditingRecipeId(null);
  };

  // Dipanggil setelah resep baru berhasil dibuat
  const handleCreateSuccess = (newRecipe) => {
    alert('Resep berhasil dibuat!');
    setMode('list');
    // Arahkan pengguna ke kategori resep yang baru dibuat
    if (newRecipe && newRecipe.category) {
      setCurrentPage(newRecipe.category);
    }
  };

  // Dipanggil setelah resep berhasil diedit
  const handleEditSuccess = (updatedRecipe) => {
    alert('Resep berhasil diperbarui!');
    setMode('list');
  };

  // Fungsi untuk menentukan komponen mana yang akan ditampilkan
  const renderCurrentPage = () => {
    // Tampilkan halaman Buat Resep
    if (mode === 'create') {
      return (
        <CreateRecipePage
          onBack={handleBack}
          onSuccess={handleCreateSuccess}
        />
      );
    }

    // Tampilkan halaman Edit Resep
    if (mode === 'edit') {
      return (
        <EditRecipePage
          recipeId={editingRecipeId}
          onBack={handleBack}
          onSuccess={handleEditSuccess}
        />
      );
    }

    // Tampilkan halaman Detail Resep
    if (mode === 'detail') {
      return (
        <RecipeDetail
          recipeId={selectedRecipeId}
          category={selectedCategory}
          onBack={handleBack}
          onEdit={handleEditRecipe}
        />
      );
    }

    // Tampilkan halaman Daftar (Beranda, Makanan, Minuman)
    switch (currentPage) {
      case 'home':
        return <HomePage 
          onRecipeClick={handleRecipeClick} 
          onNavigate={handleNavigation} />;
      case 'makanan':
        return <MakananPage 
          onRecipeClick={handleRecipeClick} />;
      case 'minuman':
        return <MinumanPage 
          onRecipeClick={handleRecipeClick} />;
      case 'profile':
        return <ProfilePage 
          onRecipeClick={handleRecipeClick} />;
      default:
        return <HomePage 
          onRecipeClick={handleRecipeClick} 
          onNavigate={handleNavigation} />;
    }
  };

  if (showSplash) {
    return <SplashScreen 
      onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar hanya tampil saat mode 'list' */}
      {mode === 'list' && (
        <>
          <DesktopNavbar 
            currentPage={currentPage} 
            onNavigate={handleNavigation}
            onCreateRecipe={handleCreateRecipe}
          />
          <MobileNavbar 
            currentPage={currentPage} 
            onNavigate={handleNavigation}
            onCreateRecipe={handleCreateRecipe}
          />
        </>
      )}
      
      {/* Konten Utama */}
      <main className="min-h-screen">
        {renderCurrentPage()}
      </main>

      <PWABadge />
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>,
)