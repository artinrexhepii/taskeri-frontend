import React, { useState } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  tabsClassName?: string;
  contentClassName?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTabId,
  orientation = 'horizontal',
  className = '',
  tabsClassName = '',
  contentClassName = ''
}) => {
  const [activeTabId, setActiveTabId] = useState<string>(defaultTabId || (tabs.length > 0 ? tabs[0].id : ''));

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
  };

  // Find the active tab content
  const activeTabContent = tabs.find(tab => tab.id === activeTabId)?.content;

  return (
    <div className={`${className} ${orientation === 'vertical' ? 'flex' : 'block'}`}>
      {/* Tab navigation */}
      <div 
        className={`
          ${tabsClassName}
          ${orientation === 'horizontal' 
            ? 'flex space-x-1 border-b border-gray-200' 
            : 'flex-shrink-0 flex flex-col space-y-1 border-r border-gray-200 pr-4 mr-4'
          }
        `}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              px-4 py-2 text-sm font-medium rounded-t-md transition-colors
              ${activeTabId === tab.id
                ? 'bg-primary text-white' 
                : 'text-text-secondary hover:text-primary hover:bg-primary/5'}
              ${orientation === 'horizontal' ? 'pb-2 mb-[-1px]' : ''}
            `}
            aria-current={activeTabId === tab.id ? 'page' : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className={`${contentClassName} mt-4 ${orientation === 'vertical' ? 'flex-grow' : ''}`}>
        {activeTabContent}
      </div>
    </div>
  );
};

export default Tabs;