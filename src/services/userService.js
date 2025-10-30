const USER_PROFILE_KEY = 'user_profile'; 
const USER_IDENTIFIER_KEY = 'user_identifier'; 

/**
 * Get atau buat user identifier unik dan simpan di localStorage
 */
export const getUserIdentifier = () => { 
  let userId = localStorage.getItem(USER_IDENTIFIER_KEY); 
  if (!userId) { 
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`; 
    localStorage.setItem(USER_IDENTIFIER_KEY, userId); 
  }
  return userId; 
};

/**
 * Get profil user dari localStorage
 */
export const getUserProfile = () => { 
  try {
    const profile = localStorage.getItem(USER_PROFILE_KEY); 
    if (profile) {
      return JSON.parse(profile); 
    }
    // Return default profile jika tidak ada [cite: 795-801]
    return {
      username: 'Pengguna', 
      avatar: null, 
      bio: '', 
      userId: getUserIdentifier() 
    };
  } catch (error) {
    // Return default profile jika ada error [cite: 803-809]
    return {
      username: 'Pengguna',
      avatar: null,
      bio: '',
      userId: getUserIdentifier()
    };
  }
};

/**
 * Simpan profil user ke localStorage
 */
export const saveUserProfile = (profile) => { 
  try {
    const userId = getUserIdentifier(); 
    const profileData = {
      ...profile, 
      userId, 
      updatedAt: new Date().toISOString() 
    };
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profileData));
    return { success: true, data: profileData }; 
  } catch (error) {
    return { success: false, message: error.message }; 
  }
};

// ... (Fungsi-fungsi lain seperti updateAvatar, updateUsername, updateBio) [cite: 831-871]

export default { 
  getUserIdentifier, 
  getUserProfile, 
  saveUserProfile, 
  // ...
};