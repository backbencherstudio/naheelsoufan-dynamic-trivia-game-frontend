"use client";
import Cookies from "js-cookie";
import { X } from "lucide-react";
import Image from "next/image";
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
  LuUsers
} from 'react-icons/lu';
import {
  MdOutlineDashboard,
  MdOutlineQuestionAnswer,
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

const navItems: NavItem[] = [
  {
    icon: <MdOutlineDashboard />,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: <MdOutlineSubscriptions />,
    label: "Subscription Types",
    href: "/dashboard/subscription-types",
  },
  {
    icon: <BiWorld />,
    label: "Language",
    href: "/dashboard/language",
  },
  {
    icon: <MdOutlineTopic />,
    label: "Topics",
    href: "/dashboard/topics",
  },
  {
    icon: <MdOutlineQuestionAnswer />,
    label: "Question Types",
    href: "/dashboard/question-types",
  },
  {
    icon: <IoIosSwitch />,
    label: "Difficulties",
    href: "/dashboard/difficulties",
  },
  {
    icon: <RiGamepadLine />,
    label: "Previous Games",
    href: "/dashboard/previous-games",
  },
  {
    icon: <RiQuestionnaireLine />,
    label: "Questions",
    href: "/dashboard/questions",
  },
  {
    icon: <LuUsers />,
    label: "Players",
    href: "/dashboard/players",
  },
  {
    icon: <RiAdminLine />,
    label: "Admins",
    href: "/dashboard/admins",
  },
  {
    icon: <HiOutlineUserGroup />,
    label: "Subscribers",
    href: "/dashboard/subscribers",
  },

];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const router = useRouter()
  const isActive = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };
  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login")

  }
  return (
    <div className="h-screen  ">
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="absolute top-0 left-0 w-full h-full z-40 md:hidden"
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
          bg-white 
         
          shadow-[0px_-0.3px_5.5px_0px_rgba(0,0,0,0.02)]
          lg:rounded-[12px] 
          p-5 w-full overflow-y-auto
        `}
      >
        <div className="flex justify-end lg:hidden cursor-pointer">
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Account Section */}
        <div className="my-4 ">
          <Link
            href={"/dashboard"}
            className="text-white flex justify-center pb-5 text-xl lg:text-3xl font-semibold tracking-wide"
          >
            <Image
              src="/logo/Logo.png"
              alt="main logo "
              width={138}
              height={29}
            />
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
        flex items-center justify-between group gap-3 px-3 py-2.5 lg:py-3 rounded-lg  hover:bg-primaryColor/10
        transition-colors duration-200
        ${active ? "bg-primaryColor/10" : ""}
      `}
                >
                  <div className="flex gap-2 items-center">
                    <div
                      className={`
            w-[30px] h-[30px] flex justify-center items-center flex-shrink-0 rounded-full
            text-xl font-medium
            ${active
                          ? "text-primaryColor"
                          : "text-descriptionColor group-hover:text-primaryColor"
                        }
          `}
                    >
                      {item.icon}
                    </div>
                    <span
                      className={`
            text-base font-medium 
            ${active
                          ? "text-primaryColor"
                          : "text-descriptionColor group-hover:text-primaryColor"
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
              <Image
                src="/icon/logout.svg"
                alt="Log out"
                width={20}
                height={20}
              />
            </div>
            <span className="text-base font-normal text-[#111111]">
              Log out account
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
