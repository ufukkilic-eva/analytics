import React, { useEffect, useMemo, useState } from 'react';
import { LayoutGrid, Table as TableIcon, Download, DollarSign, Hash, Settings, Search, X as XIcon } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { ProductTable } from './ProductTable';
import { AdvancedFilter } from './AdvancedFilter';
import { PeriodSelector } from './PeriodSelector';
import { ChannelHeader } from './ChannelHeader';
import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type Channel = 'amazon' | 'shopify' | 'walmart';
type AccountType = 'seller' | 'vendor' | 'both' | 'none';

type ViewMode = 'product' | 'campaign';
type TimeRange = 'daily' | 'weekly' | 'monthly';
type TableViewMode = 'table' | 'cards';
type GroupBy = 'brand' | 'tag' | 'parent-asin' | 'asin' | 'sku';

interface MetricDefinition {
  id: string;
  label: string;
  value: string;
  previousValue: string;
  change: { value: string; isPositive: boolean };
  accentColor: string;
  category: string;
  chart?: {
    dataKey: string;
    yAxisId: 'left' | 'right';
    type?: 'number' | 'currency' | 'percent';
    renderAs?: 'line' | 'bar';
  };
}

const createMetricDefinition = (
  id: string,
  label: string,
  category: string,
  accentColor: string,
  overrides?: Partial<MetricDefinition>
): MetricDefinition => ({
  id,
  label,
  category,
  accentColor,
  value: '-',
  previousValue: '-',
  change: { value: '0.0%', isPositive: true },
  ...overrides,
});

const SELLER_ONLY_METRIC_DEFINITIONS: MetricDefinition[] = [
  createMetricDefinition('revenue', 'Revenue', 'Revenue', '#22c55e'),
  createMetricDefinition('sales', 'Sales', 'Revenue', '#22c55e'),
  createMetricDefinition('profit', 'Profit', 'Revenue', '#22c55e'),
  createMetricDefinition('ad-sales', 'Ad Sales', 'Revenue', '#22c55e', { value: '$28,460', previousValue: '$25,200', change: { value: '12.9%', isPositive: true }, chart: { dataKey: 'adSales', yAxisId: 'right', type: 'currency' } }),
  createMetricDefinition('ad-aov', 'Ad AOV', 'Revenue', '#22c55e'),
  createMetricDefinition('organic-sales', 'Organic Sales', 'Revenue', '#22c55e', { value: '$76,350', previousValue: '$72,550', change: { value: '5.2%', isPositive: true }, chart: { dataKey: 'organicSales', yAxisId: 'right', type: 'currency' } }),
  createMetricDefinition('b2b-ordered-product-sales', 'B2B Ordered Product Sales', 'Revenue', '#22c55e'),
  createMetricDefinition('aov', 'AOV', 'Revenue', '#22c55e'),

  createMetricDefinition('ad-spend', 'Ad Spend', 'Advertising', '#10b981'),
  createMetricDefinition('impressions', 'Impressions', 'Advertising', '#10b981', { value: '1,245,680', previousValue: '1,112,000', change: { value: '12.5%', isPositive: true }, chart: { dataKey: 'impressions', yAxisId: 'right', type: 'number', renderAs: 'bar' } }),
  createMetricDefinition('clicks', 'Clicks', 'Advertising', '#10b981', { value: '34,980', previousValue: '31,250', change: { value: '11.9%', isPositive: true }, chart: { dataKey: 'clicks', yAxisId: 'right', type: 'number' } }),
  createMetricDefinition('ad-conversions', 'Ad Conversions', 'Advertising', '#10b981'),
  createMetricDefinition('ad-units', 'Ad Units', 'Advertising', '#10b981'),
  createMetricDefinition('ad-sku-sales', 'Ad SKU Sales', 'Advertising', '#10b981'),
  createMetricDefinition('ad-sales-attributed-sku', 'Ad Sales Attributed SKU', 'Advertising', '#10b981'),
  createMetricDefinition('acos', 'ACoS', 'Advertising', '#10b981', { value: '18.5%', previousValue: '22.3%', change: { value: '17.0%', isPositive: false }, chart: { dataKey: 'acos', yAxisId: 'left', type: 'percent' } }),
  createMetricDefinition('tacos', 'TACoS', 'Advertising', '#10b981'),
  createMetricDefinition('roas', 'ROAS', 'Advertising', '#10b981', { value: '3.42', previousValue: '3.09', change: { value: '10.7%', isPositive: true }, chart: { dataKey: 'roas', yAxisId: 'left', type: 'number' } }),
  createMetricDefinition('cpc', 'CPC', 'Advertising', '#10b981'),
  createMetricDefinition('ctr', 'CTR', 'Advertising', '#10b981'),
  createMetricDefinition('cvr', 'CVR', 'Advertising', '#10b981'),

  createMetricDefinition('quantity', 'Quantity', 'Orders', '#ec4899'),
  createMetricDefinition('order-count', 'Order Count', 'Orders', '#ec4899', { value: '2,140', previousValue: '1,780', change: { value: '20.2%', isPositive: true }, chart: { dataKey: 'order', yAxisId: 'right', type: 'number' } }),
  createMetricDefinition('organic-units', 'Organic Units', 'Orders', '#ec4899'),
  createMetricDefinition('organic-orders', 'Organic Orders', 'Orders', '#ec4899'),
  createMetricDefinition('repeat-order-quantity', 'Repeat Order Quantity', 'Orders', '#ec4899'),
  createMetricDefinition('repeat-order-customer-count', 'Repeat Order Customer Count', 'Orders', '#ec4899'),
  createMetricDefinition('new-to-brand-customer-count', 'New to Brand Customer Count', 'Orders', '#ec4899'),
  createMetricDefinition('new-to-brand-order-quantity', 'New to Brand Order Quantity', 'Orders', '#ec4899'),
  createMetricDefinition('b2b-total-order-items', 'B2B Total Order Items', 'Orders', '#ec4899'),
  createMetricDefinition('b2b-units-ordered', 'B2B Units Ordered', 'Orders', '#ec4899'),
  createMetricDefinition('ordered-product-sales-amount', 'Ordered Product Sales Amount', 'Orders', '#ec4899'),
  createMetricDefinition('total-order-items', 'Total Order Items', 'Orders', '#ec4899'),

  createMetricDefinition('margin', 'Margin', 'Performance', '#38bdf8'),
  createMetricDefinition('roi', 'ROI', 'Performance', '#38bdf8'),
  createMetricDefinition('day-of-supply-fba', 'Day of Supply (FBA)', 'Performance', '#38bdf8'),
  createMetricDefinition('day-of-supply-fbm', 'Day of Supply (FBM)', 'Performance', '#38bdf8'),
  createMetricDefinition('market-share', 'Market Share', 'Performance', '#38bdf8'),
  createMetricDefinition('share-of-voice', 'Share of Voice', 'Performance', '#38bdf8'),
  createMetricDefinition('sales-velocity', 'Sales Velocity', 'Performance', '#38bdf8'),
  createMetricDefinition('fba-fee', 'FBA Fee', 'Performance', '#38bdf8'),
  createMetricDefinition('referral-fee', 'Referral Fee', 'Performance', '#38bdf8'),
  createMetricDefinition('variable-closing-fee', 'Variable Closing Fee', 'Performance', '#38bdf8'),
  createMetricDefinition('total-fees', 'Total Fees', 'Performance', '#38bdf8'),
  createMetricDefinition('unit-landing-cost', 'Unit Landing Cost', 'Performance', '#38bdf8'),
  createMetricDefinition('cogs', 'COGS', 'Performance', '#38bdf8'),
  createMetricDefinition('total-expense', 'Total Expense', 'Performance', '#38bdf8'),
  createMetricDefinition('refund-amount', 'Refund Amount', 'Performance', '#38bdf8'),
  createMetricDefinition('shipping-amount', 'Shipping Amount', 'Performance', '#38bdf8'),
  createMetricDefinition('fbm-shipping-cost', 'FBM Shipping Cost', 'Performance', '#38bdf8'),
  createMetricDefinition('shipping-to-fba-cost', 'Shipping to FBA Cost', 'Performance', '#38bdf8'),
  createMetricDefinition('new-order-rate', 'New Order Rate', 'Performance', '#38bdf8'),
  createMetricDefinition('new-customer-rate', 'New Customer Rate', 'Performance', '#38bdf8'),
  createMetricDefinition('repeat-order-rate', 'Repeat Order Rate', 'Performance', '#38bdf8'),
  createMetricDefinition('repeat-customer-rate', 'Repeat Customer Rate', 'Performance', '#38bdf8'),
  createMetricDefinition('refund-percent', 'Refund %', 'Performance', '#38bdf8'),
  createMetricDefinition('asin-purchase-count', 'ASIN Purchase Count', 'Performance', '#38bdf8'),
  createMetricDefinition('total-purchase-count', 'Total Purchase Count', 'Performance', '#38bdf8'),
  createMetricDefinition('market-share-cp', 'Market Share CP', 'Performance', '#38bdf8'),
  createMetricDefinition('share-of-voice-cp', 'Share of Voice CP', 'Performance', '#38bdf8'),
  createMetricDefinition('buy-box-percent', 'Buy Box %', 'Performance', '#38bdf8', { value: '98.2%', previousValue: '97.1%', change: { value: '1.1%', isPositive: true }, chart: { dataKey: 'buyBoxPct', yAxisId: 'left', type: 'percent' } }),
  createMetricDefinition('buy-box-percent-b2b', 'Buy Box % B2B', 'Performance', '#38bdf8'),

  createMetricDefinition('sessions', 'Sessions', 'Traffic', '#f59e0b'),
  createMetricDefinition('child-sessions', 'Child Sessions', 'Traffic', '#f59e0b'),
  createMetricDefinition('asin-impression-count', 'ASIN Impression Count', 'Traffic', '#f59e0b'),
  createMetricDefinition('total-query-impression-count', 'Total Query Impression Count', 'Traffic', '#f59e0b'),
  createMetricDefinition('page-views', 'Page Views', 'Traffic', '#f59e0b'),
  createMetricDefinition('b2b-page-views', 'B2B Page Views', 'Traffic', '#f59e0b'),
  createMetricDefinition('b2b-sessions', 'B2B Sessions', 'Traffic', '#f59e0b'),
  createMetricDefinition('browser-sessions', 'Browser Sessions', 'Traffic', '#f59e0b'),
  createMetricDefinition('browser-sessions-b2b', 'Browser Sessions B2B', 'Traffic', '#f59e0b'),
  createMetricDefinition('mobile-app-sessions', 'Mobile App Sessions', 'Traffic', '#f59e0b'),
  createMetricDefinition('mobile-app-sessions-b2b', 'Mobile App Sessions B2B', 'Traffic', '#f59e0b'),
  createMetricDefinition('browser-page-views', 'Browser Page Views', 'Traffic', '#f59e0b'),
  createMetricDefinition('browser-page-views-b2b', 'Browser Page Views B2B', 'Traffic', '#f59e0b'),
  createMetricDefinition('mobile-app-page-views', 'Mobile App Page Views', 'Traffic', '#f59e0b'),
  createMetricDefinition('mobile-app-page-views-b2b', 'Mobile App Page Views B2B', 'Traffic', '#f59e0b'),
  createMetricDefinition('browser-session-percent', 'Browser Session %', 'Traffic', '#f59e0b'),
  createMetricDefinition('browser-session-percent-b2b', 'Browser Session % B2B', 'Traffic', '#f59e0b'),
  createMetricDefinition('mobile-app-session-percent', 'Mobile App Session %', 'Traffic', '#f59e0b'),
  createMetricDefinition('mobile-app-session-percent-b2b', 'Mobile App Session % B2B', 'Traffic', '#f59e0b'),
  createMetricDefinition('browser-page-views-percent', 'Browser Page Views %', 'Traffic', '#f59e0b'),
  createMetricDefinition('mobile-app-page-views-percent', 'Mobile App Page Views %', 'Traffic', '#f59e0b'),
  createMetricDefinition('session-percent', 'Session %', 'Traffic', '#f59e0b'),
  createMetricDefinition('session-percent-b2b', 'Session % B2B', 'Traffic', '#f59e0b'),
  createMetricDefinition('page-views-percent', 'Page Views %', 'Traffic', '#f59e0b'),
  createMetricDefinition('units-per-session', 'Units Per Session', 'Traffic', '#f59e0b'),
  createMetricDefinition('b2b-units-per-session', 'B2B Units Per Session', 'Traffic', '#f59e0b'),

  createMetricDefinition('inbound-quantity', 'Inbound Quantity', 'Other', '#94a3b8'),
  createMetricDefinition('fc-transfer', 'FC Transfer', 'Other', '#94a3b8'),
  createMetricDefinition('available-quantity', 'Available Quantity', 'Other', '#94a3b8'),
  createMetricDefinition('refund-quantity', 'Refund Quantity', 'Other', '#94a3b8'),
];

const VENDOR_ONLY_METRIC_DEFINITIONS: MetricDefinition[] = [
  createMetricDefinition('shipped-revenue', 'Shipped Revenue', 'Revenue', '#22c55e', { value: '$88,420', previousValue: '$81,230', change: { value: '8.9%', isPositive: true }, chart: { dataKey: 'shippedRevenue', yAxisId: 'right', type: 'currency' } }),
  createMetricDefinition('sales', 'Sales', 'Revenue', '#22c55e', { value: '$76,350', previousValue: '$72,550', change: { value: '5.2%', isPositive: true }, chart: { dataKey: 'sales', yAxisId: 'right', type: 'currency' } }),
  createMetricDefinition('ad-sales', 'Ad Sales', 'Revenue', '#22c55e', { value: '$28,460', previousValue: '$25,200', change: { value: '12.9%', isPositive: true }, chart: { dataKey: 'adSales', yAxisId: 'right', type: 'currency' } }),
  createMetricDefinition('refund-amount', 'Refund Amount', 'Revenue', '#22c55e'),
  createMetricDefinition('open-purchase-order-units', 'Open Purchase Order Units', 'Revenue', '#22c55e'),
  createMetricDefinition('po-period-ordered-units', 'PO Period Ordered Units', 'Revenue', '#22c55e'),
  createMetricDefinition('po-period-open-units', 'PO Period Open Units', 'Revenue', '#22c55e'),
  createMetricDefinition('po-period-closed-units', 'PO Period Closed Units', 'Revenue', '#22c55e'),

  createMetricDefinition('ad-spend', 'Ad Spend', 'Advertising', '#10b981'),
  createMetricDefinition('ad-aov', 'Ad AOV', 'Advertising', '#10b981'),
  createMetricDefinition('impressions', 'Impressions', 'Advertising', '#10b981', { value: '1,245,680', previousValue: '1,112,000', change: { value: '12.5%', isPositive: true }, chart: { dataKey: 'impressions', yAxisId: 'right', type: 'number', renderAs: 'bar' } }),
  createMetricDefinition('clicks', 'Clicks', 'Advertising', '#10b981', { value: '34,980', previousValue: '31,250', change: { value: '11.9%', isPositive: true }, chart: { dataKey: 'clicks', yAxisId: 'right', type: 'number' } }),
  createMetricDefinition('ad-conversions', 'Ad Conversions', 'Advertising', '#10b981'),
  createMetricDefinition('ad-units', 'Ad Units', 'Advertising', '#10b981'),
  createMetricDefinition('ad-sku-sales', 'Ad SKU Sales', 'Advertising', '#10b981'),
  createMetricDefinition('ad-sales-attributed-sku', 'Ad Sales Attributed SKU', 'Advertising', '#10b981'),
  createMetricDefinition('acos', 'ACoS', 'Advertising', '#10b981', { value: '18.5%', previousValue: '22.3%', change: { value: '17.0%', isPositive: false }, chart: { dataKey: 'acos', yAxisId: 'left', type: 'percent' } }),
  createMetricDefinition('tacos', 'TACoS', 'Advertising', '#10b981'),
  createMetricDefinition('roas', 'ROAS', 'Advertising', '#10b981', { value: '3.42%', previousValue: '3.09%', change: { value: '10.7%', isPositive: true }, chart: { dataKey: 'roas', yAxisId: 'left', type: 'number' } }),
  createMetricDefinition('cpc', 'CPC', 'Advertising', '#10b981'),
  createMetricDefinition('ctr', 'CTR', 'Advertising', '#10b981'),
  createMetricDefinition('cvr', 'CVR', 'Advertising', '#10b981'),

  createMetricDefinition('order-count', 'Order Count', 'Orders', '#ec4899', { value: '2,140', previousValue: '1,780', change: { value: '20.2%', isPositive: true }, chart: { dataKey: 'order', yAxisId: 'right', type: 'number' } }),
  createMetricDefinition('shipped-units', 'Shipped Units', 'Orders', '#ec4899', { chart: { dataKey: 'shippedUnits', yAxisId: 'right', type: 'number' } }),
  createMetricDefinition('quantity', 'Quantity', 'Orders', '#ec4899'),
  createMetricDefinition('repeat-orders', 'Repeat Orders', 'Orders', '#ec4899'),
  createMetricDefinition('repeat-purchase-revenue', 'Repeat Purchase Revenue', 'Orders', '#ec4899'),

  createMetricDefinition('sessions', 'Sessions', 'Traffic', '#f59e0b', { chart: { dataKey: 'sessions', yAxisId: 'right', type: 'number' } }),
  createMetricDefinition('page-views', 'Page Views', 'Traffic', '#f59e0b', { chart: { dataKey: 'pageViews', yAxisId: 'right', type: 'number' } }),

  createMetricDefinition('vendor-confirmation-rate', 'Vendor Confirmation Rate', 'Performance', '#38bdf8'),
  createMetricDefinition('avg-vendor-lead-time-days', 'Avg Vendor Lead Time (Days)', 'Performance', '#38bdf8'),
  createMetricDefinition('procurable-out-of-stock-rate', 'Procurable Out of Stock Rate', 'Performance', '#38bdf8'),

  createMetricDefinition('sellable-on-hand-inventory', 'Sellable On Hand Inventory', 'Other', '#94a3b8'),
  createMetricDefinition('unsellable-on-hand-inventory', 'Unsellable On Hand Inventory', 'Other', '#94a3b8'),
  createMetricDefinition('aged-90-plus-days-units', 'Aged 90+ Days Units', 'Other', '#94a3b8'),
];

const BOTH_METRIC_DEFINITIONS: MetricDefinition[] = [
  createMetricDefinition('sales', 'Sales', 'Revenue', '#22c55e', { value: '$76,350', previousValue: '$72,550', change: { value: '5.2%', isPositive: true }, chart: { dataKey: 'sales', yAxisId: 'right', type: 'currency' } }),
  createMetricDefinition('ad-sales', 'Ad Sales', 'Revenue', '#22c55e', { value: '$28,460', previousValue: '$25,200', change: { value: '12.9%', isPositive: true }, chart: { dataKey: 'adSales', yAxisId: 'right', type: 'currency' } }),
  createMetricDefinition('refund-amount', 'Refund Amount', 'Revenue', '#22c55e'),
  createMetricDefinition('ad-spend', 'Ad Spend', 'Advertising', '#10b981'),
  createMetricDefinition('ad-aov', 'Ad AOV', 'Advertising', '#10b981'),
  createMetricDefinition('clicks', 'Clicks', 'Advertising', '#10b981', { value: '34,980', previousValue: '31,250', change: { value: '11.9%', isPositive: true }, chart: { dataKey: 'clicks', yAxisId: 'right', type: 'number' } }),
  createMetricDefinition('ad-conversions', 'Ad Conversions', 'Advertising', '#10b981'),
  createMetricDefinition('ad-units', 'Ad Units', 'Advertising', '#10b981'),
  createMetricDefinition('ad-sku-sales', 'Ad SKU Sales', 'Advertising', '#10b981'),
  createMetricDefinition('ad-sales-attributed-sku', 'Ad Sales Attributed SKU', 'Advertising', '#10b981'),
  createMetricDefinition('acos', 'ACoS', 'Advertising', '#10b981', { value: '18.5%', previousValue: '22.3%', change: { value: '17.0%', isPositive: false }, chart: { dataKey: 'acos', yAxisId: 'left', type: 'percent' } }),
  createMetricDefinition('tacos', 'TACoS', 'Advertising', '#10b981'),
  createMetricDefinition('roas', 'ROAS', 'Advertising', '#10b981', { value: '3.42', previousValue: '3.09', change: { value: '10.7%', isPositive: true }, chart: { dataKey: 'roas', yAxisId: 'left', type: 'number' } }),
  createMetricDefinition('cpc', 'CPC', 'Advertising', '#10b981'),
  createMetricDefinition('ctr', 'CTR', 'Advertising', '#10b981'),
  createMetricDefinition('cvr', 'CVR', 'Advertising', '#10b981'),

  createMetricDefinition('quantity', 'Quantity', 'Orders', '#ec4899', { chart: { dataKey: 'order', yAxisId: 'right', type: 'number' } }),
  createMetricDefinition('repeat-order-customer-count', 'Repeat Order Customer Count', 'Orders', '#ec4899'),

  createMetricDefinition('page-views', 'Page Views', 'Traffic', '#f59e0b', { chart: { dataKey: 'pageViews', yAxisId: 'right', type: 'number' } }),

];

export function AnalyticsView() {
  const [viewMode, setViewMode] = useState<ViewMode>('product');
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const [tableViewMode, setTableViewMode] = useState<TableViewMode>('table');
  const [groupBy, setGroupBy] = useState<GroupBy>('asin');
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>(['amazon']);
  const [accountType, setAccountType] = useState<AccountType>('seller');
  const [selectedMetricIds, setSelectedMetricIds] = useState<string[]>(['impressions', 'organic-sales', 'order-count', 'acos']);
  const [chartVisibleMetricIds, setChartVisibleMetricIds] = useState<Set<string>>(new Set(['impressions', 'organic-sales', 'order-count', 'acos']));
  const [manageMetricsOpen, setManageMetricsOpen] = useState(false);
  const [metricSearch, setMetricSearch] = useState('');

  const chartData = useMemo(() => {
    const base = [
      { date: 'Jan 1', impressions: 145000, organicSales: 27000, order: 1200, acos: 22.5, volume: 450 },
      { date: 'Jan 5', impressions: 182000, organicSales: 31000, order: 1350, acos: 21.8, volume: 520 },
      { date: 'Jan 10', impressions: 168000, organicSales: 28500, order: 1280, acos: 23.2, volume: 480 },
      { date: 'Jan 15', impressions: 221000, organicSales: 37000, order: 1680, acos: 20.5, volume: 610 },
      { date: 'Jan 20', impressions: 198000, organicSales: 35000, order: 1580, acos: 21.1, volume: 580 },
      { date: 'Jan 25', impressions: 271000, organicSales: 43000, order: 1910, acos: 19.3, volume: 710 },
      { date: 'Jan 30', impressions: 1245680, organicSales: 76350, order: 2140, acos: 18.5, volume: 750 },
    ];
    return base.map((point, index) => ({
      ...point,
      adSales: Math.round(point.organicSales * 0.42 + (index % 3) * 1200),
      sales: point.organicSales,
      shippedRevenue: Math.round(point.organicSales * 1.16),
      shippedUnits: Math.round(point.order * 1.12),
      sessions: Math.round(point.impressions * 0.11),
      pageViews: Math.round(point.impressions * 0.16),
      roas: Number((2.4 + (index % 5) * 0.22).toFixed(2)),
      clicks: Math.round(point.impressions * 0.028 + index * 150),
      buyBoxPct: Number((96.2 + (index % 4) * 0.6).toFixed(1)),
    }));
  }, []);

  const activeMetricDefinitions = useMemo(
    () => {
      if (accountType === 'seller') return SELLER_ONLY_METRIC_DEFINITIONS;
      if (accountType === 'vendor') return VENDOR_ONLY_METRIC_DEFINITIONS;
      if (accountType === 'both') return BOTH_METRIC_DEFINITIONS;
      return [];
    },
    [accountType]
  );

  const selectedMetrics = useMemo(
    () => selectedMetricIds
      .map(id => activeMetricDefinitions.find(metric => metric.id === id))
      .filter((metric): metric is MetricDefinition => Boolean(metric)),
    [selectedMetricIds, activeMetricDefinitions]
  );

  const filteredMetricDefinitions = useMemo(() => {
    const query = metricSearch.trim().toLowerCase();
    if (!query) return activeMetricDefinitions;
    return activeMetricDefinitions.filter(metric => metric.label.toLowerCase().includes(query));
  }, [metricSearch, activeMetricDefinitions]);

  const groupedMetricDefinitions = useMemo(() => {
    const groups: Record<string, MetricDefinition[]> = {};
    filteredMetricDefinitions.forEach(metric => {
      if (!groups[metric.category]) groups[metric.category] = [];
      groups[metric.category].push(metric);
    });
    return groups;
  }, [filteredMetricDefinitions]);

  useEffect(() => {
    setChartVisibleMetricIds(prev => {
      const allowed = new Set(selectedMetricIds);
      const next = new Set<string>();
      prev.forEach(id => {
        if (allowed.has(id)) next.add(id);
      });
      return next;
    });
  }, [selectedMetricIds]);

  useEffect(() => {
    const availableMetricIds = new Set(activeMetricDefinitions.map(metric => metric.id));
    setSelectedMetricIds(prev => {
      const filtered = prev.filter(id => availableMetricIds.has(id));
      if (filtered.length > 0) return filtered;
      if (accountType === 'seller') return ['impressions', 'organic-sales', 'order-count', 'acos'];
      if (accountType === 'vendor') return ['impressions', 'shipped-revenue', 'order-count', 'acos'];
      if (accountType === 'both') return ['sales', 'ad-sales', 'quantity', 'acos'];
      return [];
    });
    setChartVisibleMetricIds(prev => {
      const next = new Set<string>();
      prev.forEach(id => {
        if (availableMetricIds.has(id)) next.add(id);
      });
      return next;
    });
  }, [activeMetricDefinitions, accountType]);

  const toggleMetricChartVisibility = (id: string) => {
    setChartVisibleMetricIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const removeMetric = (id: string) => {
    setSelectedMetricIds(prev => prev.filter(metricId => metricId !== id));
    setChartVisibleMetricIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const toggleMetricSelection = (id: string) => {
    setSelectedMetricIds(prev => (prev.includes(id) ? prev.filter(metricId => metricId !== id) : [...prev, id]));
    setChartVisibleMetricIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const groupByOptions = useMemo<GroupBy[]>(() => {
    const baseOptions: GroupBy[] = ['brand', 'tag', 'parent-asin', 'asin', 'sku'];
    return accountType === 'seller' ? baseOptions : baseOptions.filter(option => option !== 'sku');
  }, [accountType]);

  useEffect(() => {
    if (!groupByOptions.includes(groupBy)) {
      setGroupBy('asin');
    }
  }, [groupBy, groupByOptions]);

  return (
    <div className="space-y-6">
      <ChannelHeader
        selectedChannels={selectedChannels}
        onChannelsChange={setSelectedChannels}
        accountType={accountType}
        onAccountTypeChange={setAccountType}
      />
      <div
        className="p-4 rounded-lg"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--card-border)'
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div
              className="inline-flex rounded-lg p-1"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <button
                onClick={() => setViewMode('product')}
                className="px-4 py-2 text-sm font-medium rounded-md transition-all"
                style={{
                  background: viewMode === 'product' ? 'var(--brand-blue)' : 'transparent',
                  color: viewMode === 'product' ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                Product View
              </button>
              <button
                onClick={() => setViewMode('campaign')}
                className="px-4 py-2 text-sm font-medium rounded-md transition-all"
                style={{
                  background: viewMode === 'campaign' ? 'var(--brand-blue)' : 'transparent',
                  color: viewMode === 'campaign' ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                Campaign View
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div
              className="inline-flex rounded-lg p-1"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <button
                onClick={() => setTimeRange('daily')}
                className="px-3 py-1.5 text-sm font-medium rounded-md transition-all"
                style={{
                  background: timeRange === 'daily' ? 'var(--brand-blue)' : 'transparent',
                  color: timeRange === 'daily' ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                Daily
              </button>
              <button
                onClick={() => setTimeRange('weekly')}
                className="px-3 py-1.5 text-sm font-medium rounded-md transition-all"
                style={{
                  background: timeRange === 'weekly' ? 'var(--brand-blue)' : 'transparent',
                  color: timeRange === 'weekly' ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                Weekly
              </button>
              <button
                onClick={() => setTimeRange('monthly')}
                className="px-3 py-1.5 text-sm font-medium rounded-md transition-all"
                style={{
                  background: timeRange === 'monthly' ? 'var(--brand-blue)' : 'transparent',
                  color: timeRange === 'monthly' ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                Monthly
              </button>
            </div>

            <PeriodSelector />
          </div>
        </div>

        <div className="mt-4">
          <AdvancedFilter mode={accountType} />
        </div>
      </div>

      <div className="relative">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.max(1, selectedMetrics.length)}, 1fr) 90px` }}>
          {selectedMetrics.map(metric => (
            <MetricCard
              key={metric.id}
              label={metric.label}
              value={metric.value}
              previousValue={metric.previousValue}
              change={metric.change}
              selected={chartVisibleMetricIds.has(metric.id)}
              accentColor={metric.accentColor}
              onToggle={() => toggleMetricChartVisibility(metric.id)}
              onCardClick={() => toggleMetricChartVisibility(metric.id)}
              onClose={() => removeMetric(metric.id)}
            />
          ))}

          <button
            onClick={() => setManageMetricsOpen(prev => !prev)}
            className="p-3 rounded-lg border-2 border-dashed transition-all hover:border-brand-blue/50 hover:bg-bg-card-hover/30 flex flex-col items-center justify-center gap-2 cursor-pointer group"
            style={{
              background: 'var(--bg-card)',
              borderColor: manageMetricsOpen ? 'var(--brand-blue)' : 'var(--card-border)',
              minHeight: '90px',
            }}
          >
            <Settings
              size={20}
              className="transition-transform group-hover:rotate-90"
              style={{ color: manageMetricsOpen ? 'var(--brand-blue)' : 'var(--text-muted)' }}
            />
            <span
              className="text-xs font-medium text-center"
              style={{ color: manageMetricsOpen ? 'var(--brand-blue)' : 'var(--text-muted)' }}
            >
              Manage Metrics
            </span>
          </button>
        </div>

        {manageMetricsOpen && (
          <div
            className="absolute right-0 top-[110px] z-40 w-[680px] rounded-xl overflow-hidden shadow-2xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--card-border)' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--card-border)' }}>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Manage Metrics</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Selected metrics update cards and chart together</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedMetricIds([]);
                    setChartVisibleMetricIds(new Set());
                  }}
                  className="text-xs font-medium hover:underline"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Clear all
                </button>
                <button
                  onClick={() => setManageMetricsOpen(false)}
                  className="p-1 rounded hover:bg-white/5"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <XIcon size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-[220px_1fr] min-h-[430px]">
              <div className="p-4 border-r" style={{ borderColor: 'var(--card-border)', background: 'var(--bg-secondary)' }}>
                <div className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
                  Selected ({selectedMetrics.length})
                </div>
                <div className="space-y-2">
                  {selectedMetrics.length === 0 && (
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      No metrics selected.
                    </div>
                  )}
                  {selectedMetrics.map(metric => (
                    <button
                      key={`selected-${metric.id}`}
                      onClick={() => toggleMetricChartVisibility(metric.id)}
                      className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-md text-left border"
                      style={{
                        borderColor: chartVisibleMetricIds.has(metric.id) ? metric.accentColor : 'var(--card-border)',
                        background: chartVisibleMetricIds.has(metric.id) ? 'rgba(255,255,255,0.03)' : 'transparent',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: metric.accentColor }} />
                        <span className="text-xs font-medium truncate">{metric.label}</span>
                      </span>
                      <span className="text-[10px] shrink-0" style={{ color: chartVisibleMetricIds.has(metric.id) ? metric.accentColor : 'var(--text-muted)' }}>
                        {chartVisibleMetricIds.has(metric.id) ? 'Visible' : 'Hidden'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={14} style={{ color: 'var(--text-muted)' }} />
                  <input
                    value={metricSearch}
                    onChange={(e) => setMetricSearch(e.target.value)}
                    placeholder="Search metrics..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg text-sm"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                  {Object.entries(groupedMetricDefinitions).map(([category, items]) => (
                    <div key={category}>
                      <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>
                        {category}
                      </div>
                      <div className="space-y-1.5">
                        {items.map(metric => {
                          const isSelected = selectedMetricIds.includes(metric.id);
                          const isChartVisible = chartVisibleMetricIds.has(metric.id);
                          return (
                            <div
                              key={metric.id}
                              className="flex items-center justify-between gap-3 px-3 py-2 rounded-md border"
                              style={{ borderColor: 'var(--card-border)', background: 'rgba(255,255,255,0.01)' }}
                            >
                              <label className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleMetricSelection(metric.id)}
                                  className="w-3.5 h-3.5 rounded"
                                  style={{ accentColor: metric.accentColor }}
                                />
                                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: metric.accentColor }} />
                                <span className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>{metric.label}</span>
                              </label>
                              {isSelected && (
                                <button
                                  onClick={() => toggleMetricChartVisibility(metric.id)}
                                  className="text-[10px] font-medium px-2 py-1 rounded border"
                                  style={{
                                    color: isChartVisible ? metric.accentColor : 'var(--text-muted)',
                                    borderColor: isChartVisible ? metric.accentColor : 'var(--card-border)',
                                    background: 'transparent'
                                  }}
                                >
                                  {isChartVisible ? 'Chart On' : 'Chart Off'}
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        className="p-6 rounded-lg relative"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--card-border)'
        }}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Hash size={14} style={{ color: 'var(--text-muted)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  Quantity
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={14} style={{ color: 'var(--text-muted)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  Revenue
                </span>
              </div>
            </div>
            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                Trends
              </h3>
              <p
                className="text-sm mt-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                Performance over time
              </p>
            </div>
          </div>

          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
            style={{
              background: 'var(--brand-blue)',
              color: 'var(--text-primary)',
            }}
          >
            <Download size={16} />
            Export
          </button>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={chartData} margin={{ top: 5, right: 40, bottom: 5, left: 0 }}>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(value) => value}
              domain={[0, 750]}
              dx={-10}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              domain={[0, 1300000]}
              dx={10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e2230',
                border: '1px solid #2d3142',
                borderRadius: '8px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
                padding: '12px',
              }}
              labelStyle={{ color: '#ffffff', marginBottom: '8px', fontWeight: 600 }}
              itemStyle={{ fontSize: '13px', padding: '2px 0' }}
              formatter={(value: number, name: string) => {
                const displayName = name === 'volume' ? 'Volume' :
                  name === 'impressions' ? 'Impressions' :
                    name === 'sales' ? 'Sales' :
                      name === 'shippedRevenue' ? 'Shipped Revenue' :
                        name === 'shippedUnits' ? 'Shipped Units' :
                          name === 'sessions' ? 'Sessions' :
                            name === 'pageViews' ? 'Page Views' :
                  name === 'organicSales' ? 'Organic Sales' :
                    name === 'order' ? 'Order' :
                      name === 'acos' ? 'ACoS' :
                          name === 'adSales' ? 'Ad Sales' :
                            name === 'roas' ? 'ROAS' :
                              name === 'clicks' ? 'Clicks' :
                                name === 'buyBoxPct' ? 'Buy Box %' : name;
                const formattedValue = name === 'volume' ? value.toLocaleString() :
                  name === 'impressions' ? value.toLocaleString() :
                    name === 'sessions' ? value.toLocaleString() :
                      name === 'pageViews' ? value.toLocaleString() :
                        name === 'shippedUnits' ? value.toLocaleString() :
                    name === 'order' ? value.toLocaleString() :
                      name === 'acos' || name === 'buyBoxPct' ? `${value}%` :
                        name === 'organicSales' || name === 'adSales' || name === 'sales' || name === 'shippedRevenue' ? `$${value.toLocaleString()}` : value.toLocaleString();
                return [formattedValue, displayName];
              }}
            />
            {selectedMetrics
              .filter(metric => metric.chart && chartVisibleMetricIds.has(metric.id))
              .filter(metric => metric.chart!.renderAs === 'bar')
              .map(metric => (
                <Bar
                  key={metric.id}
                  yAxisId={metric.chart!.yAxisId}
                  dataKey={metric.chart!.dataKey}
                  fill={metric.accentColor}
                  opacity={0.35}
                  radius={[4, 4, 0, 0]}
                  name={metric.label}
                />
              ))}
            {selectedMetrics
              .filter(metric => metric.chart && chartVisibleMetricIds.has(metric.id))
              .filter(metric => metric.chart!.renderAs !== 'bar')
              .map(metric => (
                <Line
                  key={metric.id}
                  yAxisId={metric.chart!.yAxisId}
                  type="linear"
                  dataKey={metric.chart!.dataKey}
                  stroke={metric.accentColor}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: metric.accentColor, strokeWidth: 2, stroke: '#1a1d2e' }}
                  activeDot={{ r: 6, fill: metric.accentColor, strokeWidth: 2, stroke: '#fff' }}
                  name={metric.label}
                />
              ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              View as:
            </span>
            <div
              className="inline-flex rounded-lg p-1"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <button
                onClick={() => setTableViewMode('table')}
                className="px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2"
                style={{
                  background: tableViewMode === 'table' ? 'var(--brand-blue)' : 'transparent',
                  color: tableViewMode === 'table' ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                <TableIcon size={14} />
                Table
              </button>
              <button
                onClick={() => setTableViewMode('cards')}
                className="px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2"
                style={{
                  background: tableViewMode === 'cards' ? 'var(--brand-blue)' : 'transparent',
                  color: tableViewMode === 'cards' ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                <LayoutGrid size={14} />
                Cards
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              Group by:
            </span>
            <div
              className="inline-flex rounded-lg p-1"
              style={{ background: 'var(--bg-secondary)' }}
            >
              {groupByOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setGroupBy(option)}
                  className="px-3 py-1.5 text-sm font-medium rounded-md transition-all"
                  style={{
                    background: groupBy === option ? 'var(--brand-blue)' : 'transparent',
                    color: groupBy === option ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                >
                  {option === 'brand' ? 'Brand' :
                    option === 'tag' ? 'Tag' :
                      option === 'parent-asin' ? 'Parent Asin' :
                        option === 'asin' ? 'Asin' :
                          option === 'sku' ? 'SKU' : option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="p-6 rounded-lg"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--card-border)'
          }}
        >
          {accountType === 'none' ? (
            <div
              className="rounded-lg p-8 text-center"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px dashed var(--card-border)'
              }}
            >
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Table&apos;ı görmek için Seller ve/veya Vendor seçin.
              </p>
            </div>
          ) : (
            <ProductTable
              selectedStore={
                selectedChannels.length === 2 && selectedChannels.includes('amazon') && selectedChannels.includes('shopify')
                  ? 'both'
                  : selectedChannels.includes('amazon')
                    ? 'amazon'
                    : selectedChannels.includes('shopify')
                      ? 'shopify'
                      : 'both'
              }
              mode={accountType}
              groupBy={groupBy}
            />
          )}
        </div>
      </div>
    </div>
  );
}
