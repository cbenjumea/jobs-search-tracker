import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/localStorage';
import { sampleApplications } from '../data/sampleData';

const JobContext = createContext();

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

export const JobProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplications = () => {
      const saved = storage.getApplications();
      if (saved && saved.length > 0) {
        setApplications(saved);
      } else {
        setApplications(sampleApplications);
        storage.saveApplications(sampleApplications);
      }
      setLoading(false);
    };

    loadApplications();
  }, []);

  useEffect(() => {
    if (!loading && applications.length >= 0) {
      storage.saveApplications(applications);
    }
  }, [applications, loading]);

  const addApplication = (application) => {
    const newApp = {
      ...application,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setApplications(prev => [...prev, newApp]);
    return newApp;
  };

  const updateApplication = (id, updates) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === id
          ? { ...app, ...updates, updatedAt: new Date().toISOString() }
          : app
      )
    );
  };

  const deleteApplication = (id) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  const updateStage = (id, newStage) => {
    updateApplication(id, { stage: newStage });
  };

  const getApplicationById = (id) => {
    return applications.find(app => app.id === id);
  };

  const getApplicationsByStage = (stage) => {
    return applications.filter(app => app.stage === stage);
  };

  const exportData = () => {
    storage.exportData(applications);
  };

  const importData = async (file) => {
    try {
      const data = await storage.importData(file);
      setApplications(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const clearAllData = () => {
    setApplications([]);
    storage.clearAll();
  };

  const getApplicationsNeedingFollowup = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return applications.filter(app => {
      if (!app.nextActionDeadline || app.stage === 'Rejected' || app.stage === 'Offer') {
        return false;
      }
      const deadline = new Date(app.nextActionDeadline);
      deadline.setHours(0, 0, 0, 0);
      return deadline <= today;
    });
  };

  const value = {
    applications,
    loading,
    addApplication,
    updateApplication,
    deleteApplication,
    updateStage,
    getApplicationById,
    getApplicationsByStage,
    exportData,
    importData,
    clearAllData,
    getApplicationsNeedingFollowup
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};
