"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useDynamicLanguage } from "@/contexts/DynamicLanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguageNavigation } from "@/hooks/useLanguageNavigation";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { MdDarkMode, MdLanguage, MdLightMode } from "react-icons/md";

interface HeaderProps {
  onNotificationClick?: () => void;
  adminName?: string;
  sidebarOpen: boolean;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  sidebarOpen,
}: HeaderProps) => {

  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<null | []>([]);
  const displayedNotifications = showAllNotifications
    ? notifications
    : notifications.slice(0, 5);
  


  function timeAgo(createdAtString) {
    const createdAt: any = new Date(createdAtString);
    const now: any = new Date();

    const diffInMs = now - createdAt;
    const diffInMinutes = Math.floor(diffInMs / 60000);

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  // Use dynamic language context and navigation
  const { languages, currentLanguage, setCurrentLanguage, t } = useDynamicLanguage();
  const { navigateWithSpecificLanguage, getPathWithoutLanguage } = useLanguageNavigation();
  
  const supportedCodes = useMemo(() => languages.map((l: any) => l.code), [languages]);
  const firstSegment = useMemo(() => pathname?.split("/")[1] || "", [pathname]);
  
  // Sync selected language with URL and context
  const [selectedCode, setSelectedCode] = useState<string>(firstSegment || currentLanguage);

  useEffect(() => {
    // Update selected code when URL changes
    if (firstSegment && supportedCodes.includes(firstSegment)) {
      setSelectedCode(firstSegment);
      if (firstSegment !== currentLanguage) {
        setCurrentLanguage(firstSegment);
        // Also save to cookies when language changes via URL
        document.cookie = `preferred_language=${firstSegment}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
        localStorage.setItem('preferred_language', firstSegment);
      }
    } else if (supportedCodes.length > 0) {
      // If URL doesn't have valid language, use current language or first available
      const defaultLang = currentLanguage || supportedCodes[0];
      setSelectedCode(defaultLang);
      if (defaultLang !== currentLanguage) {
        setCurrentLanguage(defaultLang);
        // Save to cookies when setting default language
        document.cookie = `preferred_language=${defaultLang}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
        localStorage.setItem('preferred_language', defaultLang);
      }
    }
  }, [firstSegment, supportedCodes, currentLanguage, setCurrentLanguage]);

  // Set initial direction based on current language
  useEffect(() => {
    const isRTL = selectedCode === 'ar'; // Arabic language code
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('lang', selectedCode);
  }, [selectedCode]);

  const handleLanguageChange = (langCode: string) => {
    console.log('Language changing to:', langCode);
    setSelectedCode(langCode);
    setCurrentLanguage(langCode);

    // Set document direction based on language
    const isRTL = langCode === 'ar'; // Arabic language code
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('lang', langCode);

    // Save language preference to cookies for server-side access
    document.cookie = `preferred_language=${langCode}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    
    // Save to localStorage for client-side persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred_language', langCode);
    }

    // Get current path without language prefix
    const pathWithoutLanguage = getPathWithoutLanguage();
    
    // Navigate to the same path with new language
    navigateWithSpecificLanguage(pathWithoutLanguage, langCode);
  };
 
  return (
    <nav className="text-blackColor dark:text-white border-b border-borderColor dark:border-gray-700 bg-white dark:bg-blackColor py-3 transition-colors duration-200">
      <div className=" container px-5   relative flex justify-between mb-1 z-50">
        {/* Mobile menu button */}
        <div>
          <div className=" xl:hidden flex items-center">
            <button
              onClick={onMenuClick}
              className=" pr-2 py-2  text-[#4A4C56]"
            >
              {sidebarOpen ? (
                <X className=" z-50 " />
              ) : (
                <Menu className="text-blackColor dark:text-white" />
              )}
            </button>
            <Link
            href={"/"}
            className="text-headerColor dark:text-white flex justify-center text-xl lg:text-3xl font-semibold tracking-wide"
          >
            {t('appName')} <span className="text-primaryColor pl-1" > {t('admin')}</span> 
          </Link>
          </div>
        </div>

        {/* Notification and Profile Group */}

        <div className="flex items-center gap-2 lg:gap-5 justify-end">
          {/* Language Selector */}
          <div className="cursor-pointer relative flex items-center">
            <Select value={selectedCode} onValueChange={handleLanguageChange}>
              <SelectTrigger className='w-[180px] !h-10 focus-visible:ring-0'>
                <div className="flex items-center gap-2">
                  <MdLanguage className="w-5 h-5 text-blue-600" />
                  <SelectValue placeholder='Language' />
                </div>
              </SelectTrigger>
              <SelectContent>
                {languages.map((item: any) => (
                  <SelectItem key={item.code} value={item.code}>{item.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="cursor-pointer relative flex justify-center items-center p-2 rounded-full transition-all duration-200 hover:scale-105"
            style={{ boxShadow: "2px 2px 7px 2px rgba(0, 0, 0, 0.08)" }}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <MdLightMode className="w-6 h-6 text-yellow-500" />
            ) : (
              <MdDarkMode className="w-6 h-6 text-gray-600" />
            )}
          </button>

         
        </div>
      </div>
    </nav>
  );
};

export default Header;
