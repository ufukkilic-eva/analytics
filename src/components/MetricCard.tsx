import React from 'react';
import { X, Info, Circle } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  previousValue?: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
  selected?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
  onCardClick?: () => void;
  accentColor?: string;
}

export function MetricCard({ 
  label, 
  value,
  previousValue,
  change, 
  selected = false,
  onToggle,
  onClose,
  onCardClick,
  accentColor = 'var(--brand-green)'
}: MetricCardProps) {
  return (
    <div
      onClick={onCardClick}
      className="rounded-lg p-3 transition-all relative group"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--card-border)',
        borderBottom: selected ? `3px solid ${accentColor}` : '1px solid var(--card-border)',
        minHeight: '90px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onCardClick ? 'pointer' : 'default',
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selected}
            onClick={(e) => e.stopPropagation()}
            onChange={onToggle}
            className="w-3 h-3 rounded cursor-pointer"
            style={{
              accentColor: accentColor,
            }}
          />
          <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            {label}
          </p>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-0.5 rounded hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-muted)' }}
            title="Metric Information"
          >
            <Info size={12} />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <Circle 
            size={7} 
            fill={accentColor} 
            style={{ color: accentColor }}
          />
          {onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose?.();
              }}
              className="p-0.5 rounded hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-muted)' }}
              title="Remove Metric"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-0.5 mt-2">
        <p className="text-2xl font-bold leading-none" style={{ color: 'var(--text-primary)' }}>
          {value}
        </p>
        {previousValue && (
          <p className="text-xs font-normal mt-0.5" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
            Previous: {previousValue}
          </p>
        )}
      </div>

      {change && (
        <div className="flex items-end justify-end mt-1.5">
          <span
            className="text-xs font-bold"
            style={{
              color: change.isPositive ? 'var(--brand-green)' : 'var(--danger)',
            }}
          >
            {change.isPositive ? '↑' : '↓'} {change.value}
          </span>
        </div>
      )}
    </div>
  );
}
