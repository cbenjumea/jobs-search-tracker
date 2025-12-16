import { useState, useMemo } from 'react';
import { useJobs } from '../context/JobContext';
import { STAGES, METHODS, getPriorityColor, getPriorityLabel } from '../types';
import { formatDate } from '../utils/dateUtils';
import { Search, Edit, Trash2, ExternalLink, ArrowUpDown } from 'lucide-react';

function ListView({ onEditJob }) {
  const { applications, deleteApplication } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [sortField, setSortField] = useState('applicationDate');
  const [sortDirection, setSortDirection] = useState('desc');

  const filteredAndSorted = useMemo(() => {
    let filtered = applications.filter(app => {
      const matchesSearch =
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStage = !filterStage || app.stage === filterStage;
      const matchesMethod = !filterMethod || app.method === filterMethod;

      let matchesPriority = true;
      if (filterPriority === 'high') matchesPriority = app.priority >= 8;
      else if (filterPriority === 'medium') matchesPriority = app.priority >= 4 && app.priority < 8;
      else if (filterPriority === 'low') matchesPriority = app.priority < 4;

      return matchesSearch && matchesStage && matchesMethod && matchesPriority;
    });

    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'applicationDate' || sortField === 'nextActionDeadline') {
        aVal = aVal ? new Date(aVal).getTime() : 0;
        bVal = bVal ? new Date(bVal).getTime() : 0;
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [applications, searchTerm, filterStage, filterMethod, filterPriority, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      deleteApplication(id);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStage('');
    setFilterMethod('');
    setFilterPriority('');
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search company or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="input-field"
          >
            <option value="">All Stages</option>
            {STAGES.map(stage => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>

          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="input-field"
          >
            <option value="">All Methods</option>
            {METHODS.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="input-field"
          >
            <option value="">All Priorities</option>
            <option value="high">High (8-10)</option>
            <option value="medium">Medium (4-7)</option>
            <option value="low">Low (1-3)</option>
          </select>

          <button
            onClick={clearFilters}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredAndSorted.length} of {applications.length} applications
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('company')}
              >
                <div className="flex items-center space-x-1">
                  <span>Company</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center space-x-1">
                  <span>Role</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('applicationDate')}
              >
                <div className="flex items-center space-x-1">
                  <span>Applied</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Method
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Stage
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('priority')}
              >
                <div className="flex items-center space-x-1">
                  <span>Priority</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('nextActionDeadline')}
              >
                <div className="flex items-center space-x-1">
                  <span>Deadline</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAndSorted.map(app => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {app.company}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {app.role}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {formatDate(app.applicationDate)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {app.method}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-800">
                    {app.stage}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex text-xs px-2 py-1 rounded-full ${getPriorityColor(app.priority)}`}>
                    {getPriorityLabel(app.priority)} ({app.priority})
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {app.nextActionDeadline ? formatDate(app.nextActionDeadline) : '-'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    {app.jobDescriptionUrl && (
                      <a
                        href={app.jobDescriptionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                        title="View job description"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => onEditJob(app)}
                      className="text-gray-600 hover:text-gray-900"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(app.id)}
                      className="text-red-600 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSorted.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No applications found. Try adjusting your filters.
          </div>
        )}
      </div>
    </div>
  );
}

export default ListView;
