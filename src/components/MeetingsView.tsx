import React from 'react';
import { Calendar } from 'lucide-react';

export function MeetingsView() {
  const meetings = [
    { title: 'Q4 Strategy Review', time: 'Today at 2:00 PM', attendees: 5, type: 'Team' },
    { title: 'Client Presentation - Acme', time: 'Tomorrow at 10:00 AM', attendees: 3, type: 'Client' },
    { title: 'Product Roadmap Discussion', time: 'Dec 15 at 3:00 PM', attendees: 8, type: 'Team' },
    { title: 'Budget Planning 2024', time: 'Dec 18 at 1:00 PM', attendees: 4, type: 'Internal' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calendar size={28} style={{ color: 'var(--brand-purple)' }} />
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Meetings
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Schedule and manage your meetings
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {meetings.map((meeting, index) => (
          <div
            key={index}
            className="rounded-xl p-5 flex items-center justify-between"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--neutral-border)',
            }}
          >
            <div className="flex-1">
              <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                {meeting.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {meeting.time}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className="text-xs font-semibold px-2 py-1 rounded"
                style={{
                  background: 'rgba(4, 114, 253, 0.15)',
                  color: 'var(--brand-blue)',
                }}
              >
                {meeting.type}
              </span>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {meeting.attendees} attendees
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
