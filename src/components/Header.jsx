import { Briefcase, Download, Upload, Trash2, LogOut } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { useRef, useState } from 'react';

function Header() {
  const { applications, exportData, importData, clearAllData } = useJobs();
  const fileInputRef = useRef(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleExport = () => {
    exportData();
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const result = await importData(file);
      if (result.success) {
        alert('Data imported successfully!');
      } else {
        alert(`Import failed: ${result.error}`);
      }
    }
    e.target.value = '';
  };

  const handleClearAll = () => {
    setShowConfirm(true);
  };

  const confirmClearAll = () => {
    clearAllData();
    setShowConfirm(false);
    alert('All data cleared successfully!');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      sessionStorage.removeItem('jobs-tracker-authenticated');
      window.location.reload();
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Jobs Search Tracker</h1>
                <p className="text-sm text-gray-500">{applications.length} applications tracked</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Export data"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Import data"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Import</span>
              </button>

              <button
                onClick={handleClearAll}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                title="Clear all data"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear All</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </header>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Clear All Data?</h3>
            <p className="text-gray-600 mb-4">
              This will permanently delete all your job applications. This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={confirmClearAll}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, Clear All
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
