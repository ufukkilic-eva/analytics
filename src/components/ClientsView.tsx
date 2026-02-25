import React from 'react';
import { Users } from 'lucide-react';

export function ClientsView() {
  const clients = [
    { name: 'Acme Corporation', status: 'Active', revenue: '$45,200', contact: 'John Smith' },
    { name: 'TechStart Inc', status: 'Active', revenue: '$32,500', contact: 'Sarah Johnson' },
    { name: 'Global Industries', status: 'Pending', revenue: '$28,900', contact: 'Mike Davis' },
    { name: 'Innovation Labs', status: 'Active', revenue: '$52,100', contact: 'Emily Chen' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users size={28} style={{ color: 'var(--brand-purple)' }} />
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Clients
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Manage your client relationships
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {clients.map((client, index) => (
          <div
            key={index}
            className="rounded-xl p-5"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--neutral-border)',
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {client.name}
                </h3>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Contact: {client.contact}
                </p>
              </div>
              <span
                className="text-xs font-semibold px-2 py-1 rounded"
                style={{
                  background: client.status === 'Active'
                    ? 'rgba(34, 197, 94, 0.15)'
                    : 'rgba(245, 158, 11, 0.15)',
                  color: client.status === 'Active' ? 'var(--success)' : 'var(--warning)',
                }}
              >
                {client.status}
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--neutral-border)' }}>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Total Revenue
              </span>
              <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {client.revenue}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
