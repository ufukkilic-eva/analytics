import React, { useState } from 'react';
import { Search, Plus, Calendar as CalendarIcon, LayoutGrid, Table as TableIcon } from 'lucide-react';
import { Input } from './ui/input';
import { MetricCard } from './MetricCard';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type ViewMode = 'product' | 'campaign';
type TimeRange = 'daily' | 'weekly' | 'monthly';
type DisplayMode = 'cards' | 'table';
type GroupBy = 'brand' | 'tag' | 'asin' | 'sku';

interface MetricState {
  id: string;
  label: string;
  value: string;
  change: { value: string; isPositive: boolean };
  selected: boolean;
  accentColor: string;
}

interface Product {
  id: string;
  name: string;
  image: string;
  price: string;
  dayOfSupply: number;
  marketShare: string;
  roi: string;
  cost: string;
  adCpc: string;
  adCtr: string;
  sales: string;
  adRoas: string;
}

export function AdvertisingView() {
  const [viewMode, setViewMode] = useState<ViewMode>('product');
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('table');
  const [groupBy, setGroupBy] = useState<GroupBy>('brand');
  
  const [metrics, setMetrics] = useState<MetricState[]>([
    {
      id: 'sales',
      label: 'Sales',
      value: '$124,580',
      change: { value: '12.5%', isPositive: true },
      selected: true,
      accentColor: '#10b981',
    },
    {
      id: 'ad-sales',
      label: 'Ad Sales',
      value: '$48,230',
      change: { value: '8.3%', isPositive: true },
      selected: true,
      accentColor: '#3b82f6',
    },
    {
      id: 'profit',
      label: 'Profit',
      value: '$32,140',
      change: { value: '15.7%', isPositive: true },
      selected: true,
      accentColor: '#34d399',
    },
    {
      id: 'organic-sales',
      label: 'Organic Sales',
      value: '$76,350',
      change: { value: '5.2%', isPositive: true },
      selected: true,
      accentColor: '#14b8a6',
    },
  ]);

  const chartData = [
    { date: 'Jan 1', sales: 45000, adSales: 18000, profit: 12000, organicSales: 27000 },
    { date: 'Jan 5', sales: 52000, adSales: 21000, profit: 15000, organicSales: 31000 },
    { date: 'Jan 10', sales: 48000, adSales: 19500, profit: 13500, organicSales: 28500 },
    { date: 'Jan 15', sales: 61000, adSales: 24000, profit: 18000, organicSales: 37000 },
    { date: 'Jan 20', sales: 58000, adSales: 23000, profit: 17000, organicSales: 35000 },
    { date: 'Jan 25', sales: 71000, adSales: 28000, profit: 21000, organicSales: 43000 },
    { date: 'Jan 30', sales: 124580, adSales: 48230, profit: 32140, organicSales: 76350 },
  ];

  const products: Product[] = [
    {
      id: '1',
      name: 'Wireless Bluetooth Headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
      price: '$89.99',
      dayOfSupply: 45,
      marketShare: '12.4%',
      roi: '234%',
      cost: '$38.50',
      adCpc: '$1.24',
      adCtr: '3.8%',
      sales: '$24,580',
      adRoas: '4.2x',
    },
    {
      id: '2',
      name: 'Premium Leather Wallet',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&h=100&fit=crop',
      price: '$45.99',
      dayOfSupply: 32,
      marketShare: '8.7%',
      roi: '189%',
      cost: '$18.20',
      adCpc: '$0.98',
      adCtr: '4.2%',
      sales: '$18,240',
      adRoas: '5.1x',
    },
    {
      id: '3',
      name: 'Smart Fitness Tracker',
      image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=100&h=100&fit=crop',
      price: '$129.99',
      dayOfSupply: 28,
      marketShare: '15.2%',
      roi: '312%',
      cost: '$52.80',
      adCpc: '$1.85',
      adCtr: '5.1%',
      sales: '$38,920',
      adRoas: '6.8x',
    },
    {
      id: '4',
      name: 'Portable Phone Charger',
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=100&h=100&fit=crop',
      price: '$34.99',
      dayOfSupply: 52,
      marketShare: '6.3%',
      roi: '156%',
      cost: '$14.50',
      adCpc: '$0.72',
      adCtr: '2.9%',
      sales: '$12,480',
      adRoas: '3.5x',
    },
    {
      id: '5',
      name: 'Stainless Steel Water Bottle',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100&h=100&fit=crop',
      price: '$24.99',
      dayOfSupply: 38,
      marketShare: '9.8%',
      roi: '198%',
      cost: '$9.80',
      adCpc: '$0.54',
      adCtr: '3.6%',
      sales: '$15,720',
      adRoas: '4.7x',
    },
    {
      id: '6',
      name: 'Wireless Gaming Mouse',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop',
      price: '$79.99',
      dayOfSupply: 41,
      marketShare: '11.5%',
      roi: '267%',
      cost: '$32.40',
      adCpc: '$1.42',
      adCtr: '4.5%',
      sales: '$21,340',
      adRoas: '5.6x',
    },
  ];

  const toggleMetric = (id: string) => {
    setMetrics(prev =>
      prev.map(m => (m.id === id ? { ...m, selected: !m.selected } : m))
    );
  };

  const removeMetric = (id: string) => {
    setMetrics(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6">
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

            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--input-border)',
              }}
            >
              <CalendarIcon size={16} />
              <span>Last 30 days</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4">
          <div className="relative flex-1 max-w-md">
            <Search 
              size={18} 
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }}
            />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10 text-sm"
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
            style={{
              background: 'var(--brand-blue)',
              color: 'var(--text-primary)',
            }}
          >
            <Plus size={16} />
            Add Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(metric => (
          <MetricCard
            key={metric.id}
            label={metric.label}
            value={metric.value}
            change={metric.change}
            selected={metric.selected}
            accentColor={metric.accentColor}
            onToggle={() => toggleMetric(metric.id)}
            onClose={() => removeMetric(metric.id)}
          />
        ))}
      </div>

      <div 
        className="p-6 rounded-lg"
        style={{ 
          background: 'var(--bg-card)',
          border: '1px solid var(--card-border)'
        }}
      >
        <div className="mb-6">
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

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1e2230',
                border: '1px solid #2d3142',
                borderRadius: '8px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
              }}
              labelStyle={{ color: '#ffffff', marginBottom: '8px' }}
              itemStyle={{ color: '#94a3b8', fontSize: '13px' }}
              formatter={(value: number) => `$${value.toLocaleString()}`}
            />
            {metrics.find(m => m.id === 'sales')?.selected && (
              <Line 
                type="monotone"
                dataKey="sales" 
                stroke="#10b981"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#10b981' }}
                name="Sales"
              />
            )}
            {metrics.find(m => m.id === 'ad-sales')?.selected && (
              <Line 
                type="monotone"
                dataKey="adSales" 
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#3b82f6' }}
                name="Ad Sales"
              />
            )}
            {metrics.find(m => m.id === 'profit')?.selected && (
              <Line 
                type="monotone"
                dataKey="profit" 
                stroke="#34d399"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#34d399' }}
                name="Profit"
              />
            )}
            {metrics.find(m => m.id === 'organic-sales')?.selected && (
              <Line 
                type="monotone"
                dataKey="organicSales" 
                stroke="#14b8a6"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#14b8a6' }}
                name="Organic Sales"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>View as:</span>
            <div 
              className="inline-flex rounded-lg p-1"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <button
                onClick={() => setDisplayMode('cards')}
                className="p-1.5 rounded-md transition-all"
                style={{
                  background: displayMode === 'cards' ? 'var(--brand-blue)' : 'transparent',
                  color: displayMode === 'cards' ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setDisplayMode('table')}
                className="p-1.5 rounded-md transition-all"
                style={{
                  background: displayMode === 'table' ? 'var(--brand-blue)' : 'transparent',
                  color: displayMode === 'table' ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                <TableIcon size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Group by:</span>
            <div 
              className="inline-flex rounded-lg p-1"
              style={{ background: 'var(--bg-secondary)' }}
            >
              {(['brand', 'tag', 'asin', 'sku'] as GroupBy[]).map(option => (
                <button
                  key={option}
                  onClick={() => setGroupBy(option)}
                  className="px-3 py-1.5 text-xs font-medium rounded-md transition-all uppercase"
                  style={{
                    background: groupBy === option ? 'var(--brand-blue)' : 'transparent',
                    color: groupBy === option ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                >
                  {option}
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
          <div className="mb-6">
            <h3 
              className="text-lg font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              Product List
            </h3>
          </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>
                  Product
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>
                  Price
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>
                  Day of Supply
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>
                  Market Share
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>
                  ROI
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>
                  Cost
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>
                  Ad CPC
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>
                  Ad CTR
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>
                  Sales
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>
                  Ad ROAS
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr 
                  key={product.id}
                  className="transition-colors hover:bg-opacity-50"
                  style={{ 
                    borderBottom: '1px solid var(--card-border)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-card-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover"
                        style={{ border: '1px solid var(--card-border)' }}
                      />
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-sm" style={{ color: 'var(--text-primary)' }}>
                    {product.price}
                  </td>
                  <td className="py-3 px-4 text-right text-sm" style={{ color: 'var(--text-primary)' }}>
                    {product.dayOfSupply}
                  </td>
                  <td className="py-3 px-4 text-right text-sm" style={{ color: 'var(--text-primary)' }}>
                    {product.marketShare}
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-medium" style={{ color: 'var(--brand-green)' }}>
                    {product.roi}
                  </td>
                  <td className="py-3 px-4 text-right text-sm" style={{ color: 'var(--text-primary)' }}>
                    {product.cost}
                  </td>
                  <td className="py-3 px-4 text-right text-sm" style={{ color: 'var(--text-primary)' }}>
                    {product.adCpc}
                  </td>
                  <td className="py-3 px-4 text-right text-sm" style={{ color: 'var(--text-primary)' }}>
                    {product.adCtr}
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-medium" style={{ color: 'var(--brand-green)' }}>
                    {product.sales}
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-medium" style={{ color: 'var(--brand-blue)' }}>
                    {product.adRoas}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
}
