import { createContext, useState, useCallback } from 'react';

export const EmployeesContext = createContext();

export const EmployeesProvider = ({ children }) => {
  const [reloadTrigger, setReloadTrigger] = useState(false);

  const triggerReload = useCallback(() => {
    setReloadTrigger(prev => !prev);
  }, []);

  return (
    <EmployeesContext.Provider value={{ reloadTrigger, triggerReload }}>
      {children}
    </EmployeesContext.Provider>
  );
};
