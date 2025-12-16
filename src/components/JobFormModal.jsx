import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { STAGES, METHODS } from '../types';

function JobFormModal({ job, onClose }) {
  const { addApplication, updateApplication } = useJobs();
  const isEditing = !!job;

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    applicationDate: new Date().toISOString().split('T')[0],
    method: 'LinkedIn',
    stage: 'Applied',
    priority: 5,
    nextAction: '',
    nextActionDeadline: '',
    salaryRange: '',
    notes: '',
    jobDescriptionUrl: ''
  });

  useEffect(() => {
    if (job) {
      setFormData({
        company: job.company || '',
        role: job.role || '',
        applicationDate: job.applicationDate || '',
        method: job.method || 'LinkedIn',
        stage: job.stage || 'Applied',
        priority: job.priority || 5,
        nextAction: job.nextAction || '',
        nextActionDeadline: job.nextActionDeadline || '',
        salaryRange: job.salaryRange || '',
        notes: job.notes || '',
        jobDescriptionUrl: job.jobDescriptionUrl || ''
      });
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'priority' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      updateApplication(job.id, formData);
    } else {
      addApplication(formData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Application' : 'Add New Application'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                Company Name *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="e.g., TechCorp"
              />
            </div>

            <div>
              <label className="label">
                Role/Position *
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="e.g., Senior Developer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                Application Date *
              </label>
              <input
                type="date"
                name="applicationDate"
                value={formData.applicationDate}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="label">
                Application Method *
              </label>
              <select
                name="method"
                value={formData.method}
                onChange={handleChange}
                required
                className="input-field"
              >
                {METHODS.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                Current Stage *
              </label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                required
                className="input-field"
              >
                {STAGES.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">
                Priority (1-10) *
              </label>
              <input
                type="number"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
                min="1"
                max="10"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label">
              Next Action
            </label>
            <input
              type="text"
              name="nextAction"
              value={formData.nextAction}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Prepare for technical interview"
            />
          </div>

          <div>
            <label className="label">
              Next Action Deadline
            </label>
            <input
              type="date"
              name="nextActionDeadline"
              value={formData.nextActionDeadline}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="label">
              Salary Range
            </label>
            <input
              type="text"
              name="salaryRange"
              value={formData.salaryRange}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., $100k - $130k"
            />
          </div>

          <div>
            <label className="label">
              Job Description URL
            </label>
            <input
              type="url"
              name="jobDescriptionUrl"
              value={formData.jobDescriptionUrl}
              onChange={handleChange}
              className="input-field"
              placeholder="https://example.com/job"
            />
          </div>

          <div>
            <label className="label">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="input-field"
              placeholder="Add any additional notes..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              {isEditing ? 'Update Application' : 'Add Application'}
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

export default JobFormModal;
