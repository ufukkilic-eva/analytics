import React, { useState } from 'react';
import { LayoutGrid, Table as TableIcon, Download, DollarSign, Hash, Settings } from 'lucide-react';
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
type GroupBy = 'brand' | 'tag' | 'parent-asin' | 'asin';

interface MetricState {
  id: string;
  label: string;
  value: string;
  previousValue: string;
  change: { value: string; isPositive: boolean };
  selected: boolean;
  accentColor: string;
}

export function AnalyticsView() {
  const [viewMode, setViewMode] = useState<ViewMode>('product');
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const [tableViewMode, setTableViewMode] = useState<TableViewMode>('table');
  const [groupBy, setGroupBy] = useState<GroupBy>('brand');
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>(['amazon']);
  const [accountType, setAccountType] = useState<AccountType>('seller');

  const [metrics, setMetrics] = useState<MetricState[]>([
    {
      id: 'impressions',
      label: 'Impressions',
      value: '1,245,680',
      previousValue: '1,112,000',
      change: { value: '12.5%', isPositive: true },
      selected: true,
      accentColor: '#10b981',
    },
    {
      id: 'organic-sales',
      label: 'Organic Sales',
      value: '$76,350',
      previousValue: '$72,550',
      change: { value: '5.2%', isPositive: true },
      selected: true,
      accentColor: '#3b82f6',
    },
    {
      id: 'order',
      label: 'Order',
      value: '2,140',
      previousValue: '1,780',
      change: { value: '20.2%', isPositive: true },
      selected: true,
      accentColor: '#ec4899',
    },
    {
      id: 'acos',
      label: 'ACoS',
      value: '18.5%',
      previousValue: '22.3%',
      change: { value: '17.0%', isPositive: false },
      selected: true,
      accentColor: '#14b8a6',
    },
  ]);

  const chartData = [
    { date: 'Jan 1', impressions: 145000, organicSales: 27000, order: 1200, acos: 22.5, volume: 450 },
    { date: 'Jan 5', impressions: 182000, organicSales: 31000, order: 1350, acos: 21.8, volume: 520 },
    { date: 'Jan 10', impressions: 168000, organicSales: 28500, order: 1280, acos: 23.2, volume: 480 },
    { date: 'Jan 15', impressions: 221000, organicSales: 37000, order: 1680, acos: 20.5, volume: 610 },
    { date: 'Jan 20', impressions: 198000, organicSales: 35000, order: 1580, acos: 21.1, volume: 580 },
    { date: 'Jan 25', impressions: 271000, organicSales: 43000, order: 1910, acos: 19.3, volume: 710 },
    { date: 'Jan 30', impressions: 1245680, organicSales: 76350, order: 2140, acos: 18.5, volume: 750 },
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
          <AdvancedFilter />
        </div>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(4, 1fr) 90px' }}>
        {metrics.map(metric => (
          <MetricCard
            key={metric.id}
            label={metric.label}
            value={metric.value}
            previousValue={metric.previousValue}
            change={metric.change}
            selected={metric.selected}
            accentColor={metric.accentColor}
            onToggle={() => toggleMetric(metric.id)}
            onClose={() => removeMetric(metric.id)}
          />
        ))}

        <div
          className="p-3 rounded-lg border-2 border-dashed transition-all hover:border-brand-blue/50 hover:bg-bg-card-hover/30 flex flex-col items-center justify-center gap-2 cursor-pointer group"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--card-border)',
            minHeight: '90px',
          }}
        >
          <Settings
            size={20}
            className="transition-transform group-hover:rotate-90"
            style={{ color: 'var(--text-muted)' }}
          />
          <span
            className="text-xs font-medium text-center"
            style={{ color: 'var(--text-muted)' }}
          >
            Manage Metrics
          </span>
        </div>
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
                    name === 'organicSales' ? 'Organic Sales' :
                      name === 'order' ? 'Order' :
                        name === 'acos' ? 'ACoS' : name;
                const formattedValue = name === 'volume' ? value.toLocaleString() :
                  name === 'impressions' ? value.toLocaleString() :
                    name === 'order' ? value.toLocaleString() :
                      name === 'acos' ? `${value}%` :
                        name === 'organicSales' ? `$${value.toLocaleString()}` : value.toLocaleString();
                return [formattedValue, displayName];
              }}
            />
            <Bar
              yAxisId="left"
              dataKey="volume"
              fill="#8B7355"
              opacity={0.3}
              radius={[4, 4, 0, 0]}
              name="Volume"
            />
            {metrics.find(m => m.id === 'impressions')?.selected && (
              <Line
                yAxisId="right"
                type="linear"
                dataKey="impressions"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#1a1d2e' }}
                activeDot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                name="impressions"
              />
            )}
            {metrics.find(m => m.id === 'organic-sales')?.selected && (
              <Line
                yAxisId="right"
                type="linear"
                dataKey="organicSales"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#1a1d2e' }}
                activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                name="organicSales"
              />
            )}
            {metrics.find(m => m.id === 'order')?.selected && (
              <Line
                yAxisId="right"
                type="linear"
                dataKey="order"
                stroke="#ec4899"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#ec4899', strokeWidth: 2, stroke: '#1a1d2e' }}
                activeDot={{ r: 6, fill: '#ec4899', strokeWidth: 2, stroke: '#fff' }}
                name="order"
              />
            )}
            {metrics.find(m => m.id === 'acos')?.selected && (
              <Line
                yAxisId="left"
                type="linear"
                dataKey="acos"
                stroke="#14b8a6"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#14b8a6', strokeWidth: 2, stroke: '#1a1d2e' }}
                activeDot={{ r: 6, fill: '#14b8a6', strokeWidth: 2, stroke: '#fff' }}
                name="acos"
              />
            )}
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
              {(['brand', 'tag', 'parent-asin', 'asin'] as GroupBy[]).map((option) => (
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
                        option === 'asin' ? 'Asin' : option}
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
            />
          )}
        </div>
      </div>
    </div>
  );
}
