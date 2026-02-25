import React from 'react';
import { CheckSquare } from 'lucide-react';

export function TasksView() {
  const tasks = [
    { title: 'Complete Q4 financial report', priority: 'High', status: 'In Progress', dueDate: 'Dec 10' },
    { title: 'Review marketing campaign designs', priority: 'Medium', status: 'Pending', dueDate: 'Dec 12' },
    { title: 'Update client presentation deck', priority: 'High', status: 'In Progress', dueDate: 'Dec 11' },
    { title: 'Schedule team retrospective', priority: 'Low', status: 'Pending', dueDate: 'Dec 15' },
    { title: 'Prepare monthly newsletter', priority: 'Medium', status: 'Completed', dueDate: 'Dec 8' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return { bg: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)' };
      case 'Medium':
        return { bg: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' };
      default:
        return { bg: 'rgba(4, 114, 253, 0.15)', color: 'var(--brand-blue)' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return { bg: 'rgba(34, 197, 94, 0.15)', color: 'var(--success)' };
      case 'In Progress':
        return { bg: 'rgba(4, 114, 253, 0.15)', color: 'var(--brand-blue)' };
      default:
        return { bg: 'var(--bg-tertiary)', color: 'var(--text-secondary)' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CheckSquare size={28} style={{ color: 'var(--brand-purple)' }} />
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Tasks
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Track and manage your tasks
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task, index) => {
          const priorityStyle = getPriorityColor(task.priority);
          const statusStyle = getStatusColor(task.status);
          
          return (
            <div
              key={index}
              className="rounded-xl p-5"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--neutral-border)',
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-base font-medium flex-1" style={{ color: 'var(--text-primary)' }}>
                  {task.title}
                </h3>
                <span
                  className="text-xs font-semibold px-2 py-1 rounded ml-3"
                  style={{
                    background: priorityStyle.bg,
                    color: priorityStyle.color,
                  }}
                >
                  {task.priority}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-medium px-2 py-1 rounded"
                  style={{
                    background: statusStyle.bg,
                    color: statusStyle.color,
                  }}
                >
                  {task.status}
                </span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Due: {task.dueDate}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
