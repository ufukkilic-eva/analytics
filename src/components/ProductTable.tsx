import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Check, Edit2, Trash2, Tag, Info, ChevronRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const INITIAL_TAGS = {
  'Best Seller': '#EF4444',
  'High Rated': '#F59E0B',
  'Discounted': '#10B981',
  'New Arrival': '#3B82F6',
  'Multi-pack': '#8B5CF6',
  'Organic': '#EC4899',
  'Seasonal': '#6366f1',
  'Fragile': '#f43f5e'
};

const COLOR_PALETTE = [
  '#9CA3AF', '#64748B', '#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6'
];

type StoreType = 'amazon' | 'shopify' | 'both';

interface Product {
  id: number;
  name: string;
  asin: string;
  parentAsin: string;
  brand: string;
  sales: string;
  status: string;
  image: string;
  tags: string[];
  price: string;
  profit: string;
  organicSales: string;
  productCost: string;
  fbaFee: string;
  referralFee: string;
  totalFees: string;
  apsScore: number;
  spsScore: number;
  upsScore: number;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Karaca Siena 53-Piece Porcelain Plates and Bowls Set with Dinner & Dessert Plates, Shakers - Bone China Dishware Sets - Kitchen Dinnerware Set for 12 People',
    asin: 'B0D2329WRV',
    parentAsin: '-',
    brand: 'KARACA',
    sales: '$12,068.26',
    status: 'Available',
    image: 'https://m.media-amazon.com/images/I/51H+M0qN7qL._AC_UL320_.jpg',
    tags: ['Best Seller', 'Multi-pack'],
    price: '$220.00',
    profit: '$7,407.39',
    organicSales: '$6,131.00',
    productCost: '$0.00',
    fbaFee: '$1,131.64',
    referralFee: '$1,690.47',
    totalFees: '$2,822.11',
    apsScore: 78,
    spsScore: 65,
    upsScore: 72
  },
  {
    id: 2,
    name: 'Karaca New Flava 24 Piece Porcelain Dinnerware Set for 6 People, Elegant Porcelain Dishware with Dinner, Pasta, Side Plates, Bowls, Kitchen Essentials: Durable, Resistant, Ideal for Dinner Serving',
    asin: 'B0CHC1VXH',
    parentAsin: 'B0D6YC5XTF',
    brand: 'KARACA',
    sales: '$11,953.96',
    status: 'Available',
    image: 'https://m.media-amazon.com/images/I/71pX+J2GjoL._AC_UL320_.jpg',
    tags: ['Discounted', 'New Arrival'],
    price: '$137.19',
    profit: '$7,482.15',
    organicSales: '$4,610.29',
    productCost: '$0.00',
    fbaFee: '$1,319.73',
    referralFee: '$1,402.32',
    totalFees: '$2,722.05',
    apsScore: 82,
    spsScore: 71,
    upsScore: 77
  },
  {
    id: 3,
    name: 'KARACA Hatır Turkish Coffee Maker, 5 Cups Electric Turkish Coffee Machine with Ember Mode, Automatic Temperature Control, Overflow Protection, Audible & Visual Alerts, Shiny Black',
    asin: 'B0FPD8BHK3',
    parentAsin: 'B0FTT3WRT8',
    brand: 'KARACA',
    sales: '$9,918.76',
    status: 'Available',
    image: 'https://m.media-amazon.com/images/I/71F7J0JzTjL._AC_UL320_.jpg',
    tags: ['Best Seller', 'Organic'],
    price: '$79.98',
    profit: '$6,499.66',
    organicSales: '$5,199.39',
    productCost: '$0.00',
    fbaFee: '$1,465.16',
    referralFee: '$1,344.00',
    totalFees: '$2,809.16',
    apsScore: 91,
    spsScore: 84,
    upsScore: 88
  },
  {
    id: 4,
    name: 'Karaca Premium Turkish Tea Glass Set with Saucers, 12 Pieces',
    asin: 'B09X1RA4K2',
    parentAsin: 'B09X1RA4K3',
    brand: 'KARACA',
    sales: '$5,890.00',
    status: 'Available',
    image: 'https://m.media-amazon.com/images/I/61m6+h+uK0L._AC_UL320_.jpg',
    tags: [],
    price: '$34.99',
    profit: '$3,245.50',
    organicSales: '$2,890.00',
    productCost: '$0.00',
    fbaFee: '$845.20',
    referralFee: '$799.30',
    totalFees: '$1,644.50',
    apsScore: 68,
    spsScore: 59,
    upsScore: 64
  },
  {
    id: 5,
    name: 'Karaca Bioceramic Non-Stick Frying Pan Set, 3 Pieces',
    asin: 'B012Y4RB5X',
    parentAsin: 'B012Y4RB5Y',
    brand: 'KARACA',
    sales: '$8,450.20',
    status: 'Available',
    image: 'https://m.media-amazon.com/images/I/71+7Q0+g6+L._AC_UL320_.jpg',
    tags: ['Best Seller'],
    price: '$129.99',
    profit: '$5,120.80',
    organicSales: '$4,225.10',
    productCost: '$0.00',
    fbaFee: '$1,125.40',
    referralFee: '$1,204.00',
    totalFees: '$2,329.40',
    apsScore: 85,
    spsScore: 78,
    upsScore: 82
  },
];

interface PopoverState {
  type: 'add' | 'edit';
  target: number | string;
  x: number;
  y: number;
}

interface ProductTableProps {
  selectedStore?: StoreType;
}

export function ProductTable({ selectedStore = 'both' }: ProductTableProps) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [tagDatabase, setTagDatabase] = useState(INITIAL_TAGS);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<number>>(new Set());
  const [activePopover, setActivePopover] = useState<PopoverState | null>(null);
  const [popoverSearch, setPopoverSearch] = useState('');
  const [tagToEdit, setTagToEdit] = useState<{ name: string; color: string } | null>(null);
  const [expandedProductIds, setExpandedProductIds] = useState<Set<number>>(new Set());
  const [tagToDelete, setTagToDelete] = useState<string | null>(null);

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tagToDelete) return;

      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (target.closest('[data-popover-trigger]')) return;
        setActivePopover(null);
        setPopoverSearch('');
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [tagToDelete]);

  const handleCreateTag = (name: string, color: string = '#3B82F6'): string | null => {
    if (!name.trim()) return null;
    const existingKey = Object.keys(tagDatabase).find(k => k.toLowerCase() === name.toLowerCase());
    if (existingKey) return existingKey;

    const newDb = { ...tagDatabase, [name]: color };
    setTagDatabase(newDb);
    return name;
  };

  const handleUpdateTag = (oldName: string, newName: string, newColor: string) => {
    const newDb = { ...tagDatabase };
    if (oldName !== newName) delete newDb[oldName];
    newDb[newName] = newColor;
    setTagDatabase(newDb);

    setProducts(products.map(p => ({
      ...p,
      tags: p.tags.map(t => t === oldName ? newName : t)
    })));

    setActivePopover(null);
  };

  const handleDeleteTag = (tagName: string) => {
    const newDb = { ...tagDatabase };
    delete newDb[tagName];
    setTagDatabase(newDb);

    setProducts(products.map(p => ({
      ...p,
      tags: p.tags.filter(t => t !== tagName)
    })));

    setActivePopover(null);
  };

  const toggleTagOnProduct = (productId: number, tagName: string) => {
    setProducts(products.map(product => {
      if (product.id === productId) {
        const hasTag = product.tags.includes(tagName);
        return {
          ...product,
          tags: hasTag ? product.tags.filter(t => t !== tagName) : [...product.tags, tagName]
        };
      }
      return product;
    }));
  };

  const getScoreLabel = () => {
    if (selectedStore === 'amazon') return 'APS';
    if (selectedStore === 'shopify') return 'SPS';
    return 'UPS';
  };

  const getScore = (product: Product) => {
    if (selectedStore === 'amazon') return product.apsScore;
    if (selectedStore === 'shopify') return product.spsScore;
    return product.upsScore;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#059669'; // darker green
    if (score >= 50) return '#d97706'; // darker orange/amber
    return '#dc2626'; // darker red
  };

  const renderPopoverContent = () => {
    if (!activePopover) return null;

    if (activePopover.type === 'add') {
      const existingTags = Object.keys(tagDatabase).filter(t =>
        t.toLowerCase().includes(popoverSearch.toLowerCase())
      );
      const showCreate = popoverSearch && !existingTags.some(t => t.toLowerCase() === popoverSearch.toLowerCase());

      return (
        <div
          className="fixed z-50 w-56 rounded-lg shadow-xl p-2"
          style={{
            top: activePopover.y,
            left: activePopover.x,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--card-border)'
          }}
          ref={popoverRef}
        >
          <div className="mb-2">
            <input
              autoFocus
              type="text"
              placeholder="Search or create tag..."
              value={popoverSearch}
              onChange={(e) => setPopoverSearch(e.target.value)}
              className="w-full text-xs rounded px-2 py-1.5 focus:outline-none"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--card-border)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {existingTags.map(tag => (
              <button
                key={tag}
                onClick={() => {
                  toggleTagOnProduct(activePopover.target as number, tag);
                  setActivePopover(null);
                  setPopoverSearch('');
                }}
                className="w-full text-left px-2 py-1.5 rounded text-sm hover:bg-opacity-50 flex items-center justify-between group"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tagDatabase[tag] }} />
                  {tag}
                </div>
                {products.find(p => p.id === activePopover.target)?.tags.includes(tag) && (
                  <Check className="w-3 h-3" style={{ color: 'var(--brand-blue)' }} />
                )}
              </button>
            ))}
            {showCreate && (
              <button
                onClick={() => {
                  const newTag = handleCreateTag(popoverSearch);
                  if (newTag) toggleTagOnProduct(activePopover.target as number, newTag);
                  setActivePopover(null);
                  setPopoverSearch('');
                }}
                className="w-full text-left px-2 py-1.5 rounded text-sm font-medium flex items-center gap-2"
                style={{ color: 'var(--brand-blue)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <Plus className="w-3 h-3" />
                Create "{popoverSearch}"
              </button>
            )}
          </div>
        </div>
      );
    }

    if (activePopover.type === 'edit') {
      const tagName = activePopover.target as string;
      const currentColor = tagDatabase[tagName];

      return (
        <div
          className="fixed z-50 w-[280px] rounded-lg shadow-xl p-3"
          style={{
            top: activePopover.y,
            left: activePopover.x,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--card-border)'
          }}
          ref={popoverRef}
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Edit Tag</h4>
            <button
              onClick={() => setTagToDelete(tagName)}
              className="p-1 rounded transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                e.currentTarget.style.color = '#ef4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
              title="Delete Tag"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>Tag Name</label>
              <input
                type="text"
                value={tagToEdit?.name || tagName}
                onChange={(e) => setTagToEdit({ ...tagToEdit, name: e.target.value } as { name: string; color: string })}
                className="w-full text-sm rounded px-2 py-1.5 focus:outline-none"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--card-border)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            <div>
              <label className="block text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>Color</label>
              <div className="grid grid-cols-8 gap-2">
                {COLOR_PALETTE.map(c => (
                  <button
                    key={c}
                    onClick={() => setTagToEdit({ ...tagToEdit, color: c } as { name: string; color: string })}
                    className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                    style={{
                      backgroundColor: c,
                      borderColor: (tagToEdit?.color || currentColor) === c ? '#ffffff' : 'transparent'
                    }}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={() => handleUpdateTag(tagName, tagToEdit!.name, tagToEdit!.color)}
              disabled={!tagToEdit?.name.trim()}
              className="w-full py-1.5 text-xs font-medium rounded transition-colors disabled:opacity-50"
              style={{
                background: 'var(--brand-blue)',
                color: 'var(--text-primary)'
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  const ConfirmDeleteModal = () => {
    if (!tagToDelete) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md" style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
        <div className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--card-border)' }}>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
              <Trash2 className="w-6 h-6" style={{ color: '#ef4444' }} />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Delete Tag?</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Are you sure you want to delete "<span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{tagToDelete}</span>"? This action cannot be undone and will remove it from all products.
            </p>
            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                onClick={() => setTagToDelete(null)}
                className="py-2.5 text-sm font-semibold rounded-xl transition-all"
                style={{
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--card-border)'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteTag(tagToDelete);
                  setTagToDelete(null);
                  if (activePopover?.target === tagToDelete) {
                    setActivePopover(null);
                  }
                }}
                className="py-2.5 text-sm font-semibold rounded-xl transition-all shadow-lg"
                style={{
                  background: '#ef4444',
                  color: '#ffffff',
                  boxShadow: '0 10px 40px rgba(239, 68, 68, 0.2)'
                }}
              >
                Delete Tag
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-lg" style={{ border: '1px solid var(--card-border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" style={{ minWidth: '1400px' }}>
            <thead className="text-xs tracking-wider font-semibold" style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
              <tr>
                <th
                  className="p-4 w-12 text-center sticky left-0 z-20"
                  style={{ background: 'var(--bg-card)' }}
                >
                  <input
                    type="checkbox"
                    className="rounded focus:ring-0 focus:ring-offset-0"
                    style={{ borderColor: '#4b5563', background: 'var(--bg-primary)', color: 'var(--brand-blue)' }}
                    checked={selectedProductIds.size === products.length && products.length > 0}
                    onChange={() => {
                      if (selectedProductIds.size === products.length) setSelectedProductIds(new Set());
                      else setSelectedProductIds(new Set(products.map(p => p.id)));
                    }}
                  />
                </th>
                <th
                  className="p-4 min-w-[340px] sticky left-12 z-20"
                  style={{ background: 'var(--bg-card)', boxShadow: '4px 0 8px rgba(0,0,0,0.15)' }}
                >
                  Product
                </th>
                <th className="p-4 text-center whitespace-nowrap">Product Score</th>
                <th className="p-4 text-right whitespace-nowrap">Price</th>
                <th className="p-4 text-right whitespace-nowrap">Sales</th>
                <th className="p-4 text-right whitespace-nowrap">Profit</th>
                <th className="p-4 text-right whitespace-nowrap">Organic Sales</th>
                <th className="p-4 text-right whitespace-nowrap">Product Cost</th>
                <th className="p-4 text-right whitespace-nowrap">FBA Fee</th>
                <th className="p-4 text-right whitespace-nowrap">Referral Fee</th>
                <th className="p-4 text-right whitespace-nowrap">Total Fees</th>
              </tr>
            </thead>
            <tbody style={{ borderTop: '1px solid var(--card-border)' }}>
              {products.map((product) => {
                const score = getScore(product);
                const scoreColor = getScoreColor(score);

                return (
                  <tr
                    key={product.id}
                    className="transition-colors group product-row"
                    style={{ borderBottom: '1px solid var(--card-border)' }}
                  >
                    <td
                      className="p-4 text-center sticky left-0 z-10"
                      style={{ background: 'var(--bg-primary)' }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProductIds.has(product.id)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => {
                          const newSet = new Set(selectedProductIds);
                          if (newSet.has(product.id)) newSet.delete(product.id);
                          else newSet.add(product.id);
                          setSelectedProductIds(newSet);
                        }}
                        className="rounded focus:ring-0 focus:ring-offset-0"
                        style={{ borderColor: '#4b5563', background: 'var(--bg-primary)', color: 'var(--brand-blue)' }}
                      />
                    </td>
                    <td
                      className="p-4 min-w-[380px] sticky left-12 z-10"
                      style={{ background: 'var(--bg-primary)', boxShadow: '4px 0 8px rgba(0,0,0,0.15)' }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <img
                            src={product.image}
                            alt=""
                            className="w-14 h-14 rounded-lg object-cover bg-white"
                            style={{ border: '1px solid var(--card-border)' }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className="font-semibold text-[13px] leading-tight mb-2"
                            style={{ color: 'var(--text-primary)' }}
                            title={product.name}
                          >
                            {product.name.length > 50 ? product.name.substring(0, 50) + '...' : product.name}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium"
                              style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}
                            >
                              ASIN: {product.asin}
                            </span>
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium"
                              style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' }}
                            >
                              Parent: {product.parentAsin}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className="text-[12px] font-medium px-2 py-0.5 rounded"
                              style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}
                            >
                              {product.brand}
                            </span>
                            <button
                              className="text-[11px] font-medium flex items-center gap-1 transition-colors hover:underline"
                              style={{ color: 'var(--brand-blue)' }}
                            >
                              <ChevronRight className="w-3 h-3" />
                              View SKUs
                            </button>
                            <button
                              className="text-[11px] font-medium flex items-center gap-1 transition-colors hover:underline"
                              style={{ color: 'var(--brand-blue)' }}
                            >
                              <ChevronRight className="w-3 h-3" />
                              View Days
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <div className="relative inline-flex items-center justify-center">
                        <span
                          className="text-[14px] font-semibold"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {score}
                        </span>
                        <span
                          className="absolute -top-4 -right-7 inline-flex items-center justify-center cursor-pointer"
                          title={getScoreLabel() === 'APS' ? 'Amazon Performance Score' : getScoreLabel() === 'SPS' ? 'Shopify Performance Score' : 'Unified Performance Score'}
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div style={{ cursor: 'pointer', lineHeight: 0 }}>
                                  {getScoreLabel() === 'APS' ? (
                                    <img
                                      src="/amazon.png"
                                      alt="Amazon"
                                      width="18"
                                      height="18"
                                      style={{ borderRadius: '4px', display: 'block' }}
                                    />
                                  ) : getScoreLabel() === 'SPS' ? (
                                    <img
                                      src="/shopify.png"
                                      alt="Shopify"
                                      width="18"
                                      height="18"
                                      style={{ borderRadius: '4px', display: 'block' }}
                                    />
                                  ) : (
                                    <img
                                      src="/eva.png"
                                      alt="Eva"
                                      width="18"
                                      height="18"
                                      style={{ borderRadius: '4px', display: 'block' }}
                                    />
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p>{getScoreLabel() === 'APS' ? 'Amazon Performance Score' : getScoreLabel() === 'SPS' ? 'Shopify Performance Score' : 'Eva Performance Score'}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="text-[13px]" style={{ color: 'var(--text-primary)' }}>
                        {product.price}
                      </div>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {product.sales}
                      </div>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="text-[13px] font-medium" style={{ color: 'var(--brand-green)' }}>
                        {product.profit}
                      </div>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="text-[13px]" style={{ color: 'var(--text-primary)' }}>
                        {product.organicSales}
                      </div>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="text-[13px]" style={{ color: 'var(--text-primary)' }}>
                        {product.productCost}
                      </div>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                        {product.fbaFee}
                      </div>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                        {product.referralFee}
                      </div>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="text-[13px] font-semibold" style={{ color: 'var(--warning)' }}>
                        {product.totalFees}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {renderPopoverContent()}
      <ConfirmDeleteModal />
    </>
  );
}
