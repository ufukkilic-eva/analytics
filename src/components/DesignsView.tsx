import React from 'react';
import { Layout } from 'lucide-react';

export function DesignsView() {
  const designs = [
    { name: 'Homepage Redesign', status: 'In Review', date: 'Dec 8, 2024', category: 'Web Design' },
    { name: 'Mobile App UI Kit', status: 'Completed', date: 'Dec 5, 2024', category: 'Mobile' },
    { name: 'Brand Guidelines v2', status: 'In Progress', date: 'Dec 10, 2024', category: 'Branding' },
    { name: 'Email Campaign Templates', status: 'Draft', date: 'Dec 12, 2024', category: 'Marketing' },
    { name: 'Dashboard Mockups', status: 'In Review', date: 'Dec 9, 2024', category: 'Web Design' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Completed':
        return { bg: 'rgba(34, 197, 94, 0.15)', color: 'var(--success)' };
      case 'In Progress':
        return { bg: 'rgba(4, 114, 253, 0.15)', color: 'var(--brand-blue)' };
      case 'In Review':
        return { bg: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' };
      default:
        return { bg: 'var(--bg-tertiary)', color: 'var(--text-secondary)' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Layout size={28} style={{ color: 'var(--brand-purple)' }} />
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Designs
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Manage your design projects and files
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {designs.map((design, index) => {
          const statusStyle = getStatusStyle(design.status);
          
          return (
            <div
              key={index}
              className="rounded-xl p-5 cursor-pointer transition-all hover:brightness-110"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--neutral-border)',
              }}
            >
              <div
                className="w-full h-32 rounded-lg mb-4 flex items-center justify-center"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--neutral-border)',
                }}
              >
                <Layout size={40} style={{ color: 'var(--text-muted)' }} />
              </div>
              
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                {design.name}
              </h3>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {design.category}
                </span>
                <span
                  className="text-xs font-semibold px-2 py-1 rounded"
                  style={{
                    background: statusStyle.bg,
                    color: statusStyle.color,
                  }}
                >
                  {design.status}
                </span>
              </div>
              
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Updated: {design.date}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
