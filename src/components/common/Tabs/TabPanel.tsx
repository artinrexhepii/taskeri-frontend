import React from 'react';

interface TabPanelProps {
  id: string;
  activeId: string;
  children: React.ReactNode;
  className?: string;
}

const TabPanel: React.FC<TabPanelProps> = ({
  id,
  activeId,
  children,
  className = '',
}) => {
  const isActive = id === activeId;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
      hidden={!isActive}
      className={`${className} ${isActive ? 'block' : 'hidden'}`}
    >
      {children}
    </div>
  );
};

export default TabPanel;