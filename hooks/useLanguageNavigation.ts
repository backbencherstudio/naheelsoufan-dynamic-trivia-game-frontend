import { useDynamicLanguage } from '@/contexts/DynamicLanguageContext';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';

/**
 * Custom hook for language-aware navigation
 */
export const useLanguageNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { languages } = useDynamicLanguage();

  const supportedCodes = useMemo(() => languages.map((l: any) => l.code), [languages]);
  const currentLanguage = useMemo(() => {
    const firstSegment = pathname?.split("/")[1] || "";
    return supportedCodes.includes(firstSegment) ? firstSegment : supportedCodes[0] || 'en';
  }, [pathname, supportedCodes]);

  /**
   * Navigate to a path while maintaining the current language
   */
  const navigateWithLanguage = (path: string) => {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    
    // Build new path with current language
    const newPath = `/${currentLanguage}/${cleanPath}`;
    
    console.log(`Navigating with language: ${newPath}`);
    router.push(newPath);
  };

  /**
   * Navigate to a path with a specific language
   */
  const navigateWithSpecificLanguage = (path: string, languageCode: string) => {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    
    // Build new path with specific language
    const newPath = `/${languageCode}/${cleanPath}`;
    
    console.log(`Navigating with specific language: ${newPath}`);
    router.push(newPath);
  };

  /**
   * Get current path without language prefix
   */
  const getPathWithoutLanguage = () => {
    const firstSegment = pathname?.split("/")[1] || "";
    if (supportedCodes.includes(firstSegment)) {
      return pathname?.replace(`/${firstSegment}`, '') || '/';
    }
    return pathname || '/';
  };

  return {
    currentLanguage,
    navigateWithLanguage,
    navigateWithSpecificLanguage,
    getPathWithoutLanguage,
    supportedCodes
  };
};
