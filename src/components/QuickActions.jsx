import { AlertCircle, X } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { formatDate } from '../utils/dateUtils';
import { useState } from 'react';

function QuickActions() {
  const { getApplicationsNeedingFollowup } = useJobs();
  const [isVisible, setIsVisible] = useState(true);
  const needFollowup = getApplicationsNeedingFollowup();

  if (!isVisible || needFollowup.length === 0) {
    return null;
  }

  return (
    <div className="bg-orange-50 border-l-4 border-orange-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-orange-400" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-orange-800">
              Applications Needing Follow-up ({needFollowup.length})
            </h3>
            <div className="mt-2 text-sm text-orange-700">
              <ul className="list-disc list-inside space-y-1">
                {needFollowup.slice(0, 3).map(app => (
                  <li key={app.id}>
                    <strong>{app.company}</strong> - {app.role}
                    {app.nextActionDeadline && ` (Due: ${formatDate(app.nextActionDeadline)})`}
                  </li>
                ))}
                {needFollowup.length > 3 && (
                  <li className="text-orange-600 font-medium">
                    and {needFollowup.length - 3} more...
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="ml-auto pl-3">
            <button
              onClick={() => setIsVisible(false)}
              className="inline-flex text-orange-400 hover:text-orange-600 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickActions;
