
import React, { useEffect, useState } from 'react';
import { TabID } from '../App';
import { contentMap, TabContent } from '../data/content';
import SchedulePage from './SchedulePage';
import StatsPage from './StatsPage';
import HallOfFamePage from './HallOfFamePage';
import RulesPage from './RulesPage';
import CreditsPage from './CreditsPage';
import LegacyPage from './LegacyPage';
import MorePage from './MorePage';
import MenuGridPage from './MenuGridPage';
import RecordsPage from './RecordsPage';
import HistoryPage from './HistoryPage';
import ComparePage from './ComparePage';
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
    'records': 'legacy',
    'hall-of-fame': 'legacy',
    'league-history': 'more'
  };
  return parentMap[tabId] || tabId;
};

const TabPage: React.FC<TabPageProps> = ({ tabId, onBack, onTabChange }) => {
  const { getThemeColors } = useSettings();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tabId]);

  const subPages: TabID[] = ['partner-hub', 'rules', 'hall-of-fame', 'league-history', 'credits', 'records'];
  const isSubPage = subPages.includes(tabId);
  
  // Always use neutral theme colors for the TabPage shell (like the back button)
  // to prevent the "gold" theme from bleeding into the navigation UI.
  const colors = getThemeColors(false);

  const accentText = colors.text;
  const accentShadow = colors.hoverShadow;
  const accentBgSoft = colors.bgSoft;

  const handleBackNavigation = () => {
    const legacySubPages: TabID[] = ['hall-of-fame', 'records'];
    if (legacySubPages.includes(tabId) && onTabChange) {
      onTabChange('legacy');
    } else if (isSubPage && onTabChange) {
      onTabChange('more');
    } else {
      onBack();
    }
  };

  const getPageContent = () => {
    if (tabId === 'hall-of-fame' || tabId === 'records' || tabId === 'legacy') {
        return contentMap['legacy'];
    }
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
      'history': 'league-history',
      'credits': 'credits',
      'records': 'records',
      'compare': 'compare'
    };
    
    const target = slugMap[label.toLowerCase()] || label.toLowerCase() as TabID;
    const validTabs: TabID[] = ['schedule', 'stats', 'legacy', 'rules', 'more', 'partner-hub', 'hall-of-fame', 'league-history', 'credits', 'records', 'compare'];
    
    if (onTabChange && validTabs.includes(target)) {
      onTabChange(target);
    }
  };

  const renderContent = () => {
    if (tabId === 'legacy' || tabId === 'hall-of-fame' || tabId === 'records') {
      return <LegacyPage initialSegment={tabId === 'records' ? 'records' : 'hof'} />;
    }
    if (tabId === 'rules') {
      return <RulesPage />;
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
    if (tabId === 'league-history') {
      return <HistoryPage />;
    }
    if (tabId === 'compare') {
      return <ComparePage />;
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

        {/* Content Header - Exclude tabs that handle their own specialized layout */}
        {tabId !== 'stats' && tabId !== 'legacy' && tabId !== 'hall-of-fame' && tabId !== 'records' && tabId !== 'compare' && (
          <div>
            <h2 className={`text-4xl md:text-6xl font-black tracking-tighter ${colors.text === 'text-[#3B82F6]' ? 'text-[#3B82F6]' : 'text-zinc-900 dark:text-white'}`}>
              {page.title.toLowerCase()}
            </h2>
          </div>
        )}

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
      `}</style>
    </div>
  );
};

export default TabPage;
