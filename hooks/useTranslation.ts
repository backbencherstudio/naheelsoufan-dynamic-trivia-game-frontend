import { useDynamicLanguage } from '@/contexts/DynamicLanguageContext';

/**
 * Custom hook for using translations throughout the app
 * @param key - The translation key
 * @param fallback - Optional fallback text if translation is not found
 * @returns The translated text
 */
export const useTranslation = () => {
  const { t, currentLanguage, isLoading, error } = useDynamicLanguage();

  return {
    t,
    currentLanguage,
    isLoading,
    error,
    // Helper function for common use cases
    translate: (key: string, fallback?: string) => t(key, fallback),
  };
};

export default useTranslation;
