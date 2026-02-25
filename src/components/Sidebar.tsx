import React, { useState, useRef, useEffect } from 'react';
import { BarChart3, Users, Calendar, CheckSquare, MessageSquare, Layout, Menu, X, Megaphone, ChevronDown, Search } from 'lucide-react';

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

interface Client {
  id: string;
  name: string;
  avatar?: string;
}

const menuItems = [
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'advertising', label: 'Advertising', icon: Megaphone },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'meetings', label: 'Meetings', icon: Calendar },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'chats', label: 'Chats', icon: MessageSquare },
  { id: 'designs', label: 'Designs', icon: Layout },
];

const INTERNAL_USE_CLIENT: Client = {
  id: 'internal',
  name: 'Internal Use',
  avatar: 'BF'
};

const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Acme Corporation', avatar: 'AC' },
  { id: '2', name: 'TechStart Inc', avatar: 'TI' },
  { id: '3', name: 'Global Ventures', avatar: 'GV' },
  { id: '4', name: 'Innovation Labs', avatar: 'IL' },
  { id: '5', name: 'Digital Solutions', avatar: 'DS' },
  { id: '6', name: 'Creative Agency', avatar: 'CA' },
  { id: '7', name: 'Enterprise Plus', avatar: 'EP' },
  { id: '8', name: 'Startup Hub', avatar: 'SH' },
];

export function Sidebar({ activeMenu, onMenuChange, isOpen, onToggle }: SidebarProps) {
  const [selectedClient, setSelectedClient] = useState<Client>(INTERNAL_USE_CLIENT);
  const [isClientSelectorOpen, setIsClientSelectorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHoveringSelector, setIsHoveringSelector] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsClientSelectorOpen(false);
        setSearchQuery('');
      }
    };

    if (isClientSelectorOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isClientSelectorOpen]);

  const filteredClients = MOCK_CLIENTS.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <>
      <button
        onClick={onToggle}
        className="md:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-9 h-9 rounded-lg transition-all"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--neutral-border)',
          color: 'var(--text-secondary)',
        }}
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onToggle}
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 h-screen z-40
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{
          width: '200px',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--neutral-border)',
        }}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b" style={{ borderColor: 'var(--neutral-border)' }}>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              BrandFlow
            </h1>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Analytics Dashboard
            </p>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onMenuChange(item.id);
                    if (window.innerWidth < 768) {
                      onToggle();
                    }
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-neutral-bg"
                  style={{
                    background: isActive ? 'var(--brand-purple)' : 'transparent',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t relative" style={{ borderColor: 'var(--neutral-border)' }}>
            {selectedClient.id !== 'internal' && (
              <div className="flex justify-end mb-1.5">
                <button
                  onClick={() => {
                    setSelectedClient(INTERNAL_USE_CLIENT);
                    setIsClientSelectorOpen(false);
                  }}
                  className="text-xs font-medium transition-all hover:underline"
                  style={{
                    color: 'var(--text-muted)',
                    opacity: 0.7,
                  }}
                >
                  Switch to Internal
                </button>
              </div>
            )}
            <button
              ref={buttonRef}
              onClick={(e) => {
                if (isHoveringSelector && selectedClient.id !== 'internal') {
                  e.preventDefault();
                  setSelectedClient(INTERNAL_USE_CLIENT);
                  setIsClientSelectorOpen(false);
                } else {
                  setIsClientSelectorOpen(!isClientSelectorOpen);
                }
              }}
              onMouseEnter={() => setIsHoveringSelector(true)}
              onMouseLeave={() => setIsHoveringSelector(false)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group/selector"
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--neutral-border)',
                color: 'var(--text-primary)',
              }}
            >
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold"
                style={{
                  background: 'var(--brand-purple)',
                  color: 'var(--text-primary)',
                }}
              >
                {selectedClient.avatar}
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <div className="text-xs font-semibold truncate">{selectedClient.name}</div>
              </div>
              
              {selectedClient.id !== 'internal' ? (
                <>
                  <ChevronDown
                    size={16}
                    className="transition-all group-hover/selector:opacity-0"
                    style={{
                      transform: isClientSelectorOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      color: 'var(--text-muted)',
                    }}
                  />
                  <X
                    size={16}
                    className="absolute right-6 transition-all opacity-0 group-hover/selector:opacity-100"
                    style={{
                      color: 'var(--text-muted)',
                    }}
                  />
                </>
              ) : (
                <ChevronDown
                  size={16}
                  className="transition-transform"
                  style={{
                    transform: isClientSelectorOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    color: 'var(--text-muted)',
                  }}
                />
              )}
            </button>

            {isClientSelectorOpen && (
              <div
                ref={dropdownRef}
                className="absolute bg-bg-secondary rounded-lg shadow-xl overflow-hidden"
                style={{
                  left: '16px',
                  right: '16px',
                  bottom: 'calc(100% + 8px)',
                  border: '1px solid var(--neutral-border)',
                  zIndex: 1000,
                  maxHeight: '320px',
                  background: 'var(--bg-secondary)',
                }}
              >
                <div className="p-3 border-b" style={{ borderColor: 'var(--neutral-border)' }}>
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--neutral-border)',
                    }}
                  >
                    <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <input
                      type="text"
                      placeholder="Search clients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent text-sm outline-none w-full"
                      style={{ color: 'var(--text-primary)', minWidth: 0 }}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="overflow-y-auto" style={{ maxHeight: '240px' }}>
                  <button
                    onClick={() => {
                      setSelectedClient(INTERNAL_USE_CLIENT);
                      setIsClientSelectorOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all hover:bg-opacity-50 border-b"
                    style={{
                      background: selectedClient.id === 'internal' ? 'var(--bg-tertiary)' : 'transparent',
                      color: 'var(--text-primary)',
                      borderColor: 'var(--neutral-border)',
                    }}
                  >
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold flex-shrink-0"
                      style={{
                        background: selectedClient.id === 'internal' ? 'var(--brand-blue)' : 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {INTERNAL_USE_CLIENT.avatar}
                    </div>
                    <div className="flex-1 text-left overflow-hidden">
                      <span className="block truncate font-semibold">{INTERNAL_USE_CLIENT.name}</span>
                    </div>
                  </button>

                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <button
                        key={client.id}
                        onClick={() => {
                          setSelectedClient(client);
                          setIsClientSelectorOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all hover:bg-opacity-50"
                        style={{
                          background: selectedClient.id === client.id ? 'var(--bg-tertiary)' : 'transparent',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <div
                          className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold flex-shrink-0"
                          style={{
                            background: selectedClient.id === client.id ? 'var(--brand-purple)' : 'var(--bg-tertiary)',
                            color: 'var(--text-primary)',
                          }}
                        >
                          {client.avatar}
                        </div>
                        <div className="flex-1 text-left overflow-hidden">
                          <span className="block truncate">{client.name}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                      No clients found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
