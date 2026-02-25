import React, { useState, useMemo } from 'react';
import { Store, ChevronDown, Check } from 'lucide-react';

type Channel = 'amazon' | 'shopify' | 'walmart';
type AccountType = 'seller' | 'vendor';
type Store = 'all' | 'Karaca Porcelain - US' | 'KARACA - UK' | 'KARACA - DE';

interface ChannelHeaderProps {
    selectedChannels: Channel[];
    onChannelsChange: (channels: Channel[]) => void;
    accountType: AccountType;
    onAccountTypeChange: (type: AccountType) => void;
}

export function ChannelHeader({
    selectedChannels,
    onChannelsChange,
    accountType,
    onAccountTypeChange
}: ChannelHeaderProps) {
    const [selectedStores, setSelectedStores] = useState<Store[]>(['all']);
    const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);

    const handleChannelToggle = (channel: Channel) => {
        const isSelected = selectedChannels.includes(channel);

        if (isSelected) {
            const newChannels = selectedChannels.filter(c => c !== channel);
            if (newChannels.length > 0) {
                onChannelsChange(newChannels);
            }
        } else {
            onChannelsChange([...selectedChannels, channel]);
        }
    };

    const handleStoreToggle = (store: Store) => {
        if (store === 'all') {
            setSelectedStores(['all']);
            return;
        }

        setSelectedStores((current) => {
            const isSelected = current.includes(store);
            let newStores: Store[];

            if (isSelected) {
                newStores = current.filter((s) => s !== store && s !== 'all');
                if (newStores.length === 0) {
                    return ['all'];
                }
            } else {
                newStores = [...current.filter((s) => s !== 'all'), store];
            }

            return newStores;
        });
    };

    const selectedStoreCount = useMemo(() => {
        return selectedStores.includes('all') ? 3 : selectedStores.length;
    }, [selectedStores]);

    const storeButtonText = useMemo(() => {
        if (selectedStores.includes('all')) {
            return 'All Stores';
        }
        if (selectedStores.length === 1) {
            return selectedStores[0];
        }
        return `${selectedStores.length} Stores`;
    }, [selectedStores]);

    return (
        <div
            className="h-14 flex items-center justify-between px-6 mb-6 rounded-lg"
            style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--card-border)'
            }}
        >
            <div className="flex items-center gap-4">
                {/* Channel Selector */}
                <div
                    className="flex items-center gap-1 p-1 rounded-lg"
                    style={{ background: 'var(--bg-secondary)' }}
                >
                    <button
                        onClick={() => handleChannelToggle('amazon')}
                        className="h-8 px-4 text-xs font-medium rounded-md transition-all flex items-center gap-2"
                        style={{
                            background: selectedChannels.includes('amazon') ? 'var(--brand-purple)' : 'transparent',
                            color: selectedChannels.includes('amazon') ? '#fff' : 'var(--text-secondary)',
                        }}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726-1.548.406-3.14.61-4.777.61-2.707 0-5.288-.542-7.738-1.625-.707-.315-1.394-.67-2.06-1.063l-.586-.42c-.696-.507-1.05-.78-1.06-.817-.026-.09.1-.208.376-.357z" />
                        </svg>
                        Amazon
                    </button>
                    <button
                        onClick={() => handleChannelToggle('shopify')}
                        className="h-8 px-4 text-xs font-medium rounded-md transition-all flex items-center gap-2"
                        style={{
                            background: selectedChannels.includes('shopify') ? 'var(--brand-purple)' : 'transparent',
                            color: selectedChannels.includes('shopify') ? '#fff' : 'var(--text-secondary)',
                        }}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.758c-.021-.145-.163-.26-.309-.26-.145 0-3.039-.021-3.039-.021s-2.018-1.976-2.243-2.201c-.225-.225-.666-.159-.838-.104-.003.001-.529.163-1.39.429-.826-2.386-2.286-4.577-4.857-4.577-.071 0-.144.003-.217.007C6.48-.478 5.726-.061 5.078.667 3.716 2.195 2.9 5.024 2.608 7.067c-2.088.647-3.549 1.098-3.625 1.123-.715.224-.737.246-.831.924C.067 9.733-1.35 21.03 8.006 23.979l7.331.001z" />
                        </svg>
                        Shopify
                    </button>
                    <button
                        onClick={() => handleChannelToggle('walmart')}
                        className="h-8 px-4 text-xs font-medium rounded-md transition-all flex items-center gap-2"
                        style={{
                            background: selectedChannels.includes('walmart') ? 'var(--brand-purple)' : 'transparent',
                            color: selectedChannels.includes('walmart') ? '#fff' : 'var(--text-secondary)',
                        }}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.5 10.8l2.8-8.5c.2-.6.8-.9 1.4-.7.6.2.9.8.7 1.4l-2.4 7.2 7.2-2.4c.6-.2 1.2.1 1.4.7.2.6-.1 1.2-.7 1.4l-8.5 2.8 8.5 2.8c.6.2.9.8.7 1.4-.2.6-.8.9-1.4.7l-7.2-2.4 2.4 7.2c.2.6-.1 1.2-.7 1.4-.6.2-1.2-.1-1.4-.7l-2.8-8.5-2.8 8.5c-.2.6-.8.9-1.4.7-.6-.2-.9-.8-.7-1.4l2.4-7.2-7.2 2.4c-.6.2-1.2-.1-1.4-.7-.2-.6.1-1.2.7-1.4l8.5-2.8-8.5-2.8c-.6-.2-.9-.8-.7-1.4.2-.6.8-.9 1.4-.7l7.2 2.4-2.4-7.2c-.2-.6.1-1.2.7-1.4.6-.2 1.2.1 1.4.7l2.8 8.5z" />
                        </svg>
                        Walmart
                    </button>
                </div>

                {/* Account Type Selector */}
                <div
                    className="flex items-center gap-1 p-1 rounded-lg"
                    style={{ background: 'var(--bg-secondary)' }}
                >
                    <button
                        onClick={() => onAccountTypeChange('seller')}
                        className="h-8 px-4 text-xs font-medium rounded-md transition-all"
                        style={{
                            background: accountType === 'seller' ? 'var(--brand-purple)' : 'transparent',
                            color: accountType === 'seller' ? '#fff' : 'var(--text-secondary)',
                        }}
                    >
                        Seller
                    </button>
                    <button
                        onClick={() => onAccountTypeChange('vendor')}
                        className="h-8 px-4 text-xs font-medium rounded-md transition-all"
                        style={{
                            background: accountType === 'vendor' ? 'var(--brand-purple)' : 'transparent',
                            color: accountType === 'vendor' ? '#fff' : 'var(--text-secondary)',
                        }}
                    >
                        Vendor
                    </button>
                </div>

                {/* Store Selector */}
                <div className="relative">
                    <button
                        onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
                        className="h-10 px-4 rounded-xl flex items-center gap-2 transition-all"
                        style={{
                            background: 'var(--bg-primary)',
                            border: '2px solid var(--card-border)',
                            color: 'var(--text-primary)',
                        }}
                    >
                        <Store size={18} />
                        <span className="text-sm font-semibold">{storeButtonText}</span>
                        <span className="text-sm font-bold" style={{ color: 'var(--brand-blue)' }}>
                            ({selectedStoreCount}/3)
                        </span>
                        <ChevronDown size={14} />
                    </button>

                    {storeDropdownOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setStoreDropdownOpen(false)}
                            />
                            <div
                                className="absolute top-full left-0 mt-2 w-64 rounded-lg shadow-xl z-50 py-1"
                                style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--card-border)'
                                }}
                            >
                                <button
                                    onClick={() => { handleStoreToggle('all'); setStoreDropdownOpen(false); }}
                                    className="w-full px-4 py-2.5 text-sm flex items-center justify-between transition-colors"
                                    style={{ color: 'var(--text-primary)' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <span>All Stores</span>
                                    {selectedStores.includes('all') && (
                                        <Check size={16} style={{ color: 'var(--brand-blue)' }} />
                                    )}
                                </button>
                                <div style={{ height: 1, background: 'var(--card-border)', margin: '4px 0' }} />
                                {(['Karaca Porcelain - US', 'KARACA - UK', 'KARACA - DE'] as Store[]).map(store => (
                                    <button
                                        key={store}
                                        onClick={() => handleStoreToggle(store)}
                                        className="w-full px-4 py-2.5 text-sm flex items-center justify-between transition-colors"
                                        style={{ color: 'var(--text-primary)' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <span>{store}</span>
                                        {selectedStores.includes(store) && (
                                            <Check size={16} style={{ color: 'var(--brand-blue)' }} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Right side - Export & Columns buttons */}
            <div className="flex items-center gap-3">
                <button
                    className="h-10 px-4 rounded-lg flex items-center gap-2 text-sm font-medium transition-all"
                    style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--card-border)',
                        color: 'var(--text-secondary)',
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Export
                </button>
                <button
                    className="h-10 px-4 rounded-lg flex items-center gap-2 text-sm font-medium transition-all"
                    style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--card-border)',
                        color: 'var(--text-secondary)',
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                    </svg>
                    Columns
                </button>
            </div>
        </div>
    );
}
