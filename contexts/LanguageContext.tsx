"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { Idioma } from '@/lib/dicionario';

const LanguageContext = createContext<any>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [idioma, setIdioma] = useState<Idioma>('pt'); // pt é o padrão

  // Quando o site abre, ele procura se o utilizador já tinha escolhido um idioma antes
  useEffect(() => {
    const salvo = localStorage.getItem('idioma3DVault') as Idioma;
    if (salvo) setIdioma(salvo);
  }, []);

  // Função para mudar a língua e guardar na memória do navegador
  const mudarIdioma = (novoIdioma: Idioma) => {
    setIdioma(novoIdioma);
    localStorage.setItem('idioma3DVault', novoIdioma);
  };

  return (
    <LanguageContext.Provider value={{ idioma, mudarIdioma }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Ferramenta que as páginas vão usar para saber a língua
export const useLanguage = () => useContext(LanguageContext);