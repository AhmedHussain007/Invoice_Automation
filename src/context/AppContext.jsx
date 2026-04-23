import { createContext, useContext, useState } from 'react';

/**
 * AppContext — Global state container.
 * Phase 1: Placeholder structure only.
 * Full logic will be wired in Phase 2.
 */

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Company / branding settings (future use)
  const [companySettings, setCompanySettings] = useState({});

  // Invoice generation form data (future use)
  const [invoiceData, setInvoiceData] = useState({});

  // Letter head form data (future use)
  const [letterheadData, setLetterheadData] = useState({});

  return (
    <AppContext.Provider value={{
      companySettings, setCompanySettings,
      invoiceData, setInvoiceData,
      letterheadData, setLetterheadData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// Convenience hook
export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
