"use client";
import { useToken } from "@/hooks/useToken";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";


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
    <nav className=" text-blackColor border-b border-borderColor  py-3">
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
                <Menu className="text-blackColor" />
              )}
            </button>
            <Link
            href={"/"}
            className="text-headerColor flex justify-center  text-xl lg:text-3xl font-semibold tracking-wide"
          >
            Inzilly <span className="text-primaryColor pl-1" > Admin</span> 
          </Link>
          </div>
        </div>

        {/* Notification and Profile Group */}

        <div className="flex items-center gap-2 lg:gap-5 justify-end">
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger
              className="cursor-pointer relative flex justify-center items-center lg:p-3 p-2 rounded-full"
              style={{ boxShadow: "2px 2px 7px 2px rgba(0, 0, 0, 0.08)" }}
              onClick={() => setPopoverOpen(!popoverOpen)}
            >
              {notifications.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex justify-center items-center text-sm w-6 h-6 text-whiteColor rounded-full bg-redColor">
                  {notifications.length}
                </span>
              )}
              <Image
                src="/icon/notification.svg"
                alt="notification"
                width={18}
                height={18}
              />
            </PopoverTrigger>

            <PopoverContent className="w-80 md:w-[467px] mt-4 p-0 max-h-[500px] flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                <h4 className="text-base font-bold md:text-lg text-headerColor">
                  Notifications
                </h4>

                <button
                  onClick={() => setPopoverOpen(false)}
                  className="text-[#455468] bg-bgColor w-[35px] h-[35px] shadow-sm rounded-full cursor-pointer text-lg font-bold flex items-center justify-center"
                >
                  <X className="" />
                </button>
              </div>
            </PopoverContent>
          </Popover>
          {/* <button
            className=" cursor-pointer relative flex justify-center items-center lg:p-3 p-2 rounded-full  "
            style={{
              boxShadow: "2px 2px 7px 2px rgba(0, 0, 0, 0.08)", // uniform shadow all sides
            }}
          >
            {/* <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-redColor "></span> */}
          {/* <Image
              src="/icon/message.svg"
              alt="notification"
              width={18}
              height={18}
              className="w-[15px] md:w-[18px] md:h-[18px] h-[15px]"
            />
          </button> */}
          <div className="  relative sm:ml-0">
            <Link
              href="/dashboard/my-profile"
              className="flex items-center md:gap-3 gap-2 p-1.5 sm:p-2 rounded-md"
              style={{
                boxShadow: "2px 2px 7px 2px rgba(0, 0, 0, 0.1)", // uniform shadow all sides
              }}
            >
              <div
                onClick={() => seIsShow(!isShow)}
                className="flex justify-start items-center gap-2 cursor-pointer hover:opacity-90"
              >
                <div className=" w-6 h-6 lg:w-10 lg:h-10 rounded-md overflow-hidden">
                  <Image
                    src={"/image/profile.jpg"}
                    alt="Admin Avatar"
                    width={40}
                    height={40}
                    className="rounded-md w-full h-full  "
                  />
                </div>
                <div className="whitespace-nowrap">
                  <h4 className="sm:text-sm text-[13px] font-medium text-blackColor">
                   Name
                   </h4>
                </div>
                <button className=" cursor-pointer">
                  <IoIosArrowDown size={16} className="text-grayColor1" />
                </button>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
