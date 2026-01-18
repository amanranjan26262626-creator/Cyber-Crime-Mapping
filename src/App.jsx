import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsDashboard from './components/StatsDashboard';
import SearchTool from './components/SearchTool';
import CaseManagement from './components/CaseManagement';
// import NetworkAnalysis from './components/NetworkAnalysis'; // Replaced by Dashboard
import InvestigationDashboard from './components/InvestigationDashboard';
import ReportsModule from './components/ReportsModule';
import SettingsModule from './components/SettingsModule';
import AccessControl from './components/AccessControl';
import TelegramModule from './components/TelegramModule';

import TelegramInfoModule from './components/TelegramInfoModule';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <StatsDashboard />;
      case 'search':
        return <SearchTool />;

      case 'tg_info':
        return <TelegramInfoModule />;
      case 'cases':
        return <CaseManagement />;
      case 'network':
        return <InvestigationDashboard />; // Upgraded to Full Dashboard
      case 'telegram':
        return <TelegramModule />;
      case 'reports':
        return <ReportsModule />;
      case 'access':
        return <AccessControl />;
      case 'settings':
        return <SettingsModule />;
      default:
        return (
          <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
            <h2 style={{ color: 'var(--text-muted)' }}>Module '{activeTab.toUpperCase()}' Under Development</h2>
            <p style={{ marginTop: '1rem' }}>This feature is part of the Phase 2 rollout.</p>
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--bg-app)' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="main-content">
        <Header title={activeTab === 'network' ? 'AI Investigation Portal' : (activeTab === 'dashboard' ? 'Overview' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1))} />

        <div className="content-scroll">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;
