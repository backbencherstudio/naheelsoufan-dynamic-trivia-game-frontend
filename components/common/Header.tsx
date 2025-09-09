"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useToken } from "@/hooks/useToken";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
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
  const [isShow, seIsShow] = useState<boolean>(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { token } = useToken()
  const [notifications, setNotifications] = useState<null | []>([]);
  const [error, setError] = useState<string | null>()
  const [profile, setProfile] = useState<any>()
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
            Inzilly <span className="text-primaryColor pl-1" > Admin</span> 
          </Link>
          </div>
        </div>

        {/* Notification and Profile Group */}

        <div className="flex items-center gap-2 lg:gap-5 justify-end">
          {/* Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            className="cursor-pointer relative flex justify-center items-center p-2 rounded-full transition-all duration-200 hover:scale-105"
            style={{ boxShadow: "2px 2px 7px 2px rgba(0, 0, 0, 0.08)" }}
            title={language === 'en' ? "Switch to Arabic" : "Switch to English"}
          >
            <div className="flex items-center gap-1">
              <MdLanguage className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-medium text-gray-700 dark:text-white">
                {language === 'en' ? 'EN' : 'عربي'}
              </span>
            </div>
          </button>

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
