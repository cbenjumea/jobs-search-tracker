const STORAGE_KEY = 'job-search-dashboard';

export const storage = {
  /**
   * Get all job applications from localStorage
   * @returns {Array} Array of job applications
   */
  getApplications: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  /**
   * Save job applications to localStorage
   * @param {Array} applications - Array of job applications
   */
  saveApplications: (applications) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  /**
   * Clear all data from localStorage
   */
  clearAll: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  /**
   * Export data as JSON file
   * @param {Array} applications - Array of job applications
   */
  exportData: (applications) => {
    try {
      const dataStr = JSON.stringify(applications, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `job-applications-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  },

  /**
   * Import data from JSON file
   * @param {File} file - JSON file to import
   * @returns {Promise<Array>} Promise resolving to array of applications
   */
  importData: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          resolve(data);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  }
};
