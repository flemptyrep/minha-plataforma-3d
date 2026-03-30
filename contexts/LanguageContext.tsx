"use client";
import { createContext, useContext, useState, useMemo } from 'react';

interface LanguageContextType {
  idioma: string;
  mudarIdioma: (lang: string) => void; // <-- Nome corrigido para o Header reconhecer!
}

const LanguageContext = createContext<LanguageContextType>({ idioma: 'pt', mudarIdioma: () => {} });

export function LanguageProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [idioma, setIdioma] = useState('pt');
  
  // Otimização exigida pelo SonarCloud
  const value = useMemo(() => ({ idioma, mudarIdioma: setIdioma }), [idioma]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);