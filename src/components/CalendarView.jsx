import { useMemo, useState } from 'react';
import { useJobs } from '../context/JobContext';
import { formatDate, isDeadlineToday, isDeadlinePast } from '../utils/dateUtils';
import { parseISO, startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { getPriorityColor } from '../types';

function CalendarView({ onEditJob }) {
  const { applications } = useJobs();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { calendarDays, applicationsWithDeadlines } = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const appsWithDeadlines = applications.filter(app =>
      app.nextActionDeadline && app.stage !== 'Rejected' && app.stage !== 'Offer'
    );

    return { calendarDays: days, applicationsWithDeadlines: appsWithDeadlines };
  }, [currentMonth, applications]);

  const getApplicationsForDay = (day) => {
    return applicationsWithDeadlines.filter(app =>
      isSameDay(parseISO(app.nextActionDeadline), day)
    );
  };

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={goToToday}
              className="btn-secondary text-sm"
            >
              Today
            </button>
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-50 p-2 text-center text-xs font-semibold text-gray-700">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((day, idx) => {
            const dayApps = getApplicationsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={idx}
                className={`bg-white min-h-[100px] p-2 ${
                  !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday ? 'bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : ''
                }`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayApps.map(app => (
                    <button
                      key={app.id}
                      onClick={() => onEditJob(app)}
                      className={`w-full text-left p-1.5 rounded text-xs hover:opacity-80 transition-opacity ${getPriorityColor(app.priority)}`}
                    >
                      <div className="font-medium truncate">{app.company}</div>
                      <div className="text-xs truncate opacity-90">{app.role}</div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Deadlines List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CalendarIcon className="w-5 h-5 mr-2" />
          Upcoming Deadlines
        </h3>
        <div className="space-y-3">
          {applicationsWithDeadlines
            .sort((a, b) => new Date(a.nextActionDeadline) - new Date(b.nextActionDeadline))
            .slice(0, 10)
            .map(app => {
              const isPast = isDeadlinePast(app.nextActionDeadline);
              const isToday = isDeadlineToday(app.nextActionDeadline);

              return (
                <div
                  key={app.id}
                  className={`flex items-start justify-between p-3 rounded-lg border-2 ${getPriorityColor(app.priority)} ${
                    isPast ? 'opacity-75' : ''
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{app.company}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {app.stage}
                      </span>
                      {isToday && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">
                          Today
                        </span>
                      )}
                      {isPast && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
                          Overdue
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{app.role}</p>
                    <p className="text-sm text-gray-600 mt-1">{app.nextAction}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(app.nextActionDeadline)}
                    </div>
                    <button
                      onClick={() => onEditJob(app)}
                      className="text-xs text-primary-600 hover:text-primary-700 mt-1"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}

          {applicationsWithDeadlines.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No upcoming deadlines
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarView;
