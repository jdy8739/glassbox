'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface HeaderContextType {
  navContent: ReactNode;
  setNavContent: (node: ReactNode) => void;
  actionContent: ReactNode;
  setActionContent: (node: ReactNode) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [navContent, setNavContent] = useState<ReactNode>(null);
  const [actionContent, setActionContent] = useState<ReactNode>(null);

  return (
    <HeaderContext.Provider value={{ navContent, setNavContent, actionContent, setActionContent }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (!context) throw new Error('useHeader must be used within HeaderProvider');
  return context;
}

// Helper component to inject content from pages
export function HeaderPortal({ nav, actions }: { nav?: ReactNode, actions?: ReactNode }) {
  const { setNavContent, setActionContent } = useHeader();

  useEffect(() => {
    if (nav) setNavContent(nav);
    if (actions) setActionContent(actions);

    return () => {
      if (nav) setNavContent(null);
      if (actions) setActionContent(null);
    };
  }, [nav, actions, setNavContent, setActionContent]);

  return null;
}
