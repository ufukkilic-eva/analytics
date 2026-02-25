import React from 'react';
import { MessageSquare } from 'lucide-react';

export function ChatsView() {
  const chats = [
    { name: 'Sarah Johnson', message: 'Thanks for the update on the project', time: '5m ago', unread: 2 },
    { name: 'Marketing Team', message: 'Can we schedule a quick sync?', time: '1h ago', unread: 5 },
    { name: 'John Smith', message: 'The report looks great!', time: '2h ago', unread: 0 },
    { name: 'Design Team', message: 'New mockups are ready for review', time: '3h ago', unread: 3 },
    { name: 'Mike Davis', message: 'When is the next standup?', time: 'Yesterday', unread: 1 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageSquare size={28} style={{ color: 'var(--brand-purple)' }} />
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Chats
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Stay connected with your team
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {chats.map((chat, index) => (
          <div
            key={index}
            className="rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all hover:brightness-110"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--neutral-border)',
            }}
          >
            <div className="flex items-center gap-4 flex-1">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm"
                style={{
                  background: 'var(--brand-purple)',
                  color: 'var(--text-primary)',
                }}
              >
                {chat.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {chat.name}
                </h3>
                <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                  {chat.message}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                {chat.time}
              </span>
              {chat.unread > 0 && (
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center"
                  style={{
                    background: 'var(--brand-blue)',
                    color: 'white',
                  }}
                >
                  {chat.unread}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
