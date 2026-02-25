import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { AnalyticsView } from './components/AnalyticsView';
import { AdvertisingView } from './components/AdvertisingView';
import { ClientsView } from './components/ClientsView';
import { MeetingsView } from './components/MeetingsView';
import { TasksView } from './components/TasksView';
import { ChatsView } from './components/ChatsView';
import { DesignsView } from './components/DesignsView';

function App() {
  const [activeMenu, setActiveMenu] = useState('analytics');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderView = () => {
    switch (activeMenu) {
      case 'analytics':
        return <AnalyticsView />;
      case 'advertising':
        return <AdvertisingView />;
      case 'clients':
        return <ClientsView />;
      case 'meetings':
        return <MeetingsView />;
      case 'tasks':
        return <TasksView />;
      case 'chats':
        return <ChatsView />;
      case 'designs':
        return <DesignsView />;
      default:
        return <AnalyticsView />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
}

export default App;