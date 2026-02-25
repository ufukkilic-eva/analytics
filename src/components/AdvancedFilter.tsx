import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, X, ChevronDown } from 'lucide-react';

interface FilterDefinition {
  section: string;
  label: string;
  type: 'multi' | 'number' | 'date' | 'text';
  options?: string[];
  inputHint?: string;
  currencySymbol?: string;
  operators?: string[];
}

interface AppliedFilter {
  key: string;
  type: 'multi' | 'number' | 'date' | 'text';
  value?: string[];
  operator?: string;
  value1?: string;
  value2?: string;
  match?: 'any' | 'all';
}

interface Draft {
  key: string;
  type: string;
  selected?: Set<string>;
  match?: 'any' | 'all';
  operator?: string;
  value1?: string;
  value2?: string;
}

const FILTER_DEFS: Record<string, FilterDefinition> = {
  tagList: { 
    section: 'PRODUCT_INFO', 
    label: 'Tag List', 
    type: 'multi', 
    options: ['Best Seller', 'High Rated', 'Discounted', 'New Arrival'] 
  },
  status: { 
    section: 'PRODUCT_INFO', 
    label: 'Status', 
    type: 'multi', 
    options: ['Active', 'Inactive', 'Paused'] 
  },
  productName: { 
    section: 'PRODUCT_INFO', 
    label: 'Product Name', 
    type: 'text' 
  },
  fulfillmentChannel: { 
    section: 'PRODUCT_INFO', 
    label: 'Fulfillment Channel', 
    type: 'multi', 
    options: ['FBA', 'FBM'] 
  },
  price: {
    section: 'SALES_REVENUE',
    label: 'Price',
    type: 'number',
    inputHint: 'amount',
    currencySymbol: '$',
    operators: ['equals', 'greater than', 'less than', 'greater than or equal', 'less than or equal', 'between']
  },
  sales: { 
    section: 'SALES_REVENUE', 
    label: 'Order', 
    type: 'number', 
    inputHint: 'value', 
    operators: ['equals', 'greater than', 'less than', 'greater than or equal', 'less than or equal', 'between'] 
  },
  trialEndTime: { 
    section: 'ORDERS_UNITS', 
    label: 'Trial End Time', 
    type: 'date', 
    operators: ['before', 'after', 'between'] 
  },
  activePackageTypes: {
    section: 'ORDERS_UNITS', 
    label: 'Active Package Types', 
    type: 'multi', 
    options: [
      '3PL WMS', '3PL and Returns Management', 'Agency Old', 
      'Amazon - Advertising Managed', 'Amazon - DSP', 'Amazon - Full Service'
    ]
  }
};

const SECTIONS = [
  { id: 'PRODUCT_INFO', label: 'PRODUCT INFO' },
  { id: 'SALES_REVENUE', label: 'SALES & REVENUE' },
  { id: 'ORDERS_UNITS', label: 'ORDERS & UNITS' }
];

export function AdvancedFilter() {
  const [applied, setApplied] = useState<AppliedFilter[]>([
    { key: 'activePackageTypes', type: 'multi', value: ['3PL WMS', 'Agency Old'] },
    { key: 'trialEndTime', type: 'date', operator: 'before', value1: '2025-12-16', value2: '' }
  ]);
  const [currency, setCurrency] = useState('$');
  const [addFilterOpen, setAddFilterOpen] = useState(false);
  const [chipEditorOpenFor, setChipEditorOpenFor] = useState<string | null>(null);
  const [selectedFilterKey, setSelectedFilterKey] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [filterSearch, setFilterSearch] = useState('');
  const [multiSearch, setMultiSearch] = useState('');
  const [globalSearch, setGlobalSearch] = useState('');
  const [expanded, setExpanded] = useState(true);
  const [showToggleButton, setShowToggleButton] = useState(false);
  
  const popoverRef = useRef<HTMLDivElement>(null);
  const addBtnRef = useRef<HTMLButtonElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const leftControlsRef = useRef<HTMLDivElement>(null);
  const chipsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        const trigger = (event.target as HTMLElement).closest('[data-popover-trigger]');
        if (!trigger) {
          setAddFilterOpen(false);
          setChipEditorOpenFor(null);
          setFilterSearch('');
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const checkWrap = () => {
      if (!leftControlsRef.current || !chipsContainerRef.current || applied.length === 0) {
        setShowToggleButton(false);
        return;
      }

      const chips = Array.from(chipsContainerRef.current.querySelectorAll('.filter-chip'));
      if (chips.length === 0) {
        setShowToggleButton(false);
        return;
      }

      chips.forEach(c => {
        (c as HTMLElement).style.display = '';
      });

      requestAnimationFrame(() => {
        const baseTop = leftControlsRef.current!.offsetTop;
        const tolerance = 15;

        let wrapIndex = -1;
        for (let i = 0; i < chips.length; i++) {
          const chip = chips[i] as HTMLElement;
          if (chip.offsetTop > baseTop + tolerance) {
            wrapIndex = i;
            break;
          }
        }

        if (wrapIndex === -1) {
          setShowToggleButton(false);
          return;
        }

        setShowToggleButton(true);

        if (!expanded) {
          for (let i = wrapIndex; i < chips.length; i++) {
            (chips[i] as HTMLElement).style.display = 'none';
          }
        }
      });
    };

    const timer = setTimeout(checkWrap, 100);
    
    const handleResize = () => {
      checkWrap();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [applied, expanded]);

  const buildDraftFromApplied = (key: string): Draft => {
    const def = FILTER_DEFS[key];
    const existing = applied.find(x => x.key === key);

    if (!existing) {
      if (def.type === 'multi') return { key, type: def.type, selected: new Set(), match: 'any' };
      if (def.type === 'number') return { key, type: def.type, operator: 'greater than or equal', value1: '', value2: '' };
      if (def.type === 'date') return { key, type: def.type, operator: 'before', value1: '', value2: '' };
      return { key, type: def.type, value1: '' };
    }

    if (def.type === 'multi') return { key, type: def.type, selected: new Set(existing.value || []), match: existing.match || 'any' };
    if (def.type === 'text') return { key, type: def.type, value1: existing.value1 || '' };
    return { key, type: def.type, operator: existing.operator || '', value1: existing.value1 || '', value2: existing.value2 || '' };
  };

  const applyDraftToApplied = (def: FilterDefinition, key: string) => {
    if (!draft) return;
    
    const idx = applied.findIndex(x => x.key === key);
    let item: AppliedFilter;

    if (def.type === 'multi') item = { key, type: 'multi', value: [...(draft.selected || [])], match: draft.match };
    else if (def.type === 'number') item = { key, type: 'number', operator: draft.operator, value1: draft.value1, value2: draft.value2 };
    else if (def.type === 'date') item = { key, type: 'date', operator: draft.operator, value1: draft.value1, value2: draft.value2 };
    else item = { key, type: 'text', value1: draft.value1 };

    if (idx >= 0) setApplied(prev => [...prev.slice(0, idx), item, ...prev.slice(idx + 1)]);
    else setApplied(prev => [...prev, item]);
  };

  const removeApplied = (key: string) => {
    setApplied(prev => prev.filter(x => x.key !== key));
  };

  const chipText = (applied: AppliedFilter): string => {
    const def = FILTER_DEFS[applied.key];
    const label = def?.label || applied.key;

    if (applied.type === 'multi') {
      const arr = applied.value || [];
      const count = arr.length;
      if (count === 0) return `${label}: All`;
      if (count <= 3) return `${label}: ${arr.join(', ')}`;
      const shown = arr.slice(0, 3);
      return `${label}: ${shown.join(', ')} +${count - 3} more`;
    }

    if (applied.type === 'date') {
      const op = applied.operator || 'before';
      const v1 = applied.value1 || '';
      const v2 = applied.value2 || '';
      const opText = op.charAt(0).toUpperCase() + op.slice(1);
      if (op === 'between') return `${label} ${opText} ${v1} and ${v2}`;
      return `${label} ${opText} ${v1}`.trim();
    }

    if (applied.type === 'number') {
      const opMap: Record<string, string> = {
        'equals': '=', 'greater than': '>', 'less than': '<',
        'greater than or equal': '≥', 'less than or equal': '≤',
        'between': 'between'
      };
      const sym = opMap[applied.operator || 'equals'] || applied.operator;
      const isPrice = applied.key === 'price';
      const cur = isPrice ? currency : '';
      const v1 = applied.value1 || '';
      const v2 = applied.value2 || '';
      if (applied.operator === 'between') return `${label} ${sym} ${cur}${v1} and ${cur}${v2}`.trim();
      return `${label} ${sym} ${cur}${v1}`.trim();
    }

    if (applied.type === 'text') return `${label}: ${applied.value1 || ''}`.trim();
    return label;
  };

  const appliedBadgeForFilterKey = (key: string): number => {
    const def = FILTER_DEFS[key];
    const a = applied.find(x => x.key === key);
    if (!def || !a) return 0;
    if (def.type === 'multi') return (a.value || []).length;
    return 1;
  };

  const getTagColorClass = (tag: string): string => {
    const lower = tag.toLowerCase();
    if (lower.includes('best') || lower.includes('blue')) return 'tag-blue';
    if (lower.includes('rated') || lower.includes('green')) return 'tag-green';
    if (lower.includes('discount') || lower.includes('red')) return 'tag-red';
    if (lower.includes('new') || lower.includes('organic')) return 'tag-purple';
    if (lower.includes('active')) return 'tag-cyan';
    return 'tag-gray';
  };

  const renderMultiEditor = (def: FilterDefinition, context: string) => {
    if (!draft || def.type !== 'multi') return null;

    const filteredOptions = (def.options || []).filter(opt =>
      opt.toLowerCase().includes(multiSearch.toLowerCase())
    );

    const isTagList = draft.key === 'tagList';
    const selectedCount = draft.selected?.size || 0;
    const showMatchControls = isTagList && selectedCount >= 2;

    return (
      <div className="space-y-3">
        {showMatchControls && (
          <>
            <div 
              className="flex rounded-lg p-1"
              style={{ 
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--neutral-border)'
              }}
            >
              <button
                type="button"
                onClick={() => setDraft({ ...draft, match: 'any' })}
                className="flex-1 py-1.5 text-sm font-medium rounded-md transition-all"
                style={{
                  background: draft.match === 'any' ? 'var(--neutral-bg)' : 'transparent',
                  color: draft.match === 'any' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: draft.match === 'any' ? '600' : '500',
                  boxShadow: draft.match === 'any' ? '0 1px 2px rgba(0, 0, 0, 0.2)' : 'none'
                }}
              >
                Match Any
              </button>
              <button
                type="button"
                onClick={() => setDraft({ ...draft, match: 'all' })}
                className="flex-1 py-1.5 text-sm font-medium rounded-md transition-all"
                style={{
                  background: draft.match === 'all' ? 'var(--neutral-bg)' : 'transparent',
                  color: draft.match === 'all' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: draft.match === 'all' ? '600' : '500',
                  boxShadow: draft.match === 'all' ? '0 1px 2px rgba(0, 0, 0, 0.2)' : 'none'
                }}
              >
                Match All
              </button>
            </div>

            <div 
              className="rounded-lg p-3"
              style={{ 
                background: 'var(--bg-primary)',
                border: '1px solid var(--neutral-border)'
              }}
            >
              <div className="mb-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {draft.match === 'any' 
                  ? 'Displays products that have ' 
                  : 'Displays products that have '}
                <strong>
                  {draft.match === 'any' ? 'at least one' : 'all'}
                </strong>
                {' of the selected tags.'}
              </div>
              <div 
                className="flex flex-wrap items-center justify-center gap-2 p-3 rounded-md"
                style={{ background: 'var(--bg-tertiary)' }}
              >
                {Array.from(draft.selected || []).slice(0, 3).map((tag, idx) => (
                  <div key={tag} className="flex items-center gap-2">
                    {idx > 0 && (
                      <span 
                        className="text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {draft.match === 'any' ? 'OR' : 'AND'}
                      </span>
                    )}
                    <div 
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white`}
                      style={{
                        background: getTagColorClass(tag).includes('blue') ? '#3b82f6' :
                                   getTagColorClass(tag).includes('green') ? '#10b981' :
                                   getTagColorClass(tag).includes('red') ? '#ef4444' :
                                   getTagColorClass(tag).includes('purple') ? '#8b5cf6' :
                                   getTagColorClass(tag).includes('cyan') ? '#06b6d4' :
                                   '#64748b'
                      }}
                    >
                      {tag}
                    </div>
                  </div>
                ))}
                {selectedCount > 3 && (
                  <>
                    <span 
                      className="text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {draft.match === 'any' ? 'OR' : 'AND'}
                    </span>
                    <span 
                      className="text-xs"
                      style={{ 
                        color: 'var(--text-primary)',
                        background: 'transparent',
                        border: 'none',
                        paddingLeft: 0
                      }}
                    >
                      +{selectedCount - 3} more...
                    </span>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        <div 
          className="border rounded-lg overflow-hidden"
          style={{ 
            borderColor: 'var(--neutral-border)',
            background: 'var(--bg-tertiary)'
          }}
        >
          <div 
            className="p-3 border-b flex items-center justify-between gap-3"
            style={{ borderColor: 'var(--neutral-border)' }}
          >
            <div className="relative flex-1">
              <Search 
                size={18} 
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                placeholder="Search..."
                value={multiSearch}
                onChange={(e) => setMultiSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-transparent border-0 outline-none text-sm"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (draft && def.options) {
                    setDraft({ ...draft, selected: new Set(def.options) });
                  }
                }}
                className="text-xs font-medium px-2 py-1 rounded hover:bg-bg-card transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                Select All
              </button>
              <button
                onClick={() => setDraft({ ...draft, selected: new Set() })}
                className="text-xs font-medium px-2 py-1 rounded hover:bg-bg-card transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                Clear
              </button>
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto p-2">
            {filteredOptions.map(opt => (
              <label
                key={opt}
                className="flex items-center gap-3 px-3 py-2 rounded cursor-pointer hover:bg-bg-card transition-colors"
              >
                <input
                  type="checkbox"
                  checked={draft.selected?.has(opt)}
                  onChange={(e) => {
                    const newSelected = new Set(draft.selected);
                    if (e.target.checked) newSelected.add(opt);
                    else newSelected.delete(opt);
                    setDraft({ ...draft, selected: newSelected });
                  }}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: 'var(--brand-blue)' }}
                />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {opt}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderNumberEditor = (def: FilterDefinition) => {
    if (!draft || def.type !== 'number') return null;
    const isBetween = draft.operator === 'between';

    return (
      <div className="space-y-3">
        <select
          value={draft.operator || 'equals'}
          onChange={(e) => setDraft({ ...draft, operator: e.target.value, value2: e.target.value === 'between' ? draft.value2 : '' })}
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
          style={{
            background: 'var(--bg-tertiary)',
            borderColor: 'var(--neutral-border)',
            color: 'var(--text-primary)'
          }}
        >
          {(def.operators || []).map(op => (
            <option key={op} value={op}>
              {op.charAt(0).toUpperCase() + op.slice(1)}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder={`Enter ${def.inputHint === 'amount' ? `Amount (${currency})` : 'Value'}`}
          value={draft.value1 || ''}
          onChange={(e) => setDraft({ ...draft, value1: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
          style={{
            background: 'var(--bg-tertiary)',
            borderColor: 'var(--neutral-border)',
            color: 'var(--text-primary)'
          }}
        />

        {isBetween && (
          <input
            type="text"
            placeholder={`Enter ${def.inputHint === 'amount' ? `Amount (${currency})` : 'Value'}`}
            value={draft.value2 || ''}
            onChange={(e) => setDraft({ ...draft, value2: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
            style={{
              background: 'var(--bg-tertiary)',
              borderColor: 'var(--neutral-border)',
              color: 'var(--text-primary)'
            }}
          />
        )}
      </div>
    );
  };

  const renderDateEditor = (def: FilterDefinition) => {
    if (!draft || def.type !== 'date') return null;
    const isBetween = draft.operator === 'between';

    return (
      <div className="space-y-3">
        <select
          value={draft.operator || 'before'}
          onChange={(e) => setDraft({ ...draft, operator: e.target.value, value2: e.target.value === 'between' ? draft.value2 : '' })}
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
          style={{
            background: 'var(--bg-tertiary)',
            borderColor: 'var(--neutral-border)',
            color: 'var(--text-primary)'
          }}
        >
          {(def.operators || []).map(op => (
            <option key={op} value={op}>
              {op.charAt(0).toUpperCase() + op.slice(1)}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={draft.value1 || ''}
          onChange={(e) => setDraft({ ...draft, value1: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
          style={{
            background: 'var(--bg-tertiary)',
            borderColor: 'var(--neutral-border)',
            color: 'var(--text-primary)'
          }}
        />

        {isBetween && (
          <input
            type="date"
            value={draft.value2 || ''}
            onChange={(e) => setDraft({ ...draft, value2: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
            style={{
              background: 'var(--bg-tertiary)',
              borderColor: 'var(--neutral-border)',
              color: 'var(--text-primary)'
            }}
          />
        )}
      </div>
    );
  };

  const renderTextEditor = () => {
    if (!draft || draft.type !== 'text') return null;

    return (
      <input
        type="text"
        placeholder="Enter Text"
        value={draft.value1 || ''}
        onChange={(e) => setDraft({ ...draft, value1: e.target.value })}
        className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
        style={{
          background: 'var(--bg-tertiary)',
          borderColor: 'var(--neutral-border)',
          color: 'var(--text-primary)'
        }}
      />
    );
  };

  const filteredSections = SECTIONS.map(sec => {
    const items = Object.entries(FILTER_DEFS)
      .filter(([, def]) => def.section === sec.id)
      .filter(([, def]) => def.label.toLowerCase().includes(filterSearch.toLowerCase()));
    return { ...sec, items };
  }).filter(sec => sec.items.length > 0);

  return (
    <div 
      ref={filterBarRef}
      className="p-3 rounded-lg border flex flex-wrap items-center gap-2"
      style={{ 
        background: 'var(--bg-secondary)',
        borderColor: 'var(--neutral-border)'
      }}
    >
      <div ref={leftControlsRef} className="flex items-center gap-2">
        <div className="relative">
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search accounts by ID or Name..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border text-sm outline-none min-w-[280px]"
            style={{
              background: 'var(--bg-tertiary)',
              borderColor: 'var(--neutral-border)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        <button
          ref={addBtnRef}
          data-popover-trigger
          onClick={() => {
            setAddFilterOpen(!addFilterOpen);
            setChipEditorOpenFor(null);
            setSelectedFilterKey(null);
            setDraft(null);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
          style={{
            background: 'transparent',
            borderColor: 'var(--neutral-border)',
            color: 'var(--text-secondary)'
          }}
        >
          <Plus size={16} />
          Add Filter
        </button>
      </div>

      <div ref={chipsContainerRef} className="contents">
        {applied.map((item) => {
          const def = FILTER_DEFS[item.key];
          return (
            <div
              key={item.key}
              data-chip={item.key}
              className="filter-chip inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer hover:bg-bg-tertiary transition-colors"
              style={{
                background: 'var(--bg-tertiary)',
                borderColor: 'var(--neutral-border)',
                color: 'var(--text-secondary)'
              }}
              onClick={() => {
                setChipEditorOpenFor(item.key);
                setAddFilterOpen(false);
                setDraft(buildDraftFromApplied(item.key));
              }}
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ background: 'var(--brand-blue)' }}
              />
              <span className="text-xs font-medium">
                {chipText(item)}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeApplied(item.key);
                }}
                className="flex items-center justify-center w-4 h-4 rounded border hover:bg-red-500/20 hover:border-red-500 transition-colors"
                style={{ 
                  borderColor: 'var(--neutral-border)',
                  color: 'var(--text-secondary)'
                }}
              >
                <X size={10} />
              </button>
            </div>
          );
        })}
      </div>

      {showToggleButton && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:bg-bg-tertiary"
          style={{
            background: 'transparent',
            borderColor: 'var(--neutral-border)',
            color: 'var(--text-secondary)'
          }}
        >
          {expanded ? 'Show less' : 'Show all'}
        </button>
      )}

      {addFilterOpen && addBtnRef.current && (
        <div
          ref={popoverRef}
          className="fixed z-50 w-[720px] max-w-[calc(100vw-48px)] rounded-xl border shadow-2xl overflow-hidden"
          style={{
            background: 'var(--bg-secondary)',
            borderColor: 'var(--neutral-border)',
            top: addBtnRef.current.getBoundingClientRect().bottom + 8,
            left: addBtnRef.current.getBoundingClientRect().left,
          }}
        >
          <div className="grid grid-cols-[320px_1fr] min-h-[440px]">
            <div 
              className="p-3 border-r flex flex-col gap-3"
              style={{ borderColor: 'var(--neutral-border)' }}
            >
              <div className="text-sm font-semibold px-1" style={{ color: 'var(--text-primary)' }}>
                Select Filter
              </div>

              <div className="relative">
                <Search 
                  size={18} 
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                />
                <input
                  type="text"
                  placeholder="Search filters..."
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border text-sm outline-none"
                  style={{
                    background: 'var(--bg-tertiary)',
                    borderColor: 'var(--neutral-border)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div 
                className="flex-1 overflow-auto rounded-lg border p-2"
                style={{ 
                  background: 'var(--bg-tertiary)',
                  borderColor: 'var(--neutral-border)'
                }}
              >
                {filteredSections.map(sec => (
                  <div key={sec.id} className="mb-4 last:mb-0">
                    <div className="flex items-center justify-between px-2 mb-1">
                      <div 
                        className="text-[10px] font-semibold tracking-wider uppercase"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {sec.label}
                      </div>
                    </div>
                    {sec.items.map(([key, def]) => {
                      const badge = appliedBadgeForFilterKey(key);
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            setSelectedFilterKey(key);
                            setDraft(buildDraftFromApplied(key));
                            setMultiSearch('');
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                          style={{
                            background: selectedFilterKey === key ? 'rgba(4, 114, 253, 0.15)' : 'transparent',
                            color: selectedFilterKey === key ? 'var(--text-primary)' : 'var(--text-secondary)',
                            border: selectedFilterKey === key ? '1px solid rgba(4, 114, 253, 0.4)' : '1px solid transparent'
                          }}
                        >
                          <span>{def.label}</span>
                          {badge > 0 && (
                            <span 
                              className="px-2 py-0.5 rounded text-[10px] font-semibold"
                              style={{
                                background: 'rgba(4, 114, 253, 0.14)',
                                border: '1px solid rgba(4, 114, 253, 0.35)',
                                color: '#bcd7ff'
                              }}
                            >
                              {badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 flex flex-col gap-3">
              <div 
                className="flex items-center justify-between px-3 py-2 -mx-4 -mt-4 mb-3 border-b"
                style={{ 
                  borderColor: 'rgba(255, 255, 255, 0.06)',
                  background: 'rgba(0, 0, 0, 0.06)'
                }}
              >
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {selectedFilterKey ? FILTER_DEFS[selectedFilterKey].label : ''}
                </div>
                <button
                  onClick={() => setAddFilterOpen(false)}
                  className="p-1 rounded hover:bg-bg-tertiary transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <X size={16} />
                </button>
              </div>

              {selectedFilterKey && draft ? (
                <div 
                  className="border rounded-lg p-3 space-y-3"
                  style={{ 
                    background: 'var(--bg-card)',
                    borderColor: 'var(--neutral-border)'
                  }}
                >
                  {FILTER_DEFS[selectedFilterKey].type === 'multi' && renderMultiEditor(FILTER_DEFS[selectedFilterKey], 'add')}
                  {FILTER_DEFS[selectedFilterKey].type === 'number' && renderNumberEditor(FILTER_DEFS[selectedFilterKey])}
                  {FILTER_DEFS[selectedFilterKey].type === 'date' && renderDateEditor(FILTER_DEFS[selectedFilterKey])}
                  {FILTER_DEFS[selectedFilterKey].type === 'text' && renderTextEditor()}

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setAddFilterOpen(false)}
                      className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                      style={{
                        background: 'transparent',
                        borderColor: 'var(--neutral-border)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        applyDraftToApplied(FILTER_DEFS[selectedFilterKey], selectedFilterKey);
                        setAddFilterOpen(false);
                      }}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        background: 'var(--brand-blue)',
                        color: '#ffffff'
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  className="flex-1 border border-dashed rounded-lg flex items-center justify-center text-sm font-medium"
                  style={{ 
                    borderColor: 'rgba(255, 255, 255, 0.18)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-muted)'
                  }}
                >
                  Select a filter from the left to configure
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {chipEditorOpenFor && (() => {
        const chipEl = document.querySelector(`.filter-chip[data-chip="${chipEditorOpenFor}"]`) as HTMLElement;
        if (!chipEl || !draft) return null;
        
        const rect = chipEl.getBoundingClientRect();
        const def = FILTER_DEFS[chipEditorOpenFor];
        const appliedItem = applied.find(x => x.key === chipEditorOpenFor);
        const selectedCount = def.type === 'multi' ? (appliedItem?.value || []).length : 0;
        
        return (
          <div
            ref={popoverRef}
            className="fixed z-50 w-[360px] max-w-[calc(100vw-24px)] rounded-xl border shadow-2xl overflow-hidden"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--neutral-border)',
              top: rect.bottom + 8,
              left: rect.left,
            }}
          >
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {def.label}
                  {def.type === 'multi' && selectedCount > 0 && (
                    <span 
                      className="px-2 py-0.5 rounded text-[11px] font-semibold"
                      style={{
                        background: 'rgba(4, 114, 253, 0.14)',
                        border: '1px solid rgba(4, 114, 253, 0.35)',
                        color: '#bcd7ff'
                      }}
                    >
                      {selectedCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setChipEditorOpenFor(null)}
                  className="p-1 rounded hover:bg-bg-tertiary transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <X size={16} />
                </button>
              </div>

              <div 
                className="border rounded-lg p-3 space-y-3"
                style={{ 
                  background: 'var(--bg-card)',
                  borderColor: 'var(--neutral-border)'
                }}
              >
                {def.type === 'multi' && renderMultiEditor(def, 'chip')}
                {def.type === 'number' && renderNumberEditor(def)}
                {def.type === 'date' && renderDateEditor(def)}
                {def.type === 'text' && renderTextEditor()}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setChipEditorOpenFor(null)}
                    className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                    style={{
                      background: 'transparent',
                      borderColor: 'var(--neutral-border)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      applyDraftToApplied(def, chipEditorOpenFor);
                      setChipEditorOpenFor(null);
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      background: 'var(--brand-blue)',
                      color: '#ffffff'
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
