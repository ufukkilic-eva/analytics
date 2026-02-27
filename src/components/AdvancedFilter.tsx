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

type AccountType = 'seller' | 'vendor' | 'both' | 'none';

const NUMBER_OPERATORS = ['equals', 'greater than', 'less than', 'greater than or equal', 'less than or equal', 'between'];

const createNumberFilter = (section: string, label: string, inputHint: string = 'value', currencySymbol?: string): FilterDefinition => ({
  section,
  label,
  type: 'number',
  inputHint,
  currencySymbol,
  operators: NUMBER_OPERATORS,
});

const DEFAULT_FILTER_DEFS: Record<string, FilterDefinition> = {
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
  inventoryStatus: {
    section: 'PRODUCT_INFO',
    label: 'Inventory Status',
    type: 'multi',
    options: ['In Stock', 'Low Stock', 'Out of Stock']
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
    label: 'Sales', 
    type: 'number', 
    inputHint: 'value', 
    operators: ['equals', 'greater than', 'less than', 'greater than or equal', 'less than or equal', 'between'] 
  },
  profit: {
    section: 'SALES_REVENUE',
    label: 'Profit',
    type: 'number',
    inputHint: 'value',
    operators: ['equals', 'greater than', 'less than', 'greater than or equal', 'less than or equal', 'between']
  },
  organicSales: {
    section: 'SALES_REVENUE',
    label: 'Organic Sales',
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

const DEFAULT_SECTIONS = [
  { id: 'PRODUCT_INFO', label: 'PRODUCT INFO' },
  { id: 'SALES_REVENUE', label: 'SALES & REVENUE' },
  { id: 'ORDERS_UNITS', label: 'ORDERS & UNITS' }
];

const SELLER_SECTIONS = [
  { id: 'PRODUCT_INFO', label: 'PRODUCT INFO' },
  { id: 'SALES_REVENUE', label: 'SALES & REVENUE' },
  { id: 'ORDERS_UNITS', label: 'ORDERS & UNITS' },
  { id: 'TRAFFIC_SESSIONS', label: 'TRAFFIC & SESSIONS' },
  { id: 'COSTS_FEES', label: 'COSTS & FEES' },
  { id: 'PERFORMANCE', label: 'PERFORMANCE' },
  { id: 'ADVERTISING', label: 'ADVERTISING' },
  { id: 'INVENTORY', label: 'INVENTORY' },
];

const SELLER_FILTER_DEFS: Record<string, FilterDefinition> = {
  tagList: { section: 'PRODUCT_INFO', label: 'Tag List', type: 'multi', options: ['Best Seller', 'High Rated', 'Discounted', 'New Arrival', 'Multi-pack', 'Organic', 'Seasonal', 'Fragile'] },
  status: { section: 'PRODUCT_INFO', label: 'Status', type: 'multi', options: ['Active', 'Inactive', 'Paused'] },
  fulfillmentChannel: { section: 'PRODUCT_INFO', label: 'Fulfillment Channel', type: 'multi', options: ['FBA', 'FBM', 'AMAZON_EU', 'DEFAULT'] },
  inventoryStatus: { section: 'PRODUCT_INFO', label: 'Inventory Status', type: 'multi', options: ['In Stock', 'Out of Stock'] },

  price: createNumberFilter('SALES_REVENUE', 'Price', 'amount', '$'),
  sales: createNumberFilter('SALES_REVENUE', 'Sales'),
  profit: createNumberFilter('SALES_REVENUE', 'Profit'),
  adSkuSales: createNumberFilter('SALES_REVENUE', 'Ad SKU Sales'),
  adSalesAttributedSku: createNumberFilter('SALES_REVENUE', 'Ad Sales Attributed SKU'),
  b2bOrderedProductSales: createNumberFilter('SALES_REVENUE', 'B2B Ordered Product Sales'),
  organicSales: createNumberFilter('SALES_REVENUE', 'Organic Sales'),
  aov: createNumberFilter('SALES_REVENUE', 'AOV'),

  quantity: createNumberFilter('ORDERS_UNITS', 'Quantity'),
  orderCount: createNumberFilter('ORDERS_UNITS', 'Order Count'),
  repeatOrderQuantity: createNumberFilter('ORDERS_UNITS', 'Repeat Order Quantity'),
  newToBrandCustomerCount: createNumberFilter('ORDERS_UNITS', 'New to Brand Customer Count'),
  newToBrandOrderQuantity: createNumberFilter('ORDERS_UNITS', 'New to Brand Order Quantity'),
  repeatOrderCustomerCount: createNumberFilter('ORDERS_UNITS', 'Repeat Order Customer Count'),
  b2bTotalOrderItems: createNumberFilter('ORDERS_UNITS', 'B2B Total Order Items'),
  b2bUnitsOrdered: createNumberFilter('ORDERS_UNITS', 'B2B Units Ordered'),
  organicUnits: createNumberFilter('ORDERS_UNITS', 'Organic Units'),
  organicOrders: createNumberFilter('ORDERS_UNITS', 'Organic Orders'),

  childSessions: createNumberFilter('TRAFFIC_SESSIONS', 'Child Sessions'),
  asinImpressionCount: createNumberFilter('TRAFFIC_SESSIONS', 'ASIN Impression Count'),
  totalQueryImpressionCount: createNumberFilter('TRAFFIC_SESSIONS', 'Total Query Impression Count'),
  pageViews: createNumberFilter('TRAFFIC_SESSIONS', 'Page Views'),
  b2bPageViews: createNumberFilter('TRAFFIC_SESSIONS', 'B2B Page Views'),
  sessions: createNumberFilter('TRAFFIC_SESSIONS', 'Sessions'),
  b2bSessions: createNumberFilter('TRAFFIC_SESSIONS', 'B2B Sessions'),
  unitsPerSession: createNumberFilter('TRAFFIC_SESSIONS', 'Units Per Session'),
  b2bUnitsPerSession: createNumberFilter('TRAFFIC_SESSIONS', 'B2B Units Per Session'),

  cost: createNumberFilter('COSTS_FEES', 'Cost'),
  cog: createNumberFilter('COSTS_FEES', 'COG'),
  fbaFee: createNumberFilter('COSTS_FEES', 'FBA Fee'),
  unitLandingCost: createNumberFilter('COSTS_FEES', 'Unit Landing Cost'),
  referralFee: createNumberFilter('COSTS_FEES', 'Referral Fee'),
  cogs: createNumberFilter('COSTS_FEES', 'COGS'),
  fbmShippingCost: createNumberFilter('COSTS_FEES', 'FBM Shipping Cost'),
  totalExpense: createNumberFilter('COSTS_FEES', 'Total Expense'),
  shippingToFbaCost: createNumberFilter('COSTS_FEES', 'Shipping to FBA Cost'),
  variableClosingFee: createNumberFilter('COSTS_FEES', 'Variable Closing Fee'),
  totalFees: createNumberFilter('COSTS_FEES', 'Total Fees'),
  shippingAmount: createNumberFilter('COSTS_FEES', 'Shipping Amount'),
  refundAmount: createNumberFilter('COSTS_FEES', 'Refund Amount'),

  dayOfSupplyFba: createNumberFilter('PERFORMANCE', 'Day of Supply (FBA)'),
  dayOfSupplyFbm: createNumberFilter('PERFORMANCE', 'Day of Supply (FBM)'),
  marketShare: createNumberFilter('PERFORMANCE', 'Market Share'),
  shareOfVoice: createNumberFilter('PERFORMANCE', 'Share of Voice'),
  salesVelocity: createNumberFilter('PERFORMANCE', 'Sales Velocity'),
  roi: createNumberFilter('PERFORMANCE', 'ROI'),
  margin: createNumberFilter('PERFORMANCE', 'Margin'),
  newOrderRate: createNumberFilter('PERFORMANCE', 'New Order Rate'),
  newCustomerRate: createNumberFilter('PERFORMANCE', 'New Customer Rate'),
  repeatOrderRate: createNumberFilter('PERFORMANCE', 'Repeat Order Rate'),
  buyBoxPercent: createNumberFilter('PERFORMANCE', 'Buy Box %'),
  refundPercent: createNumberFilter('PERFORMANCE', 'Refund %'),
  asinPurchaseCount: createNumberFilter('PERFORMANCE', 'ASIN Purchase Count'),
  repeatCustomerRate: createNumberFilter('PERFORMANCE', 'Repeat Customer Rate'),
  totalPurchaseCount: createNumberFilter('PERFORMANCE', 'Total Purchase Count'),
  marketShareCp: createNumberFilter('PERFORMANCE', 'Market Share CP'),
  shareOfVoiceCp: createNumberFilter('PERFORMANCE', 'Share of Voice CP'),

  adSpend: createNumberFilter('ADVERTISING', 'Ad Spend'),
  adSales: createNumberFilter('ADVERTISING', 'Ad Sales'),
  impressions: createNumberFilter('ADVERTISING', 'Impressions'),
  clicks: createNumberFilter('ADVERTISING', 'Clicks'),
  acos: createNumberFilter('ADVERTISING', 'ACoS'),
  roas: createNumberFilter('ADVERTISING', 'ROAS'),
  cpc: createNumberFilter('ADVERTISING', 'CPC'),
  ctr: createNumberFilter('ADVERTISING', 'CTR'),
  cvr: createNumberFilter('ADVERTISING', 'CVR'),
  tacos: createNumberFilter('ADVERTISING', 'TACoS'),
  adConversions: createNumberFilter('ADVERTISING', 'Ad Conversions'),
  adUnits: createNumberFilter('ADVERTISING', 'Ad Units'),
  adAov: createNumberFilter('ADVERTISING', 'Ad AOV'),

  inboundQuantity: createNumberFilter('INVENTORY', 'Inbound Quantity'),
  fcTransfer: createNumberFilter('INVENTORY', 'FC Transfer'),
  availableQuantity: createNumberFilter('INVENTORY', 'Available Quantity'),
  refundQuantity: createNumberFilter('INVENTORY', 'Refund Quantity'),
};

const VENDOR_SECTIONS = [
  { id: 'PRODUCT_INFO', label: 'PRODUCT INFO' },
  { id: 'SALES_REVENUE', label: 'SALES & REVENUE' },
  { id: 'ORDERS_UNITS', label: 'ORDERS & UNITS' },
  { id: 'TRAFFIC_SESSIONS', label: 'TRAFFIC & SESSIONS' },
  { id: 'PERFORMANCE', label: 'PERFORMANCE' },
  { id: 'ADVERTISING', label: 'ADVERTISING' },
  { id: 'INVENTORY', label: 'INVENTORY' },
];

const VENDOR_FILTER_DEFS: Record<string, FilterDefinition> = {
  tagList: { section: 'PRODUCT_INFO', label: 'Tag List', type: 'multi', options: ['Best Seller', 'High Rated', 'Discounted', 'New Arrival', 'Multi-pack', 'Organic', 'Seasonal', 'Fragile'] },
  status: { section: 'PRODUCT_INFO', label: 'Status', type: 'multi', options: ['Active', 'Inactive', 'Paused'] },
  inventoryStatus: { section: 'PRODUCT_INFO', label: 'Inventory Status', type: 'multi', options: ['In Stock', 'Out of Stock'] },

  price: createNumberFilter('SALES_REVENUE', 'Price', 'amount', '$'),
  sales: createNumberFilter('SALES_REVENUE', 'Sales'),
  adSales: createNumberFilter('SALES_REVENUE', 'Ad Sales'),
  adSkuSales: createNumberFilter('SALES_REVENUE', 'Ad SKU Sales'),
  adSalesAttributedSku: createNumberFilter('SALES_REVENUE', 'Ad Sales Attributed SKU'),
  refundAmount: createNumberFilter('SALES_REVENUE', 'Refund Amount'),

  quantity: createNumberFilter('ORDERS_UNITS', 'Quantity'),
  orderCount: createNumberFilter('ORDERS_UNITS', 'Order Count'),
  repeatOrderQuantity: createNumberFilter('ORDERS_UNITS', 'Repeat Order Quantity'),
  repeatOrderCustomerCount: createNumberFilter('ORDERS_UNITS', 'Repeat Order Customer Count'),

  sessions: createNumberFilter('TRAFFIC_SESSIONS', 'Sessions'),
  pageViews: createNumberFilter('TRAFFIC_SESSIONS', 'Page Views'),
  impressions: createNumberFilter('TRAFFIC_SESSIONS', 'Impressions'),
  clicks: createNumberFilter('TRAFFIC_SESSIONS', 'Clicks'),

  acos: createNumberFilter('PERFORMANCE', 'ACoS'),
  tacos: createNumberFilter('PERFORMANCE', 'TACoS'),
  roas: createNumberFilter('PERFORMANCE', 'ROAS'),
  cpc: createNumberFilter('PERFORMANCE', 'CPC'),
  ctr: createNumberFilter('PERFORMANCE', 'CTR'),
  cvr: createNumberFilter('PERFORMANCE', 'CVR'),

  adSpend: createNumberFilter('ADVERTISING', 'Ad Spend'),
  adAov: createNumberFilter('ADVERTISING', 'Ad AOV'),
  adConversions: createNumberFilter('ADVERTISING', 'Ad Conversions'),
  adUnits: createNumberFilter('ADVERTISING', 'Ad Units'),

  openPurchaseOrderUnits: createNumberFilter('INVENTORY', 'Purchase Order Units'),
  availableQuantity: createNumberFilter('INVENTORY', 'Available Quantity'),
};

const BOTH_SECTIONS = [
  { id: 'PRODUCT_INFO', label: 'PRODUCT INFO' },
  { id: 'SALES_REVENUE', label: 'SALES & REVENUE' },
  { id: 'ORDERS_UNITS', label: 'ORDERS & UNITS' },
  { id: 'TRAFFIC_SESSIONS', label: 'TRAFFIC & SESSIONS' },
  { id: 'PERFORMANCE', label: 'PERFORMANCE' },
  { id: 'ADVERTISING', label: 'ADVERTISING' },
  { id: 'INVENTORY', label: 'INVENTORY' },
];

const BOTH_FILTER_DEFS: Record<string, FilterDefinition> = {
  tagList: { section: 'PRODUCT_INFO', label: 'Tag List', type: 'multi', options: ['Best Seller', 'High Rated', 'Discounted', 'New Arrival', 'Multi-pack', 'Organic', 'Seasonal', 'Fragile'] },
  status: { section: 'PRODUCT_INFO', label: 'Status', type: 'multi', options: ['Active', 'Inactive', 'Paused'] },
  inventoryStatus: { section: 'PRODUCT_INFO', label: 'Inventory Status', type: 'multi', options: ['In Stock', 'Out of Stock'] },

  price: createNumberFilter('SALES_REVENUE', 'Price', 'amount', '$'),
  sales: createNumberFilter('SALES_REVENUE', 'Sales'),
  adSales: createNumberFilter('SALES_REVENUE', 'Ad Sales'),
  adSkuSales: createNumberFilter('SALES_REVENUE', 'Ad SKU Sales'),
  adSalesAttributedSku: createNumberFilter('SALES_REVENUE', 'Ad Sales Attributed SKU'),
  refundAmount: createNumberFilter('SALES_REVENUE', 'Refund Amount'),

  quantity: createNumberFilter('ORDERS_UNITS', 'Quantity'),
  repeatOrderCustomerCount: createNumberFilter('ORDERS_UNITS', 'Repeat Order Customer Count'),

  pageViews: createNumberFilter('TRAFFIC_SESSIONS', 'Page Views'),
  clicks: createNumberFilter('TRAFFIC_SESSIONS', 'Clicks'),

  acos: createNumberFilter('PERFORMANCE', 'ACoS'),
  tacos: createNumberFilter('PERFORMANCE', 'TACoS'),
  roas: createNumberFilter('PERFORMANCE', 'ROAS'),
  cpc: createNumberFilter('PERFORMANCE', 'CPC'),
  ctr: createNumberFilter('PERFORMANCE', 'CTR'),
  cvr: createNumberFilter('PERFORMANCE', 'CVR'),

  adSpend: createNumberFilter('ADVERTISING', 'Ad Spend'),
  adAov: createNumberFilter('ADVERTISING', 'Ad AOV'),
  adConversions: createNumberFilter('ADVERTISING', 'Ad Conversions'),
  adUnits: createNumberFilter('ADVERTISING', 'Ad Units'),

  availableQuantity: createNumberFilter('INVENTORY', 'Available Quantity'),
};

export function AdvancedFilter({ mode = 'seller' }: { mode?: AccountType }) {
  const [applied, setApplied] = useState<AppliedFilter[]>([]);
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
  const [operatorDropdownOpen, setOperatorDropdownOpen] = useState(false);

  const filterDefs =
    mode === 'seller' ? SELLER_FILTER_DEFS :
      mode === 'vendor' ? VENDOR_FILTER_DEFS :
        mode === 'both' ? BOTH_FILTER_DEFS :
          DEFAULT_FILTER_DEFS;
  const sections =
    mode === 'seller' ? SELLER_SECTIONS :
      mode === 'vendor' ? VENDOR_SECTIONS :
        mode === 'both' ? BOTH_SECTIONS :
          DEFAULT_SECTIONS;
  
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
          setOperatorDropdownOpen(false);
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

  useEffect(() => {
    setOperatorDropdownOpen(false);
  }, [selectedFilterKey, chipEditorOpenFor, addFilterOpen]);

  useEffect(() => {
    setApplied(prev => prev.filter(item => Boolean(filterDefs[item.key])));
    if (selectedFilterKey && !filterDefs[selectedFilterKey]) {
      setSelectedFilterKey(null);
      setDraft(null);
    }
    if (chipEditorOpenFor && !filterDefs[chipEditorOpenFor]) {
      setChipEditorOpenFor(null);
      setDraft(null);
    }
  }, [filterDefs, selectedFilterKey, chipEditorOpenFor]);

  const buildDraftFromApplied = (key: string): Draft => {
    const def = filterDefs[key];
    if (!def) return { key, type: 'text', value1: '' };
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
    const def = filterDefs[applied.key];
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
    const def = filterDefs[key];
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

  const getTagDotColor = (tag: string): string => {
    const cls = getTagColorClass(tag);
    if (cls.includes('blue')) return '#3b82f6';
    if (cls.includes('green')) return '#10b981';
    if (cls.includes('red')) return '#ef4444';
    if (cls.includes('purple')) return '#8b5cf6';
    if (cls.includes('cyan')) return '#06b6d4';
    return '#64748b';
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
                <span className="text-sm flex-1" style={{ color: 'var(--text-secondary)' }}>
                  {opt}
                </span>
                {isTagList && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: getTagDotColor(opt) }}
                  />
                )}
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
    const operator = draft.operator || 'equals';

    return (
      <div className="space-y-3">
        <div
          className="rounded-lg p-3"
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--neutral-border)'
          }}
        >
          <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            Operator
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setOperatorDropdownOpen(v => !v)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm text-left"
              style={{
                background: 'var(--bg-secondary)',
                borderColor: 'var(--brand-blue)',
                color: 'var(--text-primary)'
              }}
            >
              <span>{operator.charAt(0).toUpperCase() + operator.slice(1)}</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${operatorDropdownOpen ? 'rotate-180' : ''}`}
                style={{ color: 'var(--text-muted)' }}
              />
            </button>

            {operatorDropdownOpen && (
              <div
                className="absolute z-20 top-full left-0 right-0 mt-1 rounded-lg overflow-hidden shadow-xl"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--neutral-border)' }}
              >
                {(def.operators || []).map(op => (
                  <button
                    key={op}
                    type="button"
                    onClick={() => {
                      setDraft({ ...draft, operator: op, value2: op === 'between' ? (draft.value2 || '') : '' });
                      setOperatorDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-left transition-colors hover:bg-white/5"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {op.charAt(0).toUpperCase() + op.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-3 text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
            {def.currencySymbol || def.inputHint || 'value'}
          </div>
          <input
            type="text"
            placeholder={`Enter ${def.inputHint || 'value'}`}
            value={draft.value1 || ''}
            onChange={(e) => setDraft({ ...draft, value1: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--neutral-border)',
              color: 'var(--text-primary)'
            }}
          />

          {isBetween && (
            <input
              type="text"
              placeholder={`Enter ${def.inputHint || 'value'}`}
              value={draft.value2 || ''}
              onChange={(e) => setDraft({ ...draft, value2: e.target.value })}
              className="w-full mt-2 px-3 py-2 rounded-lg border text-sm outline-none"
              style={{
                background: 'var(--bg-secondary)',
                borderColor: 'var(--neutral-border)',
                color: 'var(--text-primary)'
              }}
            />
          )}
        </div>
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

  const filteredSections = sections.map(sec => {
    const items = Object.entries(filterDefs)
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
            placeholder="Search by product name, ASIN, SKU, Parent ASIN..."
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
          const def = filterDefs[item.key];
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
          className="fixed z-50 w-[980px] max-w-[calc(100vw-48px)] rounded-xl border shadow-2xl overflow-hidden"
          style={{
            background: 'var(--bg-secondary)',
            borderColor: 'var(--neutral-border)',
            top: addBtnRef.current.getBoundingClientRect().bottom + 8,
            left: addBtnRef.current.getBoundingClientRect().left,
            height: 'min(740px, calc(100vh - 40px))',
            maxHeight: 'calc(100vh - 40px)',
          }}
        >
          <div className="grid grid-cols-[360px_1fr] min-h-[540px] h-full">
            <div 
              className="p-3 border-r flex flex-col gap-3 min-h-0"
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
                  placeholder="Search options..."
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
                className="flex-1 overflow-y-auto rounded-lg border p-2 min-h-0"
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
                            background: selectedFilterKey === key ? 'rgba(124, 58, 237, 0.18)' : 'transparent',
                            color: selectedFilterKey === key ? 'var(--text-primary)' : 'var(--text-secondary)',
                            border: selectedFilterKey === key ? '1px solid rgba(124, 58, 237, 0.45)' : '1px solid transparent'
                          }}
                        >
                          <span>{def.label}</span>
                          {badge > 0 && (
                            <span 
                              className="px-2 py-0.5 rounded text-[10px] font-semibold"
                              style={{
                                background: 'rgba(124, 58, 237, 0.14)',
                                border: '1px solid rgba(124, 58, 237, 0.35)',
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

            <div className="p-4 flex flex-col gap-3 min-h-0">
              <div 
                className="flex items-center justify-between px-3 py-2 -mx-4 -mt-4 mb-3 border-b"
                style={{ 
                  borderColor: 'rgba(255, 255, 255, 0.06)',
                  background: 'rgba(0, 0, 0, 0.06)'
                }}
              >
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {selectedFilterKey ? filterDefs[selectedFilterKey]?.label : ''}
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
                  className="border rounded-lg p-4 space-y-3 h-full flex flex-col overflow-auto min-h-0"
                  style={{ 
                    background: 'var(--bg-card)',
                    borderColor: 'var(--neutral-border)'
                  }}
                >
                  <div className="flex-1">
                    {filterDefs[selectedFilterKey].type === 'multi' && renderMultiEditor(filterDefs[selectedFilterKey], 'add')}
                    {filterDefs[selectedFilterKey].type === 'number' && renderNumberEditor(filterDefs[selectedFilterKey])}
                    {filterDefs[selectedFilterKey].type === 'date' && renderDateEditor(filterDefs[selectedFilterKey])}
                    {filterDefs[selectedFilterKey].type === 'text' && renderTextEditor()}
                  </div>

                  <div className="flex justify-end gap-2 pt-2 mt-auto">
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
                        applyDraftToApplied(filterDefs[selectedFilterKey], selectedFilterKey);
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
        const def = filterDefs[chipEditorOpenFor];
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
