import { useState } from 'react';
import { JobProvider, useJobs } from './context/JobContext';
import { LayoutDashboard, List, Calendar, BarChart3, Plus } from 'lucide-react';
import KanbanView from './components/KanbanView';
import ListView from './components/ListView';
import CalendarView from './components/CalendarView';
import AnalyticsView from './components/AnalyticsView';
import JobFormModal from './components/JobFormModal';
import Header from './components/Header';
import QuickActions from './components/QuickActions';
import UserProfileModal from './components/UserProfileModal';
import CoverLetterModal from './components/CoverLetterModal';
import PasswordGate from './components/PasswordGate';
import { userProfileStorage } from './utils/userProfile';
import { generateCoverLetter } from './services/coverLetterGenerator';

function AppContent() {
  const [activeView, setActiveView] = useState('kanban');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Cover letter states
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCoverLetterModalOpen, setIsCoverLetterModalOpen] = useState(false);
  const [currentCoverLetter, setCurrentCoverLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const { updateApplication } = useJobs();

  const views = [
    { id: 'kanban', name: 'Kanban', icon: LayoutDashboard },
    { id: 'list', name: 'List', icon: List },
    { id: 'calendar', name: 'Calendar', icon: Calendar },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  ];

  const handleAddNew = () => {
    setEditingJob(null);
    setIsFormOpen(true);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingJob(null);
  };

  const handleGenerateCoverLetter = async (application) => {
    setSelectedApplication(application);

    // Check if user has profile set up
    if (!userProfileStorage.hasProfile()) {
      setIsProfileModalOpen(true);
      return;
    }

    // Generate cover letter
    await generateCoverLetterForApp(application);
  };

  const generateCoverLetterForApp = async (application) => {
    const profile = userProfileStorage.getProfile();

    setIsCoverLetterModalOpen(true);
    setIsGenerating(true);
    setCurrentCoverLetter('');

    try {
      const coverLetter = await generateCoverLetter({
        apiKey: profile.apiKey,
        userName: profile.name,
        userExperience: profile.experience,
        userSkills: profile.skills,
        company: application.company,
        role: application.role,
        notes: application.notes,
        tone: profile.tone || 'professional'
      });

      setCurrentCoverLetter(coverLetter);
    } catch (error) {
      alert(`Error generating cover letter: ${error.message}\n\nPlease check your API key and try again.`);
      setIsCoverLetterModalOpen(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleProfileSave = () => {
    // After saving profile, generate the cover letter if there's a selected application
    if (selectedApplication) {
      generateCoverLetterForApp(selectedApplication);
    }
  };

  const handleRegenerateCoverLetter = () => {
    if (selectedApplication) {
      generateCoverLetterForApp(selectedApplication);
    }
  };

  const handleSaveCoverLetter = (coverLetter) => {
    if (selectedApplication) {
      const updatedNotes = selectedApplication.notes
        ? `${selectedApplication.notes}\n\n---\n\nCOVER LETTER:\n\n${coverLetter}`
        : `COVER LETTER:\n\n${coverLetter}`;

      updateApplication(selectedApplication.id, { notes: updatedNotes });
      alert('Cover letter saved to application notes!');
    }
  };

  const handleCloseCoverLetterModal = () => {
    setIsCoverLetterModalOpen(false);
    setSelectedApplication(null);
    setCurrentCoverLetter('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {views.map((view) => {
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  onClick={() => setActiveView(view.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeView === view.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{view.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'kanban' && (
          <KanbanView
            onEditJob={handleEditJob}
            onGenerateCoverLetter={handleGenerateCoverLetter}
          />
        )}
        {activeView === 'list' && <ListView onEditJob={handleEditJob} />}
        {activeView === 'calendar' && <CalendarView onEditJob={handleEditJob} />}
        {activeView === 'analytics' && <AnalyticsView />}
      </main>

      {/* Floating Add Button */}
      <button
        onClick={handleAddNew}
        className="fixed bottom-8 right-8 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-all hover:scale-110 z-20"
        title="Add new application"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Job Form Modal */}
      {isFormOpen && (
        <JobFormModal
          job={editingJob}
          onClose={handleCloseForm}
        />
      )}

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleProfileSave}
      />

      {/* Cover Letter Modal */}
      {isCoverLetterModalOpen && (
        <CoverLetterModal
          isOpen={isCoverLetterModalOpen}
          onClose={handleCloseCoverLetterModal}
          coverLetter={currentCoverLetter}
          isGenerating={isGenerating}
          onRegenerate={handleRegenerateCoverLetter}
          onSave={handleSaveCoverLetter}
          company={selectedApplication?.company}
          role={selectedApplication?.role}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <PasswordGate>
      <JobProvider>
        <AppContent />
      </JobProvider>
    </PasswordGate>
  );
}

export default App;
