const USER_PROFILE_KEY = 'job-search-user-profile';

export const userProfileStorage = {
  /**
   * Get user profile from localStorage
   * @returns {Object|null} User profile or null
   */
  getProfile: () => {
    try {
      const data = localStorage.getItem(USER_PROFILE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading user profile:', error);
      return null;
    }
  },

  /**
   * Save user profile to localStorage
   * @param {Object} profile - User profile data
   */
  saveProfile: (profile) => {
    try {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  },

  /**
   * Check if user profile exists
   * @returns {boolean}
   */
  hasProfile: () => {
    const profile = userProfileStorage.getProfile();
    return profile && profile.name && profile.apiKey;
  }
};
