import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Plus, Check, Edit2, Trash2, Tag, Info, ChevronRight, Settings2, Search, Columns, TrendingUp, TrendingDown } from 'lucide-react';
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
  apsScore: number;
  spsScore: number;
  upsScore: number;

  // SHARED / BOTH (20 metrics)
  refundAmount: string;
  quantity: number;
  repeatOrderCustomerCount: number;
  // Advertising (14 metrics)
  adSpend: string;
  adSales: string;
  adAov: string;
  clicks: number;
  adConversions: number;
  adUnits: number;
  adSkuSales: string;
  adSalesAttributedSku: string;
  acos: string;
  tacos: string;
  roas: string;
  cpc: string;
  ctr: string;
  cvr: string;
  // Traffic (2 metrics - pageViews = glanceViews)
  pageViews: number;
  glanceViews: number;

  // Breakdown values for "Both" mode (Seller vs Vendor)
  sellerValues?: {
    sales: string;
    refundAmount: string;
    quantity: number;
    repeatOrderCustomerCount: number;
    adSpend: string;
    adSales: string;
    adAov: string;
    clicks: number;
    adConversions: number;
    adUnits: number;
    adSkuSales: string;
    adSalesAttributedSku: string;
    acos: string;
    tacos: string;
    roas: string;
    cpc: string;
    ctr: string;
    cvr: string;
    pageViews: number;
    price: string;
  };
  vendorValues?: {
    sales: string;
    refundAmount: string;
    quantity: number;
    repeatOrderCustomerCount: number;
    adSpend: string;
    adSales: string;
    adAov: string;
    clicks: number;
    adConversions: number;
    adUnits: number;
    adSkuSales: string;
    adSalesAttributedSku: string;
    acos: string;
    tacos: string;
    roas: string;
    cpc: string;
    ctr: string;
    cvr: string;
    pageViews: number;
    price: string;
  };

  // SELLER ONLY
  profit: string;
  organicSales: string;
  productCost: string;
  fbaFee: string;
  referralFee: string;
  totalFees: string;
  margin: string;
  roi: string;
  aov: string;
  variableClosingFee: string;
  shippingAmount: string;
  fbmShippingCost: string;
  shippingToFbaCost: string;
  cog: string;
  unitLandingCost: string;
  cogs: string;
  totalExpense: string;
  b2bOrderedProductSales: string;
  // Orders
  orderCount: number;
  repeatOrderQuantity: number;
  repeatCustomerRate: string;
  organicUnits: number;
  organicOrders: number;
  newToBrandOrderQuantity: number;
  newToBrandCustomerCount: number;
  b2bTotalOrderItems: number;
  b2bUnitsOrdered: number;
  orderedProductSalesAmount: string;
  totalOrderItems: number;
  // Traffic
  sessions: number;
  impressions: number;
  childSessions: number;
  b2bPageViews: number;
  b2bSessions: number;
  asinImpressionCount: number;
  totalQueryImpressionCount: number;
  // Performance
  buyBoxPercent: string;
  unitSessionPercent: string;
  b2bUnitsPerSession: string;
  salesVelocity: string;
  dayOfSupplyFba: number;
  // Inventory
  availableQuantity: number;
  inboundQuantity: number;
  fcTransfer: number;

  // VENDOR ONLY
  shippedRevenue: string;
  shippedCogs: string;
  openPurchaseOrderUnits: number;
  poOpenCarriedOverCount: number;
  poOpenCarriedOverUnits: number;
  poPeriodCount: number;
  poPeriodOrderedUnits: number;
  poPeriodOpenCount: number;
  poPeriodClosedCount: number;
  poPeriodOpenUnits: number;
  poPeriodClosedUnits: number;
  // Orders
  shippedUnits: number;
  repeatOrders: number;
  repeatPurchaseRevenue: string;
  // Performance
  vendorConfirmationRate: string;
  averageVendorLeadTimeDays: number;
  procurableOutOfStockRate: string;
  // Inventory
  sellableOnHandInventoryUnits: number;
  unsellableOnHandInventoryUnits: number;
  aged90PlusDaysUnits: number;
  sellableOnHandInventoryCost: string;
  unsellableOnHandInventoryCost: string;
  aged90PlusDaysCost: string;
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
    apsScore: 78, spsScore: 65, upsScore: 72,
    // SHARED
    refundAmount: '$145.20', quantity: 97, repeatOrderCustomerCount: 18,
    adSpend: '$1,250.40', adSales: '$3,890.25', adAov: '$142.30', clicks: 3240, adConversions: 158, adUnits: 172,
    adSkuSales: '$3,620.50', adSalesAttributedSku: '$3,890.25', acos: '32.1%', tacos: '10.4%', roas: '3.11',
    cpc: '$0.39', ctr: '2.58%', cvr: '4.88%',
    pageViews: 8450, glanceViews: 8450,
    // BREAKDOWN values for Both mode
    sellerValues: {
      sales: '$7,240.96', refundAmount: '$87.12', quantity: 58, repeatOrderCustomerCount: 11,
      adSpend: '$750.24', adSales: '$2,334.15', adAov: '$142.30', clicks: 1944, adConversions: 95, adUnits: 103,
      adSkuSales: '$2,172.30', adSalesAttributedSku: '$2,334.15', acos: '32.1%', tacos: '10.4%', roas: '3.11',
      cpc: '$0.39', ctr: '2.58%', cvr: '4.88%', pageViews: 5070, price: '$220.00'
    },
    vendorValues: {
      sales: '$4,827.30', refundAmount: '$58.08', quantity: 39, repeatOrderCustomerCount: 7,
      adSpend: '$500.16', adSales: '$1,556.10', adAov: '$142.30', clicks: 1296, adConversions: 63, adUnits: 69,
      adSkuSales: '$1,448.20', adSalesAttributedSku: '$1,556.10', acos: '32.1%', tacos: '10.4%', roas: '3.11',
      cpc: '$0.39', ctr: '2.58%', cvr: '4.88%', pageViews: 3380, price: '$220.00'
    },
    // SELLER
    profit: '$7,407.39', organicSales: '$6,131.00', productCost: '$2,450.00',
    fbaFee: '$1,131.64', referralFee: '$1,690.47', totalFees: '$2,822.11',
    margin: '61.4%', roi: '158.2%', aov: '$124.50',
    variableClosingFee: '$45.20', shippingAmount: '$320.50', fbmShippingCost: '$0.00',
    shippingToFbaCost: '$180.30', cog: '$48.50', unitLandingCost: '$52.80',
    cogs: '$2,450.00', totalExpense: '$4,660.87', b2bOrderedProductSales: '$2,450.00',
    orderCount: 85, repeatOrderQuantity: 24, repeatCustomerRate: '21.2%',
    organicUnits: 68, organicOrders: 58, newToBrandOrderQuantity: 42, newToBrandCustomerCount: 38,
    b2bTotalOrderItems: 12, b2bUnitsOrdered: 15, orderedProductSalesAmount: '$12,068.26', totalOrderItems: 97,
    sessions: 3240, impressions: 125680, childSessions: 2890, b2bPageViews: 420, b2bSessions: 180,
    asinImpressionCount: 125680, totalQueryImpressionCount: 45200,
    buyBoxPercent: '98.2%', unitSessionPercent: '3.0%', b2bUnitsPerSession: '0.08', salesVelocity: '3.24',
    dayOfSupplyFba: 28, availableQuantity: 340, inboundQuantity: 120, fcTransfer: 45,
    // VENDOR
    shippedRevenue: '$11,850.00', shippedCogs: '$4,850.00', openPurchaseOrderUnits: 125,
    poOpenCarriedOverCount: 3, poOpenCarriedOverUnits: 45, poPeriodCount: 8, poPeriodOrderedUnits: 320,
    poPeriodOpenCount: 2, poPeriodClosedCount: 6, poPeriodOpenUnits: 80, poPeriodClosedUnits: 240,
    shippedUnits: 94, repeatOrders: 18, repeatPurchaseRevenue: '$2,340.00',
    vendorConfirmationRate: '97.8%', averageVendorLeadTimeDays: 4, procurableOutOfStockRate: '2.1%',
    sellableOnHandInventoryUnits: 1250, unsellableOnHandInventoryUnits: 45, aged90PlusDaysUnits: 12,
    sellableOnHandInventoryCost: '$25,480.00', unsellableOnHandInventoryCost: '$918.00', aged90PlusDaysCost: '$245.00'
  },
  {
    id: 2,
    name: 'Karaca New Flava 24 Piece Porcelain Dinnerware Set for 6 People',
    asin: 'B0CHC1VXH',
    parentAsin: 'B0D6YC5XTF',
    brand: 'KARACA',
    sales: '$11,953.96',
    status: 'Available',
    image: 'https://m.media-amazon.com/images/I/71pX+J2GjoL._AC_UL320_.jpg',
    tags: ['Discounted', 'New Arrival'],
    price: '$137.19',
    apsScore: 82, spsScore: 71, upsScore: 77,
    // SHARED
    refundAmount: '$298.45', quantity: 106, repeatOrderCustomerCount: 22,
    adSpend: '$980.60', adSales: '$3,450.80', adAov: '$128.90', clicks: 2890, adConversions: 142, adUnits: 156,
    adSkuSales: '$3,210.40', adSalesAttributedSku: '$3,450.80', acos: '28.4%', tacos: '8.2%', roas: '3.52',
    cpc: '$0.34', ctr: '2.57%', cvr: '4.91%',
    pageViews: 9680, glanceViews: 9680,
    // BREAKDOWN values for Both mode
    sellerValues: {
      sales: '$7,172.38', refundAmount: '$179.07', quantity: 64, repeatOrderCustomerCount: 13,
      adSpend: '$588.36', adSales: '$2,070.48', adAov: '$128.90', clicks: 1734, adConversions: 85, adUnits: 94,
      adSkuSales: '$1,926.24', adSalesAttributedSku: '$2,070.48', acos: '28.4%', tacos: '8.2%', roas: '3.52',
      cpc: '$0.34', ctr: '2.57%', cvr: '4.91%', pageViews: 5808, price: '$137.19'
    },
    vendorValues: {
      sales: '$4,781.58', refundAmount: '$119.38', quantity: 42, repeatOrderCustomerCount: 9,
      adSpend: '$392.24', adSales: '$1,380.32', adAov: '$128.90', clicks: 1156, adConversions: 57, adUnits: 62,
      adSkuSales: '$1,284.16', adSalesAttributedSku: '$1,380.32', acos: '28.4%', tacos: '8.2%', roas: '3.52',
      cpc: '$0.34', ctr: '2.57%', cvr: '4.91%', pageViews: 3872, price: '$137.19'
    },
    // SELLER
    profit: '$7,482.15', organicSales: '$4,610.29', productCost: '$1,850.00',
    fbaFee: '$1,319.73', referralFee: '$1,402.32', totalFees: '$2,722.05',
    margin: '62.6%', roi: '167.4%', aov: '$112.80',
    variableClosingFee: '$38.50', shippingAmount: '$280.40', fbmShippingCost: '$0.00',
    shippingToFbaCost: '$145.20', cog: '$38.50', unitLandingCost: '$41.20',
    cogs: '$1,850.00', totalExpense: '$4,471.81', b2bOrderedProductSales: '$1,890.00',
    orderCount: 92, repeatOrderQuantity: 28, repeatCustomerRate: '23.9%',
    organicUnits: 72, organicOrders: 62, newToBrandOrderQuantity: 48, newToBrandCustomerCount: 44,
    b2bTotalOrderItems: 14, b2bUnitsOrdered: 18, orderedProductSalesAmount: '$11,953.96', totalOrderItems: 106,
    sessions: 3890, impressions: 112450, childSessions: 3240, b2bPageViews: 380, b2bSessions: 165,
    asinImpressionCount: 112450, totalQueryImpressionCount: 38400,
    buyBoxPercent: '97.5%', unitSessionPercent: '2.7%', b2bUnitsPerSession: '0.11', salesVelocity: '2.88',
    dayOfSupplyFba: 32, availableQuantity: 285, inboundQuantity: 95, fcTransfer: 38,
    // VENDOR
    shippedRevenue: '$11,650.00', shippedCogs: '$4,620.00', openPurchaseOrderUnits: 98,
    poOpenCarriedOverCount: 2, poOpenCarriedOverUnits: 32, poPeriodCount: 7, poPeriodOrderedUnits: 280,
    poPeriodOpenCount: 3, poPeriodClosedCount: 4, poPeriodOpenUnits: 98, poPeriodClosedUnits: 182,
    shippedUnits: 102, repeatOrders: 22, repeatPurchaseRevenue: '$2,580.00',
    vendorConfirmationRate: '96.9%', averageVendorLeadTimeDays: 5, procurableOutOfStockRate: '3.1%',
    sellableOnHandInventoryUnits: 980, unsellableOnHandInventoryUnits: 38, aged90PlusDaysUnits: 8,
    sellableOnHandInventoryCost: '$19,840.00', unsellableOnHandInventoryCost: '$769.00', aged90PlusDaysCost: '$162.00'
  },
  {
    id: 3,
    name: 'KARACA Hatır Turkish Coffee Maker',
    asin: 'B0FPD8BHK3',
    parentAsin: 'B0FTT3WRT8',
    brand: 'KARACA',
    sales: '$9,918.76',
    status: 'Available',
    image: 'https://m.media-amazon.com/images/I/71F7J0JzTjL._AC_UL320_.jpg',
    tags: ['Best Seller', 'Organic'],
    price: '$79.98',
    apsScore: 91, spsScore: 84, upsScore: 88,
    // SHARED
    refundAmount: '$89.60', quantity: 124, repeatOrderCustomerCount: 35,
    adSpend: '$650.40', adSales: '$2,890.50', adAov: '$82.40', clicks: 3840, adConversions: 198, adUnits: 212,
    adSkuSales: '$2,720.30', adSalesAttributedSku: '$2,890.50', acos: '22.5%', tacos: '6.6%', roas: '4.44',
    cpc: '$0.17', ctr: '2.63%', cvr: '5.16%',
    pageViews: 12840, glanceViews: 12840,
    // BREAKDOWN values for Both mode
    sellerValues: {
      sales: '$5,951.26', refundAmount: '$53.76', quantity: 74, repeatOrderCustomerCount: 21,
      adSpend: '$390.24', adSales: '$1,734.30', adAov: '$82.40', clicks: 2304, adConversions: 119, adUnits: 127,
      adSkuSales: '$1,632.18', adSalesAttributedSku: '$1,734.30', acos: '22.5%', tacos: '6.6%', roas: '4.44',
      cpc: '$0.17', ctr: '2.63%', cvr: '5.16%', pageViews: 7704, price: '$79.98'
    },
    vendorValues: {
      sales: '$3,967.50', refundAmount: '$35.84', quantity: 50, repeatOrderCustomerCount: 14,
      adSpend: '$260.16', adSales: '$1,156.20', adAov: '$82.40', clicks: 1536, adConversions: 79, adUnits: 85,
      adSkuSales: '$1,088.12', adSalesAttributedSku: '$1,156.20', acos: '22.5%', tacos: '6.6%', roas: '4.44',
      cpc: '$0.17', ctr: '2.63%', cvr: '5.16%', pageViews: 5136, price: '$79.98'
    },
    // SELLER
    profit: '$6,499.66', organicSales: '$5,199.39', productCost: '$1,600.00',
    fbaFee: '$1,465.16', referralFee: '$1,344.00', totalFees: '$2,809.16',
    margin: '65.5%', roi: '189.7%', aov: '$78.50',
    variableClosingFee: '$28.40', shippingAmount: '$210.80', fbmShippingCost: '$0.00',
    shippingToFbaCost: '$98.50', cog: '$32.00', unitLandingCost: '$34.80',
    cogs: '$1,600.00', totalExpense: '$3,419.10', b2bOrderedProductSales: '$890.00',
    orderCount: 108, repeatOrderQuantity: 42, repeatCustomerRate: '32.4%',
    organicUnits: 88, organicOrders: 76, newToBrandOrderQuantity: 52, newToBrandCustomerCount: 46,
    b2bTotalOrderItems: 8, b2bUnitsOrdered: 11, orderedProductSalesAmount: '$9,918.76', totalOrderItems: 124,
    sessions: 5120, impressions: 145820, childSessions: 4450, b2bPageViews: 180, b2bSessions: 75,
    asinImpressionCount: 145820, totalQueryImpressionCount: 52100,
    buyBoxPercent: '99.1%', unitSessionPercent: '2.4%', b2bUnitsPerSession: '0.15', salesVelocity: '4.12',
    dayOfSupplyFba: 22, availableQuantity: 420, inboundQuantity: 180, fcTransfer: 62,
    // VENDOR
    shippedRevenue: '$9,820.00', shippedCogs: '$3,280.00', openPurchaseOrderUnits: 145,
    poOpenCarriedOverCount: 4, poOpenCarriedOverUnits: 52, poPeriodCount: 10, poPeriodOrderedUnits: 420,
    poPeriodOpenCount: 3, poPeriodClosedCount: 7, poPeriodOpenUnits: 145, poPeriodClosedUnits: 275,
    shippedUnits: 122, repeatOrders: 35, repeatPurchaseRevenue: '$3,120.00',
    vendorConfirmationRate: '98.5%', averageVendorLeadTimeDays: 3, procurableOutOfStockRate: '1.5%',
    sellableOnHandInventoryUnits: 1580, unsellableOnHandInventoryUnits: 32, aged90PlusDaysUnits: 5,
    sellableOnHandInventoryCost: '$31,680.00', unsellableOnHandInventoryCost: '$642.00', aged90PlusDaysCost: '$100.00'
  },
  {
    id: 4,
    name: 'Karaca Premium Turkish Tea Glass Set with Saucers',
    asin: 'B09X1RA4K2',
    parentAsin: 'B09X1RA4K3',
    brand: 'KARACA',
    sales: '$5,890.00',
    status: 'Available',
    image: 'https://m.media-amazon.com/images/I/61m6+h+uK0L._AC_UL320_.jpg',
    tags: [],
    price: '$34.99',
    apsScore: 68, spsScore: 59, upsScore: 64,
    // SHARED
    refundAmount: '$245.80', quantity: 168, repeatOrderCustomerCount: 15,
    adSpend: '$420.80', adSales: '$1,240.60', adAov: '$38.20', clicks: 1520, adConversions: 68, adUnits: 75,
    adSkuSales: '$1,180.40', adSalesAttributedSku: '$1,240.60', acos: '33.9%', tacos: '7.1%', roas: '2.95',
    cpc: '$0.28', ctr: '2.22%', cvr: '4.47%',
    pageViews: 5240, glanceViews: 5240,
    // BREAKDOWN values for Both mode
    sellerValues: {
      sales: '$3,534.00', refundAmount: '$147.48', quantity: 101, repeatOrderCustomerCount: 9,
      adSpend: '$252.48', adSales: '$744.36', adAov: '$38.20', clicks: 912, adConversions: 41, adUnits: 45,
      adSkuSales: '$708.24', adSalesAttributedSku: '$744.36', acos: '33.9%', tacos: '7.1%', roas: '2.95',
      cpc: '$0.28', ctr: '2.22%', cvr: '4.47%', pageViews: 3144, price: '$34.99'
    },
    vendorValues: {
      sales: '$2,356.00', refundAmount: '$98.32', quantity: 67, repeatOrderCustomerCount: 6,
      adSpend: '$168.32', adSales: '$496.24', adAov: '$38.20', clicks: 608, adConversions: 27, adUnits: 30,
      adSkuSales: '$472.16', adSalesAttributedSku: '$496.24', acos: '33.9%', tacos: '7.1%', roas: '2.95',
      cpc: '$0.28', ctr: '2.22%', cvr: '4.47%', pageViews: 2096, price: '$34.99'
    },
    // SELLER
    profit: '$3,245.50', organicSales: '$2,890.00', productCost: '$1,120.00',
    fbaFee: '$845.20', referralFee: '$799.30', totalFees: '$1,644.50',
    margin: '55.1%', roi: '122.8%', aov: '$35.40',
    variableClosingFee: '$18.50', shippingAmount: '$145.60', fbmShippingCost: '$0.00',
    shippingToFbaCost: '$72.40', cog: '$22.40', unitLandingCost: '$24.20',
    cogs: '$1,120.00', totalExpense: '$2,644.50', b2bOrderedProductSales: '$450.00',
    orderCount: 142, repeatOrderQuantity: 18, repeatCustomerRate: '10.6%',
    organicUnits: 112, organicOrders: 95, newToBrandOrderQuantity: 78, newToBrandCustomerCount: 72,
    b2bTotalOrderItems: 5, b2bUnitsOrdered: 7, orderedProductSalesAmount: '$5,890.00', totalOrderItems: 168,
    sessions: 2180, impressions: 68400, childSessions: 1920, b2bPageViews: 85, b2bSessions: 38,
    asinImpressionCount: 68400, totalQueryImpressionCount: 22400,
    buyBoxPercent: '96.8%', unitSessionPercent: '7.7%', b2bUnitsPerSession: '0.18', salesVelocity: '1.82',
    dayOfSupplyFba: 45, availableQuantity: 580, inboundQuantity: 0, fcTransfer: 0,
    // VENDOR
    shippedRevenue: '$5,720.00', shippedCogs: '$2,380.00', openPurchaseOrderUnits: 78,
    poOpenCarriedOverCount: 2, poOpenCarriedOverUnits: 28, poPeriodCount: 6, poPeriodOrderedUnits: 195,
    poPeriodOpenCount: 2, poPeriodClosedCount: 4, poPeriodOpenUnits: 78, poPeriodClosedUnits: 117,
    shippedUnits: 162, repeatOrders: 15, repeatPurchaseRevenue: '$540.00',
    vendorConfirmationRate: '96.3%', averageVendorLeadTimeDays: 6, procurableOutOfStockRate: '3.7%',
    sellableOnHandInventoryUnits: 680, unsellableOnHandInventoryUnits: 28, aged90PlusDaysUnits: 15,
    sellableOnHandInventoryCost: '$13,760.00', unsellableOnHandInventoryCost: '$568.00', aged90PlusDaysCost: '$304.00'
  },
  {
    id: 5,
    name: 'Karaca Bioceramic Non-Stick Frying Pan Set',
    asin: 'B012Y4RB5X',
    parentAsin: 'B012Y4RB5Y',
    brand: 'KARACA',
    sales: '$8,450.20',
    status: 'Available',
    image: 'https://m.media-amazon.com/images/I/71+7Q0+g6+L._AC_UL320_.jpg',
    tags: ['Best Seller'],
    price: '$129.99',
    apsScore: 85, spsScore: 78, upsScore: 82,
    // SHARED
    refundAmount: '$178.40', quantity: 71, repeatOrderCustomerCount: 18,
    adSpend: '$820.60', adSales: '$2,680.40', adAov: '$132.80', clicks: 2680, adConversions: 128, adUnits: 142,
    adSkuSales: '$2,540.20', adSalesAttributedSku: '$2,680.40', acos: '30.6%', tacos: '9.7%', roas: '3.27',
    cpc: '$0.31', ctr: '2.72%', cvr: '4.78%',
    pageViews: 7280, glanceViews: 7280,
    // BREAKDOWN values for Both mode
    sellerValues: {
      sales: '$5,070.12', refundAmount: '$107.04', quantity: 43, repeatOrderCustomerCount: 11,
      adSpend: '$492.36', adSales: '$1,608.24', adAov: '$132.80', clicks: 1608, adConversions: 77, adUnits: 85,
      adSkuSales: '$1,524.12', adSalesAttributedSku: '$1,608.24', acos: '30.6%', tacos: '9.7%', roas: '3.27',
      cpc: '$0.31', ctr: '2.72%', cvr: '4.78%', pageViews: 4368, price: '$129.99'
    },
    vendorValues: {
      sales: '$3,380.08', refundAmount: '$71.36', quantity: 28, repeatOrderCustomerCount: 7,
      adSpend: '$328.24', adSales: '$1,072.16', adAov: '$132.80', clicks: 1072, adConversions: 51, adUnits: 57,
      adSkuSales: '$1,016.08', adSalesAttributedSku: '$1,072.16', acos: '30.6%', tacos: '9.7%', roas: '3.27',
      cpc: '$0.31', ctr: '2.72%', cvr: '4.78%', pageViews: 2912, price: '$129.99'
    },
    // SELLER
    profit: '$5,120.80', organicSales: '$4,225.10', productCost: '$1,680.00',
    fbaFee: '$1,125.40', referralFee: '$1,204.00', totalFees: '$2,329.40',
    margin: '60.6%', roi: '153.7%', aov: '$118.50',
    variableClosingFee: '$32.80', shippingAmount: '$245.60', fbmShippingCost: '$0.00',
    shippingToFbaCost: '$118.40', cog: '$42.00', unitLandingCost: '$45.20',
    cogs: '$1,680.00', totalExpense: '$3,329.40', b2bOrderedProductSales: '$1,560.00',
    orderCount: 62, repeatOrderQuantity: 22, repeatCustomerRate: '29.0%',
    organicUnits: 48, organicOrders: 42, newToBrandOrderQuantity: 32, newToBrandCustomerCount: 28,
    b2bTotalOrderItems: 9, b2bUnitsOrdered: 12, orderedProductSalesAmount: '$8,450.20', totalOrderItems: 71,
    sessions: 2940, impressions: 98450, childSessions: 2580, b2bPageViews: 245, b2bSessions: 105,
    asinImpressionCount: 98450, totalQueryImpressionCount: 31800,
    buyBoxPercent: '98.5%', unitSessionPercent: '2.4%', b2bUnitsPerSession: '0.11', salesVelocity: '2.54',
    dayOfSupplyFba: 35, availableQuantity: 245, inboundQuantity: 85, fcTransfer: 32,
    // VENDOR
    shippedRevenue: '$8,320.00', shippedCogs: '$3,180.00', openPurchaseOrderUnits: 112,
    poOpenCarriedOverCount: 3, poOpenCarriedOverUnits: 42, poPeriodCount: 8, poPeriodOrderedUnits: 315,
    poPeriodOpenCount: 2, poPeriodClosedCount: 6, poPeriodOpenUnits: 112, poPeriodClosedUnits: 203,
    shippedUnits: 68, repeatOrders: 18, repeatPurchaseRevenue: '$2,140.00',
    vendorConfirmationRate: '97.2%', averageVendorLeadTimeDays: 4, procurableOutOfStockRate: '2.8%',
    sellableOnHandInventoryUnits: 1120, unsellableOnHandInventoryUnits: 45, aged90PlusDaysUnits: 10,
    sellableOnHandInventoryCost: '$22,480.00', unsellableOnHandInventoryCost: '$904.00', aged90PlusDaysCost: '$201.00'
  },
];

interface PopoverState {
  type: 'add' | 'edit';
  target: number | string;
  x: number;
  y: number;
}

type ModeType = 'seller' | 'vendor' | 'both';

type ColumnCategory = 'Revenue' | 'Advertising' | 'Orders' | 'Traffic' | 'Performance' | 'Other';

interface ColumnDef {
  id: string;
  label: string;
  category: ColumnCategory;
  align: 'left' | 'center' | 'right';
  defaultVisible?: boolean;
  sticky?: boolean;
  width?: string;
  availableIn: ModeType[];
}

// Column Definitions - availableIn defines which mode(s) the column appears in
const COLUMN_DEFINITIONS: ColumnDef[] = [
  // Product (always visible)
  { id: 'product', label: 'Product', category: 'Other', align: 'left', defaultVisible: true, sticky: true, width: '340px', availableIn: ['seller', 'vendor', 'both'] },
  { id: 'productScore', label: 'Product Score', category: 'Other', align: 'center', defaultVisible: true, availableIn: ['seller'] },

  // SHARED METRICS - shown in ALL modes (seller, vendor, both)
  // These are the common metrics that exist in both Seller and Vendor data
  { id: 'sales', label: 'Sales', category: 'Revenue', align: 'right', defaultVisible: true, availableIn: ['seller', 'vendor', 'both'] },
  { id: 'refundAmount', label: 'Refund Amount', category: 'Revenue', align: 'right', availableIn: ['seller', 'vendor', 'both'] },
  { id: 'quantity', label: 'Quantity', category: 'Orders', align: 'right', defaultVisible: true, availableIn: ['seller', 'vendor', 'both'] },
  { id: 'repeatOrderCustomerCount', label: 'Repeat Order Customer Count', category: 'Orders', align: 'right', availableIn: ['seller', 'vendor', 'both'] },
  // Advertising (14 metrics) - Shared
  { id: 'adSpend', label: 'Ad Spend', category: 'Advertising', align: 'right', defaultVisible: true, availableIn: ['seller', 'vendor', 'both'] },
  { id: 'adSales', label: 'Ad Sales', category: 'Advertising', align: 'right', defaultVisible: true, availableIn: ['seller', 'vendor', 'both'] },
  { id: 'adAov', label: 'Ad AOV', category: 'Advertising', align: 'right', availableIn: ['seller', 'vendor', 'both'] },
  { id: 'clicks', label: 'Clicks', category: 'Advertising', align: 'right', availableIn: ['seller', 'vendor', 'both'] },
  { id: 'adConversions', label: 'Ad Conversions', category: 'Advertising', align: 'right', availableIn: ['seller', 'vendor', 'both'] },
  { id: 'adUnits', label: 'Ad Units', category: 'Advertising', align: 'right', availableIn: ['seller', 'vendor', 'both'] },
  { id: 'adSkuSales', label: 'Ad SKU Sales', category: 'Advertising', align: 'right', availableIn: ['seller', 'vendor', 'both'] },
  { id: 'adSalesAttributedSku', label: 'Ad Sales Attributed SKU', category: 'Advertising', align: 'right', availableIn: ['seller', 'vendor', 'both'] },
  { id: 'acos', label: 'ACoS', category: 'Advertising', align: 'right', availableIn: ['seller', 'vendor', 'both'] },
  { id: 'tacos', label: 'TACoS', category: 'Advertising', align: 'right', availableIn: ['seller', 'vendor', 'both'] },
  { id: 'roas', label: 'ROAS', category: 'Advertising', align: 'right', availableIn: ['seller', 'vendor', 'both'] },
  { id: 'cpc', label: 'CPC', category: 'Advertising', align: 'right', availableIn: ['seller', 'vendor', 'both'] },
  { id: 'ctr', label: 'CTR', category: 'Advertising', align: 'right', availableIn: ['seller', 'vendor', 'both'] },
  { id: 'cvr', label: 'CVR', category: 'Advertising', align: 'right', availableIn: ['seller', 'vendor', 'both'] },
  // Traffic (1 metric - Shared: Seller=pageViews, Vendor=glanceViews)
  { id: 'pageViews', label: 'Page Views', category: 'Traffic', align: 'right', defaultVisible: true, availableIn: ['seller', 'vendor', 'both'] },
  // Price - Shared (both seller and vendor have prices)
  { id: 'price', label: 'Price', category: 'Other', align: 'right', defaultVisible: true, availableIn: ['seller', 'vendor', 'both'] },

  // SELLER ONLY - shown when Seller selected (NOT shown in 'both' mode)
  { id: 'profit', label: 'Profit', category: 'Revenue', align: 'right', defaultVisible: true, availableIn: ['seller'] },
  { id: 'organicSales', label: 'Organic Sales', category: 'Revenue', align: 'right', defaultVisible: true, availableIn: ['seller'] },
  { id: 'fbaFee', label: 'FBA Fee', category: 'Revenue', align: 'right', defaultVisible: true, availableIn: ['seller'] },
  { id: 'referralFee', label: 'Referral Fee', category: 'Revenue', align: 'right', defaultVisible: true, availableIn: ['seller'] },
  { id: 'totalFees', label: 'Total Fees', category: 'Revenue', align: 'right', defaultVisible: true, availableIn: ['seller'] },
  { id: 'margin', label: 'Margin', category: 'Revenue', align: 'right', availableIn: ['seller'] },
  { id: 'roi', label: 'ROI', category: 'Revenue', align: 'right', availableIn: ['seller'] },
  { id: 'aov', label: 'AOV', category: 'Revenue', align: 'right', availableIn: ['seller'] },
  { id: 'variableClosingFee', label: 'Variable Closing Fee', category: 'Revenue', align: 'right', availableIn: ['seller'] },
  { id: 'shippingAmount', label: 'Shipping Amount', category: 'Revenue', align: 'right', availableIn: ['seller'] },
  { id: 'fbmShippingCost', label: 'FBM Shipping Cost', category: 'Revenue', align: 'right', availableIn: ['seller'] },
  { id: 'shippingToFbaCost', label: 'Shipping to FBA Cost', category: 'Revenue', align: 'right', availableIn: ['seller'] },
  { id: 'cog', label: 'COG', category: 'Revenue', align: 'right', availableIn: ['seller'] },
  { id: 'unitLandingCost', label: 'Unit Landing Cost', category: 'Revenue', align: 'right', availableIn: ['seller'] },
  { id: 'cogs', label: 'COGS', category: 'Revenue', align: 'right', availableIn: ['seller'] },
  { id: 'totalExpense', label: 'Total Expense', category: 'Revenue', align: 'right', availableIn: ['seller'] },
  { id: 'b2bOrderedProductSales', label: 'B2B Ordered Product Sales', category: 'Revenue', align: 'right', availableIn: ['seller'] },
  // Orders Seller
  { id: 'orderCount', label: 'Order Count', category: 'Orders', align: 'right', availableIn: ['seller'] },
  { id: 'repeatOrderQuantity', label: 'Repeat Order Quantity', category: 'Orders', align: 'right', availableIn: ['seller'] },
  { id: 'repeatCustomerRate', label: 'Repeat Customer Rate', category: 'Orders', align: 'right', availableIn: ['seller'] },
  { id: 'organicUnits', label: 'Organic Units', category: 'Orders', align: 'right', availableIn: ['seller'] },
  { id: 'organicOrders', label: 'Organic Orders', category: 'Orders', align: 'right', availableIn: ['seller'] },
  { id: 'newToBrandOrderQuantity', label: 'New to Brand Order Quantity', category: 'Orders', align: 'right', availableIn: ['seller'] },
  { id: 'newToBrandCustomerCount', label: 'New to Brand Customer Count', category: 'Orders', align: 'right', availableIn: ['seller'] },
  { id: 'b2bTotalOrderItems', label: 'B2B Total Order Items', category: 'Orders', align: 'right', availableIn: ['seller'] },
  { id: 'b2bUnitsOrdered', label: 'B2B Units Ordered', category: 'Orders', align: 'right', availableIn: ['seller'] },
  { id: 'orderedProductSalesAmount', label: 'Ordered Product Sales Amount', category: 'Orders', align: 'right', availableIn: ['seller'] },
  { id: 'totalOrderItems', label: 'Total Order Items', category: 'Orders', align: 'right', availableIn: ['seller'] },
  // Traffic Seller
  { id: 'sessions', label: 'Sessions', category: 'Traffic', align: 'right', defaultVisible: true, availableIn: ['seller'] },
  { id: 'impressions', label: 'Impressions', category: 'Advertising', align: 'right', availableIn: ['seller'] },
  { id: 'childSessions', label: 'Child Sessions', category: 'Traffic', align: 'right', availableIn: ['seller'] },
  { id: 'b2bPageViews', label: 'B2B Page Views', category: 'Traffic', align: 'right', availableIn: ['seller'] },
  { id: 'b2bSessions', label: 'B2B Sessions', category: 'Traffic', align: 'right', availableIn: ['seller'] },
  { id: 'asinImpressionCount', label: 'ASIN Impression Count', category: 'Traffic', align: 'right', availableIn: ['seller'] },
  { id: 'totalQueryImpressionCount', label: 'Total Query Impression Count', category: 'Traffic', align: 'right', availableIn: ['seller'] },
  // Performance Seller
  { id: 'buyBoxPercent', label: 'Buy Box %', category: 'Performance', align: 'right', availableIn: ['seller'] },
  { id: 'unitSessionPercent', label: 'Unit Session %', category: 'Performance', align: 'right', availableIn: ['seller'] },
  { id: 'b2bUnitsPerSession', label: 'B2B Units Per Session', category: 'Performance', align: 'right', availableIn: ['seller'] },
  { id: 'salesVelocity', label: 'Sales Velocity', category: 'Performance', align: 'right', availableIn: ['seller'] },
  { id: 'dayOfSupplyFba', label: 'Day of Supply (FBA)', category: 'Performance', align: 'right', availableIn: ['seller'] },
  // Inventory Seller
  { id: 'availableQuantity', label: 'Available Quantity', category: 'Other', align: 'right', availableIn: ['seller'] },
  { id: 'inboundQuantity', label: 'Inbound Quantity', category: 'Other', align: 'right', availableIn: ['seller'] },
  { id: 'fcTransfer', label: 'FC Transfer', category: 'Other', align: 'right', availableIn: ['seller'] },

  // VENDOR ONLY - shown when Vendor selected (NOT shown in 'both' mode)
  { id: 'shippedRevenue', label: 'Shipped Revenue', category: 'Revenue', align: 'right', defaultVisible: true, availableIn: ['vendor'] },
  { id: 'shippedCogs', label: 'Shipped COGS', category: 'Revenue', align: 'right', availableIn: ['vendor'] },
  { id: 'openPurchaseOrderUnits', label: 'Open Purchase Order Units', category: 'Revenue', align: 'right', availableIn: ['vendor'] },
  { id: 'poOpenCarriedOverCount', label: 'PO Open Carried Over Count', category: 'Revenue', align: 'right', availableIn: ['vendor'] },
  { id: 'poOpenCarriedOverUnits', label: 'PO Open Carried Over Units', category: 'Revenue', align: 'right', availableIn: ['vendor'] },
  { id: 'poPeriodCount', label: 'PO Period Count', category: 'Revenue', align: 'right', availableIn: ['vendor'] },
  { id: 'poPeriodOrderedUnits', label: 'PO Period Ordered Units', category: 'Revenue', align: 'right', availableIn: ['vendor'] },
  { id: 'poPeriodOpenCount', label: 'PO Period Open Count', category: 'Revenue', align: 'right', availableIn: ['vendor'] },
  { id: 'poPeriodClosedCount', label: 'PO Period Closed Count', category: 'Revenue', align: 'right', availableIn: ['vendor'] },
  { id: 'poPeriodOpenUnits', label: 'PO Period Open Units', category: 'Revenue', align: 'right', availableIn: ['vendor'] },
  { id: 'poPeriodClosedUnits', label: 'PO Period Closed Units', category: 'Revenue', align: 'right', availableIn: ['vendor'] },
  // Orders Vendor
  { id: 'orderCount', label: 'Order Count', category: 'Orders', align: 'right', availableIn: ['vendor'] },
  { id: 'repeatOrderQuantity', label: 'Repeat Order Quantity', category: 'Orders', align: 'right', availableIn: ['vendor'] },
  { id: 'repeatCustomerRate', label: 'Repeat Customer Rate', category: 'Orders', align: 'right', availableIn: ['vendor'] },
  { id: 'shippedUnits', label: 'Shipped Units', category: 'Orders', align: 'right', defaultVisible: true, availableIn: ['vendor'] },
  { id: 'repeatOrders', label: 'Repeat Orders', category: 'Orders', align: 'right', availableIn: ['vendor'] },
  { id: 'repeatPurchaseRevenue', label: 'Repeat Purchase Revenue', category: 'Orders', align: 'right', availableIn: ['vendor'] },
  // Traffic Vendor
  { id: 'sessions', label: 'Sessions', category: 'Traffic', align: 'right', defaultVisible: true, availableIn: ['vendor'] },
  { id: 'impressions', label: 'Impressions', category: 'Advertising', align: 'right', availableIn: ['vendor'] },
  // Performance Vendor
  { id: 'vendorConfirmationRate', label: 'Vendor Confirmation Rate', category: 'Performance', align: 'right', availableIn: ['vendor'] },
  { id: 'averageVendorLeadTimeDays', label: 'Avg Vendor Lead Time (Days)', category: 'Performance', align: 'right', availableIn: ['vendor'] },
  { id: 'procurableOutOfStockRate', label: 'Procurable Out of Stock Rate', category: 'Performance', align: 'right', availableIn: ['vendor'] },
  // Inventory Vendor
  { id: 'sellableOnHandInventoryUnits', label: 'Sellable On Hand Inventory', category: 'Other', align: 'right', availableIn: ['vendor'] },
  { id: 'unsellableOnHandInventoryUnits', label: 'Unsellable On Hand Inventory', category: 'Other', align: 'right', availableIn: ['vendor'] },
  { id: 'aged90PlusDaysUnits', label: 'Aged 90+ Days Units', category: 'Other', align: 'right', availableIn: ['vendor'] },
  { id: 'sellableOnHandInventoryCost', label: 'Sellable On Hand Inventory Cost', category: 'Other', align: 'right', availableIn: ['vendor'] },
  { id: 'unsellableOnHandInventoryCost', label: 'Unsellable On Hand Inventory Cost', category: 'Other', align: 'right', availableIn: ['vendor'] },
  { id: 'aged90PlusDaysCost', label: 'Aged 90+ Days Cost', category: 'Other', align: 'right', availableIn: ['vendor'] },
];

interface ProductTableProps {
  selectedStore?: StoreType;
  mode?: ModeType;
}

export function ProductTable({
  selectedStore = 'both',
  mode = 'seller'
}: ProductTableProps) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [tagDatabase, setTagDatabase] = useState(INITIAL_TAGS);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<number>>(new Set());
  const [activePopover, setActivePopover] = useState<PopoverState | null>(null);
  const [popoverSearch, setPopoverSearch] = useState('');
  const [tagToEdit, setTagToEdit] = useState<{ name: string; color: string } | null>(null);
  const [expandedProductIds, setExpandedProductIds] = useState<Set<number>>(new Set());
  const [tagToDelete, setTagToDelete] = useState<string | null>(null);

  // Column Options State
  const [columnPanelOpen, setColumnPanelOpen] = useState(false);
  const [selectedColumnIds, setSelectedColumnIds] = useState<Set<string>>(new Set());
  const [columnSearch, setColumnSearch] = useState('');
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const popoverRef = useRef<HTMLDivElement>(null);
  const columnPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tagToDelete) return;

      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (target.closest('[data-popover-trigger]')) return;
        setActivePopover(null);
        setPopoverSearch('');
      }

      if (columnPanelRef.current && !columnPanelRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (target.closest('[data-column-trigger]')) return;
        setColumnPanelOpen(false);
        setColumnSearch('');
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [tagToDelete]);

  // Reset to all available columns whenever mode changes
  useEffect(() => {
    const availableCols = COLUMN_DEFINITIONS.filter(col => col.availableIn.includes(mode));
    setSelectedColumnIds(new Set(availableCols.map(col => col.id)));
    setActivePreset('All Columns');
  }, [mode]);

  // Column presets configuration
  const COLUMN_PRESETS = useMemo(() => {
    const availableCols = COLUMN_DEFINITIONS.filter(col => col.availableIn.includes(mode));
    return {
      'All Columns': availableCols.map(col => col.id),
      'Revenue': availableCols.filter(col => col.category === 'Revenue').map(col => col.id),
      'Advertising': availableCols.filter(col => col.category === 'Advertising').map(col => col.id),
      'Orders': availableCols.filter(col => col.category === 'Orders').map(col => col.id),
      'Traffic': availableCols.filter(col => col.category === 'Traffic').map(col => col.id),
      'Performance': availableCols.filter(col => col.category === 'Performance').map(col => col.id),
    };
  }, [mode]);

  // Get available columns for current mode
  const availableColumns = useMemo(() => {
    return COLUMN_DEFINITIONS.filter(col => col.availableIn.includes(mode));
  }, [mode]);

  // Get visible columns based on selection
  const visibleColumns = useMemo(() => {
    return availableColumns.filter(col => selectedColumnIds.has(col.id));
  }, [availableColumns, selectedColumnIds]);

  // Group columns by category
  const groupedColumns = useMemo(() => {
    const groups: Record<string, typeof availableColumns> = {};
    availableColumns.forEach(col => {
      if (!groups[col.category]) groups[col.category] = [];
      groups[col.category].push(col);
    });
    return groups;
  }, [availableColumns]);

  // Filter columns by search
  const filteredColumns = useMemo(() => {
    if (!columnSearch.trim()) return groupedColumns;
    const filtered: Record<string, typeof availableColumns> = {};
    Object.entries(groupedColumns).forEach(([category, cols]) => {
      const matching = cols.filter(col =>
        col.label.toLowerCase().includes(columnSearch.toLowerCase())
      );
      if (matching.length) filtered[category] = matching;
    });
    return filtered;
  }, [groupedColumns, columnSearch]);

  const handleToggleColumn = (colId: string) => {
    setSelectedColumnIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(colId)) newSet.delete(colId);
      else newSet.add(colId);
      return newSet;
    });
    setActivePreset(null);
  };

  const handleSelectAll = () => {
    setSelectedColumnIds(new Set(availableColumns.map(col => col.id)));
    setActivePreset('All Columns');
  };

  const handleClearAll = () => {
    // Always keep product and productScore columns
    setSelectedColumnIds(new Set(['product', 'productScore']));
    setActivePreset(null);
  };

  const handleApplyPreset = (presetName: string) => {
    const preset = COLUMN_PRESETS[presetName as keyof typeof COLUMN_PRESETS];
    if (preset) {
      setSelectedColumnIds(new Set(preset));
      setActivePreset(presetName);
    }
  };

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

  // Render Column Options Panel
  const renderColumnPanel = () => {
    if (!columnPanelOpen) return null;

    return (
      <div
        ref={columnPanelRef}
        className="absolute top-12 right-0 w-[850px] max-h-[70vh] rounded-xl overflow-hidden flex flex-col shadow-2xl z-50"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--card-border)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--card-border)' }}>
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Manage Columns</h3>
          <button
            onClick={() => { setColumnPanelOpen(false); setColumnSearch(''); }}
            className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
          >
            <X size={18} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden" style={{ minHeight: '400px' }}>
          {/* Left Sidebar - Presets */}
          <div className="w-48 p-3 border-r overflow-y-auto" style={{ borderColor: 'var(--card-border)', background: 'var(--bg-secondary)' }}>
            <div className="mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Presets</span>
            </div>
            <div className="space-y-1">
              {Object.keys(COLUMN_PRESETS).map(preset => (
                <button
                  key={preset}
                  onClick={() => handleApplyPreset(preset)}
                  className="w-full px-3 py-1.5 text-xs font-medium rounded-md text-left transition-colors"
                  style={{
                    background: activePreset === preset ? 'var(--brand-blue)' : 'transparent',
                    color: activePreset === preset ? '#fff' : 'var(--text-secondary)'
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Right Content - Columns */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search and Actions */}
            <div className="p-3 border-b" style={{ borderColor: 'var(--card-border)' }}>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={14} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search columns..."
                  value={columnSearch}
                  onChange={(e) => setColumnSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg text-sm"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--card-border)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSelectAll}
                  className="text-xs font-medium transition-colors hover:underline"
                  style={{ color: 'var(--brand-blue)' }}
                >
                  Select All
                </button>
                <button
                  onClick={handleClearAll}
                  className="text-xs font-medium transition-colors hover:underline"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Clear All
                </button>
                <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>
                  {selectedColumnIds.size} of {availableColumns.length}
                </span>
              </div>
            </div>

            {/* Columns List */}
            <div className="flex-1 overflow-y-auto p-3">
              {Object.entries(filteredColumns).map(([category, cols]) => (
                <div key={category} className="mb-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                    {category}
                  </h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    {cols.map(col => (
                      <label
                        key={col.id}
                        className="flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors hover:bg-white/5"
                        style={{ border: '1px solid var(--card-border)' }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedColumnIds.has(col.id)}
                          onChange={() => handleToggleColumn(col.id)}
                          className="rounded focus:ring-0"
                          style={{ borderColor: 'var(--card-border)' }}
                        />
                        <span className="flex-1 text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                          {col.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Helper function to render cell content
  const renderCellContent = (product: Product, columnId: string) => {
    switch (columnId) {
      case 'product': return null; // Handled separately
      case 'productScore': return getScore(product);
      case 'price': return product.price;
      case 'sales': return product.sales;
      case 'refundAmount': return product.refundAmount;
      case 'quantity': return product.quantity;
      case 'repeatOrderCustomerCount': return product.repeatOrderCustomerCount;
      case 'adSpend': return product.adSpend;
      case 'adSales': return product.adSales;
      case 'adAov': return product.adAov;
      case 'clicks': return product.clicks;
      case 'adConversions': return product.adConversions;
      case 'adUnits': return product.adUnits;
      case 'adSkuSales': return product.adSkuSales;
      case 'adSalesAttributedSku': return product.adSalesAttributedSku;
      case 'acos': return product.acos;
      case 'tacos': return product.tacos;
      case 'roas': return product.roas;
      case 'cpc': return product.cpc;
      case 'ctr': return product.ctr;
      case 'cvr': return product.cvr;
      case 'pageViews': return product.pageViews;
      case 'profit': return product.profit;
      case 'organicSales': return product.organicSales;
      case 'fbaFee': return product.fbaFee;
      case 'referralFee': return product.referralFee;
      case 'totalFees': return product.totalFees;
      case 'margin': return product.margin;
      case 'roi': return product.roi;
      case 'aov': return product.aov;
      case 'variableClosingFee': return product.variableClosingFee;
      case 'shippingAmount': return product.shippingAmount;
      case 'fbmShippingCost': return product.fbmShippingCost;
      case 'shippingToFbaCost': return product.shippingToFbaCost;
      case 'cog': return product.cog;
      case 'unitLandingCost': return product.unitLandingCost;
      case 'cogs': return product.cogs;
      case 'totalExpense': return product.totalExpense;
      case 'b2bOrderedProductSales': return product.b2bOrderedProductSales;
      case 'orderCount': return product.orderCount;
      case 'repeatOrderQuantity': return product.repeatOrderQuantity;
      case 'repeatCustomerRate': return product.repeatCustomerRate;
      case 'organicUnits': return product.organicUnits;
      case 'organicOrders': return product.organicOrders;
      case 'newToBrandOrderQuantity': return product.newToBrandOrderQuantity;
      case 'newToBrandCustomerCount': return product.newToBrandCustomerCount;
      case 'b2bTotalOrderItems': return product.b2bTotalOrderItems;
      case 'b2bUnitsOrdered': return product.b2bUnitsOrdered;
      case 'orderedProductSalesAmount': return product.orderedProductSalesAmount;
      case 'totalOrderItems': return product.totalOrderItems;
      case 'sessions': return product.sessions;
      case 'impressions': return product.impressions;
      case 'childSessions': return product.childSessions;
      case 'b2bPageViews': return product.b2bPageViews;
      case 'b2bSessions': return product.b2bSessions;
      case 'asinImpressionCount': return product.asinImpressionCount;
      case 'totalQueryImpressionCount': return product.totalQueryImpressionCount;
      case 'buyBoxPercent': return product.buyBoxPercent;
      case 'unitSessionPercent': return product.unitSessionPercent;
      case 'b2bUnitsPerSession': return product.b2bUnitsPerSession;
      case 'salesVelocity': return product.salesVelocity;
      case 'dayOfSupplyFba': return product.dayOfSupplyFba;
      case 'availableQuantity': return product.availableQuantity;
      case 'inboundQuantity': return product.inboundQuantity;
      case 'fcTransfer': return product.fcTransfer;
      case 'shippedRevenue': return product.shippedRevenue;
      case 'shippedCogs': return product.shippedCogs;
      case 'openPurchaseOrderUnits': return product.openPurchaseOrderUnits;
      case 'poOpenCarriedOverCount': return product.poOpenCarriedOverCount;
      case 'poOpenCarriedOverUnits': return product.poOpenCarriedOverUnits;
      case 'poPeriodCount': return product.poPeriodCount;
      case 'poPeriodOrderedUnits': return product.poPeriodOrderedUnits;
      case 'poPeriodOpenCount': return product.poPeriodOpenCount;
      case 'poPeriodClosedCount': return product.poPeriodClosedCount;
      case 'poPeriodOpenUnits': return product.poPeriodOpenUnits;
      case 'poPeriodClosedUnits': return product.poPeriodClosedUnits;
      case 'shippedUnits': return product.shippedUnits;
      case 'repeatOrders': return product.repeatOrders;
      case 'repeatPurchaseRevenue': return product.repeatPurchaseRevenue;
      case 'vendorConfirmationRate': return product.vendorConfirmationRate;
      case 'averageVendorLeadTimeDays': return product.averageVendorLeadTimeDays;
      case 'procurableOutOfStockRate': return product.procurableOutOfStockRate;
      case 'sellableOnHandInventoryUnits': return product.sellableOnHandInventoryUnits;
      case 'unsellableOnHandInventoryUnits': return product.unsellableOnHandInventoryUnits;
      case 'aged90PlusDaysUnits': return product.aged90PlusDaysUnits;
      case 'sellableOnHandInventoryCost': return product.sellableOnHandInventoryCost;
      case 'unsellableOnHandInventoryCost': return product.unsellableOnHandInventoryCost;
      case 'aged90PlusDaysCost': return product.aged90PlusDaysCost;
      default: return '-';
    }
  };

  const getDeterministicHash = (input: string) => {
    let hash = 0;
    for (let i = 0; i < input.length; i += 1) {
      hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
    }
    return hash;
  };

  const parseDisplayValue = (value: string | number | null) => {
    if (value === null || value === undefined) return null;

    if (typeof value === 'number') {
      return {
        numericValue: value,
        kind: 'number' as const,
        decimals: Number.isInteger(value) ? 0 : 2,
      };
    }

    const trimmed = String(value).trim();
    if (!trimmed || trimmed === '-') return null;

    const numericValue = Number.parseFloat(trimmed.replace(/[^0-9.-]/g, ''));
    if (!Number.isFinite(numericValue)) return null;

    const decimalMatch = trimmed.match(/\.([0-9]+)/);
    return {
      numericValue,
      kind: trimmed.includes('$') ? ('currency' as const) : trimmed.endsWith('%') ? ('percent' as const) : ('number-string' as const),
      decimals: decimalMatch?.[1]?.length ?? 0,
    };
  };

  const formatParsedValue = (
    numericValue: number,
    parsed: { kind: 'number' | 'number-string' | 'currency' | 'percent'; decimals: number }
  ) => {
    const decimals = Math.max(0, Math.min(parsed.decimals, 4));
    const absValue = Math.abs(numericValue);

    if (parsed.kind === 'currency') {
      return `${numericValue < 0 ? '-' : ''}$${absValue.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}`;
    }

    if (parsed.kind === 'percent') {
      return `${numericValue.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}%`;
    }

    return numericValue.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const getPeriodComparison = (productId: number, columnId: string, rawValue: string | number | null) => {
    const parsed = parseDisplayValue(rawValue);
    if (!parsed) return null;

    const hash = getDeterministicHash(`${productId}-${columnId}`);
    const isPositive = hash % 2 === 0;
    const changePercent = 2 + ((hash % 130) / 10); // 2.0% - 14.9%
    const factor = isPositive ? (1 + changePercent / 100) : (1 - changePercent / 100);
    const previousNumericValue = factor <= 0 ? parsed.numericValue : parsed.numericValue / factor;

    return {
      isPositive,
      changePercent,
      previousDisplayValue: formatParsedValue(previousNumericValue, parsed),
    };
  };

  const renderCellWithPeriodMeta = (
    productId: number,
    columnId: string,
    rawValue: string | number | null,
    align: 'left' | 'center' | 'right',
    currentContent: React.ReactNode
  ) => {
    const comparison = getPeriodComparison(productId, columnId, rawValue);

    if (!comparison) {
      return currentContent;
    }

    const alignmentClass =
      align === 'right' ? 'items-end text-right' : align === 'center' ? 'items-center text-center' : 'items-start text-left';

    return (
      <div className={`flex items-start gap-2 ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-between'}`}>
        <div className={`flex min-w-0 flex-col ${alignmentClass}`}>
          {currentContent}
          <span
            className="text-[10px] leading-tight"
            style={{ color: 'var(--text-primary)', opacity: 0.62 }}
          >
            {comparison.previousDisplayValue}
          </span>
        </div>
        <div className="flex shrink-0 flex-col items-center leading-none">
          {comparison.isPositive ? (
            <TrendingUp className="w-3.5 h-3.5" style={{ color: '#22c55e' }} />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
          )}
          <span
            className="mt-1 text-[10px] font-medium"
            style={{ color: comparison.isPositive ? '#22c55e' : '#ef4444' }}
          >
            {comparison.changePercent.toFixed(1)}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className="relative">
        {/* Columns Button - Top Right */}
        <div className="flex justify-end mb-3">
          <button
            onClick={() => setColumnPanelOpen(true)}
            data-column-trigger
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
            style={{
              background: 'var(--brand-blue)',
              color: '#fff'
            }}
          >
            <Columns size={16} />
            Columns
          </button>
        </div>

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
                {visibleColumns.map(col => (
                  <th
                    key={col.id}
                    className={`p-4 whitespace-nowrap ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.sticky ? 'sticky z-20' : ''}`}
                    style={{
                      background: 'var(--bg-card)',
                      boxShadow: col.sticky ? '4px 0 8px rgba(0,0,0,0.15)' : undefined,
                      left: col.sticky ? (col.id === 'product' ? '48px' : '0px') : undefined,
                      minWidth: col.width
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ borderTop: '1px solid var(--card-border)' }}>
              {products.map((product) => {
                const score = getScore(product);
                const scoreColor = getScoreColor(score);

                const isExpanded = expandedProductIds.has(product.id);
                const salesColumnIndex = visibleColumns.findIndex((column) => column.id === 'sales');
                const breakdownLegendColumnId =
                  salesColumnIndex > 0
                    ? visibleColumns[salesColumnIndex - 1]?.id
                    : salesColumnIndex === 0
                      ? 'sales'
                      : null;

                return (
                  <>
                  <tr key={product.id}
                    className="transition-colors group product-row"
                    style={{ borderBottom: isExpanded ? 'none' : '1px solid var(--card-border)' }}
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
                    {visibleColumns.map(col => (
                      <td
                        key={col.id}
                        className={`p-4 whitespace-nowrap ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.sticky ? 'sticky z-10' : ''}`}
                        style={{
                          background: 'var(--bg-primary)',
                          boxShadow: col.sticky ? '4px 0 8px rgba(0,0,0,0.15)' : undefined,
                          left: col.sticky ? (col.id === 'product' ? '48px' : '0px') : undefined,
                        }}
                      >
                        {col.id === 'product' ? (
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
                                {mode === 'both' ? (
                                  <button
                                    onClick={() => {
                                      const newSet = new Set(expandedProductIds);
                                      if (newSet.has(product.id)) newSet.delete(product.id);
                                      else newSet.add(product.id);
                                      setExpandedProductIds(newSet);
                                    }}
                                    className="text-[11px] font-medium flex items-center gap-1 transition-colors hover:underline"
                                    style={{ color: 'var(--brand-blue)' }}
                                  >
                                    <span className={`transition-transform duration-200 ${expandedProductIds.has(product.id) ? 'rotate-90' : ''}`}>
                                      <ChevronRight className="w-3 h-3" />
                                    </span>
                                    Seller vs Vendor
                                  </button>
                                ) : (
                                  <>
                                    {mode !== 'vendor' && (
                                      <button
                                        className="text-[11px] font-medium flex items-center gap-1 transition-colors hover:underline"
                                        style={{ color: 'var(--brand-blue)' }}
                                      >
                                        <ChevronRight className="w-3 h-3" />
                                        View SKUs
                                      </button>
                                    )}
                                    <button
                                      className="text-[11px] font-medium flex items-center gap-1 transition-colors hover:underline"
                                      style={{ color: 'var(--brand-blue)' }}
                                    >
                                      <ChevronRight className="w-3 h-3" />
                                      View Days
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : col.id === 'productScore' ? (
                          renderCellWithPeriodMeta(
                            product.id,
                            col.id,
                            score,
                            'center',
                            <div className="relative inline-flex items-center justify-center">
                              <span className="text-[14px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {score}
                              </span>
                              <span className="absolute -top-4 -right-7 inline-flex items-center justify-center cursor-pointer">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div style={{ cursor: 'pointer', lineHeight: 0 }}>
                                        {getScoreLabel() === 'APS' ? (
                                          <img src="/amazon.png" alt="Amazon" width="18" height="18" style={{ borderRadius: '4px', display: 'block' }} />
                                        ) : getScoreLabel() === 'SPS' ? (
                                          <img src="/shopify.png" alt="Shopify" width="18" height="18" style={{ borderRadius: '4px', display: 'block' }} />
                                        ) : (
                                          <img src="/eva.png" alt="Eva" width="18" height="18" style={{ borderRadius: '4px', display: 'block' }} />
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
                          )
                        ) : (
                          renderCellWithPeriodMeta(
                            product.id,
                            col.id,
                            renderCellContent(product, col.id) as string | number | null,
                            col.align,
                            <div className="text-[13px]" style={{ color: 'var(--text-primary)' }}>
                              {renderCellContent(product, col.id)}
                            </div>
                          )
                        )}
                      </td>
                    ))}
                  </tr>
                  {/* Expand Row for Both Mode - Seller vs Vendor Breakdown */}
                  {mode === 'both' && expandedProductIds.has(product.id) && (
                    <tr
                      key={`${product.id}-expand`}
                      style={{ borderBottom: '1px solid var(--card-border)', background: 'var(--bg-secondary)' }}
                    >
                      <td
                        className="p-4 text-center sticky left-0"
                        style={{ background: 'var(--bg-secondary)' }}
                      />
                      {visibleColumns.map(col => (
                        <td
                          key={`${product.id}-${col.id}-expand`}
                          className={`p-3 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                          style={{ background: 'var(--bg-secondary)' }}
                        >
                          {breakdownLegendColumnId && col.id === breakdownLegendColumnId ? (
                            <div className={col.id === 'product' ? 'flex justify-end' : undefined}>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-[11px] border-b border-dashed py-1" style={{ borderColor: 'var(--card-border)' }}>
                                  <span className="w-2 h-2 rounded-full bg-green-500" />
                                  <span className="font-semibold" style={{ color: 'var(--text-muted)' }}>Seller</span>
                                </div>
                                <div className="flex items-center gap-1 text-[11px] pt-1">
                                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                                  <span className="font-semibold" style={{ color: 'var(--text-muted)' }}>Vendor</span>
                                </div>
                              </div>
                            </div>
                          ) : col.id === 'product' ? (
                            <div className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                              Breakdown
                            </div>
                          ) : col.id === 'productScore' ? (
                            <div />
                          ) : col.id === 'price' || col.id === 'sales' || col.id === 'refundAmount' || col.id === 'quantity' || col.id === 'repeatOrderCustomerCount' || col.id === 'adSpend' || col.id === 'adSales' || col.id === 'adAov' || col.id === 'clicks' || col.id === 'adConversions' || col.id === 'adUnits' || col.id === 'adSkuSales' || col.id === 'adSalesAttributedSku' || col.id === 'acos' || col.id === 'tacos' || col.id === 'roas' || col.id === 'cpc' || col.id === 'ctr' || col.id === 'cvr' || col.id === 'pageViews' ? (
                            <div className="space-y-1">
                              <div className="text-[11px] border-b border-dashed py-1" style={{ borderColor: 'var(--card-border)' }}>
                                <span style={{ color: 'var(--text-primary)' }}>
                                  {col.id === 'price' ? product.sellerValues?.price :
                                   col.id === 'sales' ? product.sellerValues?.sales :
                                   col.id === 'refundAmount' ? product.sellerValues?.refundAmount :
                                   col.id === 'quantity' ? product.sellerValues?.quantity :
                                   col.id === 'repeatOrderCustomerCount' ? product.sellerValues?.repeatOrderCustomerCount :
                                   col.id === 'adSpend' ? product.sellerValues?.adSpend :
                                   col.id === 'adSales' ? product.sellerValues?.adSales :
                                   col.id === 'adAov' ? product.sellerValues?.adAov :
                                   col.id === 'clicks' ? product.sellerValues?.clicks :
                                   col.id === 'adConversions' ? product.sellerValues?.adConversions :
                                   col.id === 'adUnits' ? product.sellerValues?.adUnits :
                                   col.id === 'adSkuSales' ? product.sellerValues?.adSkuSales :
                                   col.id === 'adSalesAttributedSku' ? product.sellerValues?.adSalesAttributedSku :
                                   col.id === 'acos' ? product.sellerValues?.acos :
                                   col.id === 'tacos' ? product.sellerValues?.tacos :
                                   col.id === 'roas' ? product.sellerValues?.roas :
                                   col.id === 'cpc' ? product.sellerValues?.cpc :
                                   col.id === 'ctr' ? product.sellerValues?.ctr :
                                   col.id === 'cvr' ? product.sellerValues?.cvr :
                                   col.id === 'pageViews' ? product.sellerValues?.pageViews : '-'}
                                </span>
                              </div>
                              <div className="text-[11px] pt-1">
                                <span style={{ color: 'var(--text-primary)' }}>
                                  {col.id === 'price' ? product.vendorValues?.price :
                                   col.id === 'sales' ? product.vendorValues?.sales :
                                   col.id === 'refundAmount' ? product.vendorValues?.refundAmount :
                                   col.id === 'quantity' ? product.vendorValues?.quantity :
                                   col.id === 'repeatOrderCustomerCount' ? product.vendorValues?.repeatOrderCustomerCount :
                                   col.id === 'adSpend' ? product.vendorValues?.adSpend :
                                   col.id === 'adSales' ? product.vendorValues?.adSales :
                                   col.id === 'adAov' ? product.vendorValues?.adAov :
                                   col.id === 'clicks' ? product.vendorValues?.clicks :
                                   col.id === 'adConversions' ? product.vendorValues?.adConversions :
                                   col.id === 'adUnits' ? product.vendorValues?.adUnits :
                                   col.id === 'adSkuSales' ? product.vendorValues?.adSkuSales :
                                   col.id === 'adSalesAttributedSku' ? product.vendorValues?.adSalesAttributedSku :
                                   col.id === 'acos' ? product.vendorValues?.acos :
                                   col.id === 'tacos' ? product.vendorValues?.tacos :
                                   col.id === 'roas' ? product.vendorValues?.roas :
                                   col.id === 'cpc' ? product.vendorValues?.cpc :
                                   col.id === 'ctr' ? product.vendorValues?.ctr :
                                   col.id === 'cvr' ? product.vendorValues?.cvr :
                                   col.id === 'pageViews' ? product.vendorValues?.pageViews : '-'}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>-</div>
                          )}
                        </td>
                      ))}
                    </tr>
                  )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        {renderColumnPanel()}
      </div>

      {renderPopoverContent()}
      <ConfirmDeleteModal />
    </div>
    </React.Fragment>
  );
}
