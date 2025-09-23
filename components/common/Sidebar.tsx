"use client";
import useTranslation from "@/hooks/useTranslation";
import Cookies from "js-cookie";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

import {
  BiWorld
} from 'react-icons/bi';
import {
  HiOutlineUserGroup
} from 'react-icons/hi2';
import { IoIosSwitch } from "react-icons/io";
import {
  LuLogOut,
  LuUsers
} from 'react-icons/lu';
import {
  MdOutlineDashboard,
  MdOutlineSubscriptions,
  MdOutlineTopic
} from 'react-icons/md';
import {
  RiAdminLine,
  RiGamepadLine,
  RiQuestionnaireLine
} from 'react-icons/ri';
interface NavItem {
  icon: any;
  label: string;
  href: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}



const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { t, currentLanguage, isLoading, error } = useTranslation();
    const navItems: NavItem[] = [
  {
    icon: <MdOutlineDashboard />,
    label: t("dashboard"),
    href: "/",
  },
  {
    icon: <MdOutlineSubscriptions />,
    label: t("subscription_type"),
    href: "/dashboard/subscription-types",
  },
  {
    icon: <BiWorld />,
    label: t("language"),
    href: "/dashboard/language",
  },
  {
    icon: <MdOutlineTopic />,
    label: t("topic"),
    href: "/dashboard/topics",
  },
  // {
  //   icon: <MdOutlineQuestionAnswer />,
  //   label: "Question Types",
  //   href: "/dashboard/question-types",
  // },
  {
    icon: <IoIosSwitch />,
    label: t("difficulties"),
    href: "/dashboard/difficulties",
  },
  {
    icon: <RiGamepadLine />,
    label: t("previous_game"),
    href: "/dashboard/previous-games",
  },
  {
    icon: <RiQuestionnaireLine />,
    label: t("questions"),
    href: "/dashboard/questions",
  },
  {
    icon: <LuUsers />,
    label: t("players"),
    href: "/dashboard/players",
  },
  {
    icon: <RiAdminLine />,
    label: t("admin"),
    href: "/dashboard/admins",
  },
  {
    icon: <HiOutlineUserGroup />,
    label: t("subscribers"),
    href: "/dashboard/subscribers",
  },

];
  const pathname = usePathname();
  const router = useRouter()
 const isActive = (href: string): boolean => {
    // Remove locale prefix like /en, /bn, /ar from pathname
    const pathWithoutLocale = (pathname?.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/");
    if (href === "/") {
      return pathWithoutLocale === "/";
    }
    return pathWithoutLocale.startsWith(href);
  };
  const handleLogout = () => {
    Cookies.remove("gametoken");
    router.push("/login")
  }
  return (
    <div className="h-screen  ">
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="absolute top-0 left-0 w-full h-full z-40 xl:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <div
        className={`
          ${isOpen
            ? "z-50 h-full overflow-hidden absolute top-0 left-0"
            : "h-full"
          }
          flex flex-col
          min-h-[calc(100vh-100px)] 
          bg-white dark:bg-black 
         
          shadow-[0px_-0.3px_5.5px_0px_rgba(0,0,0,0.02)]
          lg:rounded-[12px] 
          p-5 w-full overflow-y-auto
        `}
      >
        <div className="flex justify-end xl:hidden cursor-pointer">
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Account Section */}
        <div className="my-4 ">
          <Link
            href={"/"}
            className="text-headerColor flex justify-center dark:text-whiteColor/80 pb-5 text-xl lg:text-3xl font-semibold tracking-wide"
          >
            {t("appName")}<span className="text-primaryColor pl-1" >{t("admin")}</span> 
          </Link>
          <div className=" space-y-2">

            {navItems.map((item, idx) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={onClose}
                  className={`
        flex items-center justify-between group gap-3 px-3 py-2.5 lg:py-3 rounded-lg dark:hover:bg-whiteColor/20  hover:bg-primaryColor/10
        transition-colors duration-200
        ${active ? "bg-primaryColor/10 dark:bg-whiteColor" : ""}
      `}
                >
                  <div className="flex gap-2 items-center">
                    <div
                      className={`
            w-[30px] h-[30px] flex justify-center items-center flex-shrink-0 rounded-full
            text-xl font-medium
            ${active
                          ? "text-primaryColor"
                          : "text-descriptionColor dark:text-whiteColor/80 dark:group-hover:text-whiteColor group-hover:text-primaryColor"
                        }
          `}
                    >
                      {item.icon}
                    </div>
                    <span
                      className={`
            text-base font-medium 
            ${active
                          ? "text-primaryColor "
                          : "text-descriptionColor dark:text-whiteColor/80 dark:group-hover:text-whiteColor group-hover:text-primaryColor"
                        }
          `}
                    >
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Log out section */}
        <div className="mt-auto pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center cursor-pointer gap-3 px-3 py-3  transition-colors duration-200 "
          >
            <div className="w-[30px] h-[30px] flex justify-center items-center flex-shrink-0 ">
             <LuLogOut size={20} /> 
            </div>
            <span className="text-base font-normal text-[#111111] dark:text-whiteColor/80">
              {t("logout")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
