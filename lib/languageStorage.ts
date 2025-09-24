/**
 * Language storage utilities for persisting language preference
 */

const LANGUAGE_STORAGE_KEY = 'preferred_language';

export const LanguageStorage = {
  /**
   * Save language preference to localStorage and cookies
   */
  saveLanguage: (languageCode: string): void => {
    if (typeof window !== 'undefined') {
      try {
        // Save to localStorage
        localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
        
        // Save to cookies for server-side access with secure settings
        const cookieString = `preferred_language=${languageCode}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
        document.cookie = cookieString;
        
        console.log('Language saved:', languageCode);
      } catch (error) {
        console.warn('Failed to save language preference:', error);
      }
    }
  },

  /**
   * Get saved language preference from localStorage
   */
  getLanguage: (): string | null => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem(LANGUAGE_STORAGE_KEY);
      } catch (error) {
        console.warn('Failed to get language preference:', error);
        return null;
      }
    }
    return null;
  },

  /**
   * Remove language preference from localStorage and cookies
   */
  clearLanguage: (): void => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(LANGUAGE_STORAGE_KEY);
        document.cookie = 'preferred_language=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      } catch (error) {
        console.warn('Failed to clear language preference:', error);
      }
    }
  }
};
