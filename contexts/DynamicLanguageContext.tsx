"use client";
import { useGetLanguagesQuery } from '@/feature/api/apiSlice';
import useDataFetch from '@/hooks/useDataFetch';
import { LanguageStorage } from '@/lib/languageStorage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface Language {
  id: string;
  name: string;
  code: string;
  file_url: string;
  created_at: string;
  updated_at: string;
}

interface TranslationData {
  [key: string]: string;
}

interface DynamicLanguageContextType {
  languages: Language[];
  currentLanguage: string;
  translations: TranslationData;
  isLoading: boolean;
  error: string | null;
  setCurrentLanguage: (code: string) => void;
  t: (key: string, fallback?: string) => string;
}

const DynamicLanguageContext = createContext<DynamicLanguageContextType | undefined>(undefined);

interface DynamicLanguageProviderProps {
  children: ReactNode;
  initialLanguage?: string;
}

// Translation cache to avoid re-fetching
const translationCache = new Map<string, TranslationData>();

export const DynamicLanguageProvider: React.FC<DynamicLanguageProviderProps> = ({
  children,
  initialLanguage = 'en'
}) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  
  // Get initial language from localStorage, cookies, or props
  const getInitialLanguage = () => {
    if (typeof window !== 'undefined') {
      // First try localStorage
      const savedLanguage = LanguageStorage.getLanguage();
      if (savedLanguage) return savedLanguage;
      
      // Then try cookies
      const cookies = document.cookie.split(';');
      const preferredCookie = cookies.find(cookie => cookie.trim().startsWith('preferred_language='));
      if (preferredCookie) {
        const cookieValue = preferredCookie.split('=')[1];
        if (cookieValue) return cookieValue;
      }
    }
    return initialLanguage;
  };
  
  const [currentLanguage, setCurrentLanguageState] = useState<string>(getInitialLanguage);
  const [translations, setTranslations] = useState<TranslationData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch languages from backend
  const { data: languageData, isError: languageError, isLoading: languageLoading } = useGetLanguagesQuery({params: {limit: 1000, page: 1}});

  useEffect(() => {
    if (languageData?.data) {
      setLanguages(languageData.data);
      setIsLoading(false);
    }
    if (languageError) {
      setError('Failed to fetch languages');
      setIsLoading(false);
    }
  }, [languageData, languageLoading]);

  // Fetch translation file for current language
  useEffect(() => {
    if (languages.length > 0 && currentLanguage) {
      const selectedLanguage = languages.find(lang => lang.code === currentLanguage);
      if (selectedLanguage?.file_url) {
        fetchTranslations(selectedLanguage.file_url, selectedLanguage.code);
      }
    }
  }, [languages, currentLanguage]);

  const fetchTranslations = async (fileUrl: string, languageCode: string) => {
    try {
      // Check cache first
      if (translationCache.has(languageCode)) {
        setTranslations(translationCache.get(languageCode)!);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch translations: ${response.status}`);
      }
      
      const translationData = await response.json();
      
      // Cache the translation data
      translationCache.set(languageCode, translationData);
      setTranslations(translationData);
    } catch (err) {
      console.error('Error fetching translations:', err);
      setError(`Failed to load translations for ${currentLanguage}`);
      setTranslations({});
    } finally {
      setIsLoading(false);
    }
  };

  const setCurrentLanguage = (code: string) => {
    setCurrentLanguageState(code);
    // Save language preference to localStorage
    LanguageStorage.saveLanguage(code);
  };

  const t = (key: string, fallback?: string): string => {
    return translations[key] || fallback || key;
  };

  const value: DynamicLanguageContextType = {
    languages,
    currentLanguage,
    translations,
    isLoading,
    error,
    setCurrentLanguage,
    t
  };

  return (
    <DynamicLanguageContext.Provider value={value}>
      {children}
    </DynamicLanguageContext.Provider>
  );
};

export const useDynamicLanguage = (): DynamicLanguageContextType => {
  const context = useContext(DynamicLanguageContext);
  if (context === undefined) {
    throw new Error('useDynamicLanguage must be used within a DynamicLanguageProvider');
  }
  return context;
};
