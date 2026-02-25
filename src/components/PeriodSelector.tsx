import React, { useState } from 'react';
import { Calendar as CalendarIcon, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { format, subDays, subMonths, startOfMonth, endOfMonth, startOfYear } from 'date-fns';

interface DateRange {
  from: Date;
  to: Date;
}

interface PeriodOption {
  label: string;
  getValue: () => DateRange;
}

const periodOptions: PeriodOption[] = [
  {
    label: 'Today',
    getValue: () => ({
      from: new Date(),
      to: new Date(),
    }),
  },
  {
    label: 'Yesterday',
    getValue: () => ({
      from: subDays(new Date(), 1),
      to: subDays(new Date(), 1),
    }),
  },
  {
    label: 'Last 7 days',
    getValue: () => ({
      from: subDays(new Date(), 6),
      to: new Date(),
    }),
  },
  {
    label: 'Last 30 days',
    getValue: () => ({
      from: subDays(new Date(), 29),
      to: new Date(),
    }),
  },
  {
    label: 'Last 90 days',
    getValue: () => ({
      from: subDays(new Date(), 89),
      to: new Date(),
    }),
  },
  {
    label: 'This month',
    getValue: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
  {
    label: 'Last month',
    getValue: () => {
      const lastMonth = subMonths(new Date(), 1);
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth),
      };
    },
  },
  {
    label: 'Year to date',
    getValue: () => ({
      from: startOfYear(new Date()),
      to: new Date(),
    }),
  },
];

export function PeriodSelector() {
  const [open, setOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 days');
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [showCustomCalendar, setShowCustomCalendar] = useState(false);
  const [tempFromDate, setTempFromDate] = useState<Date | undefined>();
  const [tempToDate, setTempToDate] = useState<Date | undefined>();

  const handlePeriodSelect = (label: string, range: DateRange) => {
    setSelectedPeriod(label);
    setCustomRange(undefined);
    setShowCustomCalendar(false);
    setOpen(false);
  };

  const handleCustomRangeClick = () => {
    setShowCustomCalendar(!showCustomCalendar);
  };

  const handleApplyCustomRange = () => {
    if (tempFromDate && tempToDate) {
      setCustomRange({ from: tempFromDate, to: tempToDate });
      setSelectedPeriod(
        `${format(tempFromDate, 'MMM d, yyyy')} - ${format(tempToDate, 'MMM d, yyyy')}`
      );
      setShowCustomCalendar(false);
      setOpen(false);
    }
  };

  const getDisplayText = () => {
    if (customRange) {
      return `${format(customRange.from, 'MMM d, yyyy')} - ${format(customRange.to, 'MMM d, yyyy')}`;
    }
    return selectedPeriod;
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
        style={{
          background: 'var(--bg-secondary)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--input-border)',
        }}
      >
        <CalendarIcon size={16} />
        <span>{getDisplayText()}</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent 
          className="p-0 gap-0 max-w-[900px]"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--neutral-border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <DialogTitle className="sr-only">Select Period</DialogTitle>
          
          <div className="flex" style={{ minHeight: '500px' }}>
            <div
              className="w-64 border-r flex flex-col"
              style={{ 
                borderColor: 'var(--neutral-border)',
                background: 'var(--bg-card)',
              }}
            >
              <div
                className="px-5 py-4 border-b"
                style={{ 
                  borderColor: 'var(--neutral-border)',
                  background: 'rgba(0,0,0,0.15)',
                }}
              >
                <h4
                  className="text-sm font-semibold tracking-wide uppercase"
                  style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}
                >
                  Select Period
                </h4>
              </div>
              <div className="py-2 flex-1 overflow-y-auto">
                {periodOptions.map((option) => {
                  const isSelected = selectedPeriod === option.label && !customRange;
                  return (
                    <button
                      key={option.label}
                      onClick={() => handlePeriodSelect(option.label, option.getValue())}
                      className="w-full flex items-center justify-between px-5 py-3 text-sm transition-all font-medium"
                      style={{
                        background: isSelected ? 'rgba(4, 114, 253, 0.15)' : 'transparent',
                        color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                        borderLeft: isSelected ? '3px solid var(--brand-blue)' : '3px solid transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'var(--bg-tertiary)';
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }
                      }}
                    >
                      <span>{option.label}</span>
                      {isSelected && (
                        <Check
                          size={16}
                          style={{ color: 'var(--brand-blue)' }}
                        />
                      )}
                    </button>
                  );
                })}
                <div
                  className="my-2 mx-5"
                  style={{
                    height: '1px',
                    background: 'var(--neutral-border)',
                  }}
                />
                <button
                  onClick={handleCustomRangeClick}
                  className="w-full flex items-center justify-between px-5 py-3 text-sm transition-all font-medium"
                  style={{
                    background: showCustomCalendar ? 'rgba(4, 114, 253, 0.15)' : 'transparent',
                    color: showCustomCalendar ? 'var(--text-primary)' : 'var(--text-secondary)',
                    borderLeft: showCustomCalendar ? '3px solid var(--brand-blue)' : '3px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!showCustomCalendar) {
                      e.currentTarget.style.background = 'var(--bg-tertiary)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!showCustomCalendar) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <span>Custom Range</span>
                  {customRange && (
                    <Check
                      size={16}
                      style={{ color: 'var(--brand-blue)' }}
                    />
                  )}
                </button>
              </div>
            </div>

            {showCustomCalendar && (
              <div className="flex-1 p-6 flex flex-col" style={{ background: 'var(--bg-secondary)' }}>
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label
                        className="text-xs font-semibold mb-3 block uppercase tracking-wide"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        From Date
                      </label>
                      <div 
                        className="rounded-lg p-4"
                        style={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--neutral-border)',
                        }}
                      >
                        <Calendar
                          mode="single"
                          selected={tempFromDate}
                          onSelect={setTempFromDate}
                          disabled={(date) =>
                            date > new Date() || (tempToDate ? date > tempToDate : false)
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        className="text-xs font-semibold mb-3 block uppercase tracking-wide"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        To Date
                      </label>
                      <div 
                        className="rounded-lg p-4"
                        style={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--neutral-border)',
                        }}
                      >
                        <Calendar
                          mode="single"
                          selected={tempToDate}
                          onSelect={setTempToDate}
                          disabled={(date) =>
                            date > new Date() || (tempFromDate ? date < tempFromDate : false)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div 
                  className="flex justify-end gap-3 pt-5 mt-6"
                  style={{
                    borderTop: '1px solid var(--neutral-border)',
                  }}
                >
                  <button
                    onClick={() => {
                      setShowCustomCalendar(false);
                      setTempFromDate(undefined);
                      setTempToDate(undefined);
                    }}
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all"
                    style={{
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--neutral-border)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--neutral-bg)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--bg-tertiary)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplyCustomRange}
                    disabled={!tempFromDate || !tempToDate}
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: 'var(--brand-blue)',
                      color: '#ffffff',
                    }}
                    onMouseEnter={(e) => {
                      if (tempFromDate && tempToDate) {
                        e.currentTarget.style.background = 'var(--brand-blue-hover)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--brand-blue)';
                    }}
                  >
                    Apply Range
                  </button>
                </div>
              </div>
            )}

            {!showCustomCalendar && (
              <div className="flex-1 flex items-center justify-center p-8" style={{ background: 'var(--bg-secondary)' }}>
                <div className="text-center" style={{ color: 'var(--text-muted)' }}>
                  <CalendarIcon size={56} className="mx-auto mb-4" style={{ opacity: '0.2' }} />
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Select a period from the left</p>
                  <p className="text-xs mt-2">or choose "Custom Range" for specific dates</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
