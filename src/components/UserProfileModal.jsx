import { useState, useEffect } from 'react';
import { X, User, Sparkles, Info } from 'lucide-react';
import { userProfileStorage } from '../utils/userProfile';

function UserProfileModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    experience: '',
    skills: '',
    tone: 'professional',
    apiKey: ''
  });

  useEffect(() => {
    if (isOpen) {
      const profile = userProfileStorage.getProfile();
      if (profile) {
        setFormData(profile);
      }
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    userProfileStorage.saveProfile(formData);
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                AI Cover Letter Setup
              </h2>
              <p className="text-sm text-gray-600">Configure your profile once, generate infinite cover letters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* API Key */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">Get Your Free API Key</h3>
                <p className="text-sm text-blue-800 mb-2">
                  1. Go to <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">console.anthropic.com</a>
                  <br />2. Sign up (free $5 credit)
                  <br />3. Create an API key and paste it below
                </p>
                <p className="text-xs text-blue-700">
                  Cost: ~$0.10-0.15 per cover letter. Your $5 = 30-50 cover letters!
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="label">
              Claude API Key *
            </label>
            <input
              type="password"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleChange}
              required
              className="input-field font-mono text-sm"
              placeholder="sk-ant-api03-..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Your key is stored locally in your browser and never sent anywhere except to Claude API
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Your Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="label">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="e.g., Jane Smith"
                />
              </div>

              <div>
                <label className="label">
                  Key Experience (2-3 points) *
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="input-field"
                  placeholder="e.g., 5+ years in full-stack development, Led team of 10 engineers, Specialized in React and Node.js"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Highlight your most relevant achievements and experience
                </p>
              </div>

              <div>
                <label className="label">
                  Core Skills *
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="e.g., React, TypeScript, Python, AWS, Team Leadership"
                />
                <p className="text-xs text-gray-500 mt-1">
                  List your main technical and soft skills (comma-separated)
                </p>
              </div>

              <div>
                <label className="label">
                  Cover Letter Tone
                </label>
                <select
                  name="tone"
                  value={formData.tone}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="professional">Professional (balanced and formal)</option>
                  <option value="enthusiastic">Enthusiastic (energetic and passionate)</option>
                  <option value="casual">Casual (friendly and conversational)</option>
                  <option value="formal">Formal (very traditional and conservative)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Save & Start Generating</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserProfileModal;
