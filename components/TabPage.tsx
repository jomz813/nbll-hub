
import React, { useEffect } from 'react';
import { TabID } from '../App';
import { contentMap, TabContent } from '../data/content';
import StandingsPage from './StandingsPage';
import SchedulePage from './SchedulePage';
import StatsPage from './StatsPage';
import HallOfFamePage from './HallOfFamePage';
import RulesPage from './RulesPage';
import CreditsPage from './CreditsPage';
import LegacyPage from './LegacyPage';
import MorePage from './MorePage';
import MenuGridPage from './MenuGridPage';
import RecordsPage from './RecordsPage';
import { useSettings } from '../context/SettingsContext';

interface TabPageProps {
  tabId: TabID;
  onBack: () => void;
  onTabChange?: (tabId: TabID) => void;
}

// --- Helper to find parent navigation tab ---
const getParentTab = (tabId: TabID): TabID => {
  const parentMap: Partial<Record<TabID, TabID>> = {
    'partner-hub': 'more',
    'rules': 'more',
    'credits': 'more',
    'records': 'more',
    'hall-of-fame': 'legacy',
    'league-history': 'legacy'
  };
  return parentMap[tabId] || tabId;
};

const TabPage: React.FC<TabPageProps> = ({ tabId, onBack, onTabChange }) => {
  const { getThemeColors } = useSettings();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tabId]);

  const subPages: TabID[] = ['partner-hub', 'rules', 'hall-of-fame', 'league-history', 'credits', 'records'];
  const isSubPage = subPages.includes(tabId);
  
  const isHOF = tabId === 'hall-of-fame';
  const colors = getThemeColors(isHOF);

  const accentText = colors.text;
  const accentShadow = colors.hoverShadow;
  const accentBgSoft = colors.bgSoft;

  const handleBackNavigation = () => {
    const legacySubPages: TabID[] = ['hall-of-fame', 'league-history'];
    if (legacySubPages.includes(tabId) && onTabChange) {
      onTabChange('legacy');
    } else if (isSubPage && onTabChange) {
      onTabChange('more');
    } else {
      onBack();
    }
  };

  const getPageContent = () => {
    return contentMap[tabId] || { 
      title: tabId.charAt(0).toUpperCase() + tabId.slice(1), 
      description: 'Information regarding this section is currently being updated.',
      items: []
    };
  };

  const page = getPageContent();

  const handleItemClick = (label: string) => {
    const slugMap: Record<string, TabID> = {
      'rules': 'rules',
      'hall of fame': 'hall-of-fame',
      'league history': 'league-history',
      'credits': 'credits',
      'records': 'records'
    };
    
    const target = slugMap[label.toLowerCase()] || label.toLowerCase() as TabID;
    const validTabs: TabID[] = ['standings', 'schedule', 'stats', 'legacy', 'rules', 'more', 'partner-hub', 'hall-of-fame', 'league-history', 'credits', 'records'];
    
    if (onTabChange && validTabs.includes(target)) {
      onTabChange(target);
    }
  };

  const renderContent = () => {
    if (tabId === 'hall-of-fame') {
      return <HallOfFamePage />;
    }
    if (tabId === 'legacy') {
      return <LegacyPage items={page.items} onItemClick={handleItemClick} />;
    }
    if (tabId === 'rules') {
      return <RulesPage />;
    }
    if (tabId === 'standings') {
      return <StandingsPage />;
    }
    if (tabId === 'schedule') {
      return <SchedulePage />;
    }
    if (tabId === 'stats') {
      return <StatsPage />;
    }
    if (tabId === 'credits') {
      return <CreditsPage />;
    }
    if (tabId === 'records') {
      return <RecordsPage />;
    }
    if (tabId === 'more') {
      return (
        <MorePage 
          items={page.items} 
          onItemClick={handleItemClick} 
          accentText={accentText} 
          accentBgSoft={accentBgSoft} 
          accentShadow={accentShadow} 
        />
      );
    }
    
    // Default fallback for generic menus (e.g. partner-hub, league-history if falling through)
    return (
      <MenuGridPage 
        items={page.items} 
        onItemClick={handleItemClick} 
        accentText={accentText} 
        accentBgSoft={accentBgSoft} 
        accentShadow={accentShadow} 
      />
    );
  };

  return (
    <div className={`min-h-screen bg-white dark:bg-zinc-950 pt-32 pb-20 px-4 md:px-6 animate-page-enter transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Breadcrumb / Back */}
        <button 
          onClick={handleBackNavigation}
          className={`group flex items-center gap-2 ${accentText} font-bold text-sm tracking-widest uppercase hover:opacity-70 transition-all`}
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {isSubPage ? (getParentTab(tabId) === 'legacy' ? 'legacy' : 'more') : 'home'}
        </button>

        {/* Content Header */}
        <div className="space-y-4">
          <h2 className={`text-4xl md:text-6xl font-black tracking-tighter ${isHOF ? 'text-[#D4AF37]' : (colors.text === 'text-[#3B82F6]' ? 'text-[#3B82F6]' : 'text-zinc-900 dark:text-white')}`}>
            {page.title.toLowerCase()}
          </h2>
          <p className={`text-lg md:text-xl font-medium max-w-2xl ${isHOF ? 'text-[#D4AF37]/80' : 'text-zinc-500 dark:text-zinc-400'}`}>
            {page.description.toLowerCase()}
          </p>
        </div>

        {/* Main Content Render */}
        {renderContent()}
      </div>

      <style>{`
        @keyframes page-enter {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-page-enter {
          animation: page-enter 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes easter-egg-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-easter-egg {
          animation: easter-egg-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default TabPage;
