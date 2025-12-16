import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useJobs } from '../context/JobContext';
import { STAGES, getPriorityColor, getPriorityLabel } from '../types';
import { formatDate, getDeadlineStatus } from '../utils/dateUtils';
import { Building2, Calendar, AlertCircle, Edit, Trash2, ExternalLink, Sparkles } from 'lucide-react';

function JobCard({ application, onEdit, onDelete, onGenerateCoverLetter }) {
  const deadlineStatus = getDeadlineStatus(application.nextActionDeadline);
  const priorityColor = getPriorityColor(application.priority);

  return (
    <div className={`bg-white rounded-lg border-2 p-3 mb-2 hover:shadow-md transition-shadow ${priorityColor}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm">{application.company}</h4>
          <p className="text-xs text-gray-600 mt-1">{application.role}</p>
        </div>
        <div className="flex space-x-1 ml-2">
          <button
            onClick={() => onGenerateCoverLetter(application)}
            className="p-1 hover:bg-purple-100 rounded"
            title="Generate Cover Letter with AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          </button>
          <button
            onClick={() => onEdit(application)}
            className="p-1 hover:bg-gray-100 rounded"
            title="Edit"
          >
            <Edit className="w-3.5 h-3.5 text-gray-600" />
          </button>
          <button
            onClick={() => onDelete(application.id)}
            className="p-1 hover:bg-red-100 rounded"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
          </button>
        </div>
      </div>

      <div className="space-y-1.5 text-xs">
        <div className="flex items-center text-gray-600">
          <Building2 className="w-3 h-3 mr-1.5" />
          <span>{application.method}</span>
        </div>

        {application.nextActionDeadline && (
          <div className={`flex items-center ${deadlineStatus.color}`}>
            <Calendar className="w-3 h-3 mr-1.5" />
            <span>{deadlineStatus.label}</span>
          </div>
        )}

        {application.nextAction && (
          <div className="flex items-start text-gray-700 mt-2 pt-2 border-t border-gray-200">
            <AlertCircle className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{application.nextAction}</span>
          </div>
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between">
        <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-700">
          Priority: {application.priority}
        </span>
        {application.jobDescriptionUrl && (
          <a
            href={application.jobDescriptionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700"
            title="View job description"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

function KanbanView({ onEditJob, onGenerateCoverLetter }) {
  const { applications, updateStage, deleteApplication } = useJobs();

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStage = STAGES[destination.droppableId];

    updateStage(draggableId, newStage);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      deleteApplication(id);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {STAGES.map((stage, stageIndex) => {
          const stageApplications = applications.filter(app => app.stage === stage);

          return (
            <div key={stage} className="flex-shrink-0 w-80">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm">{stage}</h3>
                  <span className="bg-white px-2 py-0.5 rounded-full text-xs font-medium text-gray-700">
                    {stageApplications.length}
                  </span>
                </div>

                <Droppable droppableId={String(stageIndex)}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[200px] transition-colors ${
                        snapshot.isDraggingOver ? 'bg-primary-50' : ''
                      }`}
                    >
                      {stageApplications.map((app, index) => (
                        <Draggable key={app.id} draggableId={app.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={snapshot.isDragging ? 'opacity-70' : ''}
                            >
                              <JobCard
                                application={app}
                                onEdit={onEditJob}
                                onDelete={handleDelete}
                                onGenerateCoverLetter={onGenerateCoverLetter}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {stageApplications.length === 0 && (
                        <div className="text-center py-8 text-gray-400 text-sm">
                          No applications
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}

export default KanbanView;
