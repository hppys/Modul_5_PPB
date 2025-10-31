// src/pages/CreateRecipePage.jsx
import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext'; // Impor hook cache kita
import { ArrowLeft, Upload, X, Plus, Image as ImageIcon, Loader, Save, AlertCircle, CheckCircle } from 'lucide-react';
import recipeService from '../services/recipeService';
import uploadService from '../services/uploadService';
import { saveDraft, loadDraft, deleteDraft, hasDraft, getDraftTimestamp, formatDraftTime } from '../utils/draftStorage';
import ConfirmModal from '../components/modals/ConfirmModal';

export default function CreateRecipePage({ onBack, onSuccess }) {
  // ... (State form tidak berubah) ...
  const [currentStep, setCurrentStep] = useState('upload');
  const [formData, setFormData] = useState({
    name: '',
    category: 'makanan',
    description: '',
    prep_time: '',
    cook_time: '',
    servings: '',
    difficulty: 'mudah',
    is_featured: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
  const [steps, setSteps] = useState(['']);
  
  // Ganti state error dan loading manual
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftTimestamp, setDraftTimestamp] = useState(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Panggil hook cache kita
  const { invalidateCache } = useData();
  
  // (Fungsi-fungsi lain TIDAK BERUBAH, kecuali handleSubmit)
  // ... (useEffect, handleLoadDraft, handleDiscardDraft, handleSaveDraft, ...)
  // ... (handleImageChange, handleUploadImage, handleChangeImage, ...)
  // ... (handleIngredientChange, addIngredient, removeIngredient, ...)
  // ... (handleStepChange, addStep, removeStep, validateForm) ...

  // Ganti handleSubmit untuk invalidasi cache
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!uploadedImageUrl) {
      setError('Gambar harus diupload terlebih dahulu');
      return;
    }
    if (!validateForm()) {
      return;
    }
    try {
      setCreating(true);
      
      const validIngredients = ingredients.filter(ing => ing.name.trim() && ing.quantity.trim());
      const validSteps = steps.filter(step => step.trim());
      const recipeData = {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        image_url: uploadedImageUrl, 
        prep_time: parseInt(formData.prep_time),
        cook_time: parseInt(formData.cook_time),
        servings: parseInt(formData.servings),
        difficulty: formData.difficulty,
        is_featured: formData.is_featured,
        ingredients: validIngredients,
        steps: validSteps,
      };

      const result = await recipeService.createRecipe(recipeData);
      if (result.success) {
        alert('Resep berhasil dibuat!');
        deleteDraft('create');
        
        // BERSIHKAN CACHE setelah berhasil
        invalidateCache('recipes_');
        
        if (onSuccess) {
          onSuccess(result.data);
        } else if (onBack) {
          onBack();
        }
      } else {
        throw new Error(result.message || 'Gagal membuat resep');
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat membuat resep');
    } finally {
      setCreating(false);
    }
  };

  // (Sisa kode JSX tidak berubah, pastikan menggunakan 'error' dan 'creating')
  // ... (Salin sisa kode JSX dari file Anda sebelumnya) ...
  // ... (Pastikan error message <p>{error}</p>) ...
  // ... (Pastikan tombol submit disabled={creating} dan menampilkan 'Membuat resep...' saat 'creating' true) ...
}