import { useState } from 'react';
import { X, Copy, Check, RefreshCw, Save, Sparkles } from 'lucide-react';

function CoverLetterModal({
  isOpen,
  onClose,
  coverLetter,
  isGenerating,
  onRegenerate,
  onSave,
  company,
  role
}) {
  const [copied, setCopied] = useState(false);
  const [editedLetter, setEditedLetter] = useState(coverLetter);

  const handleCopy = () => {
    navigator.clipboard.writeText(editedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSave(editedLetter);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Cover Letter
                </h2>
                <p className="text-sm text-gray-600">
                  {company} - {role}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              disabled={isGenerating}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={onRegenerate}
              disabled={isGenerating}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>

            <button
              onClick={handleSave}
              disabled={isGenerating}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Save to Notes</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-gray-600">Generating your cover letter with Claude AI...</p>
              <p className="text-sm text-gray-500 mt-2">This usually takes 5-10 seconds</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="label">
                  Edit your cover letter
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Feel free to make any adjustments before copying or saving
                </p>
              </div>
              <textarea
                value={editedLetter}
                onChange={(e) => setEditedLetter(e.target.value)}
                className="input-field font-serif text-sm leading-relaxed"
                rows="20"
                style={{ minHeight: '400px' }}
              />
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Pro tip:</strong> Personalize this further by mentioning specific projects or
                  achievements that align with this role!
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CoverLetterModal;
