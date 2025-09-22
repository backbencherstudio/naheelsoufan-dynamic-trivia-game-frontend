"use client";
import React, { useState } from "react";

import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";
import ProtectedPageWrapper from "@/components/ProtectedPageWrapper";
import { ToastContainer } from "react-toastify";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  return (
   
        <ProtectedPageWrapper>
          <div className="w-full h-screen overflow-hidden relative bg-white dark:bg-blackColor transition-colors duration-200">
      {/* Centered layout container */}
      <div className="relative  flex h-full">
        {/* Sidebar */}
        <div
          className={`
            fixed top-0 left-1/2 -translate-x-1/2 xl:translate-x-0
            h-screen w-[300px] z-30  dark:bg-blackColor border-r border-borderColor dark:border-gray-700
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-[0%]" : "-translate-x-[150%]"}
            xl:static xl:translate-x-0 z-50
            rtl:border-l rtl:border-r-0
          `}
          style={{
            left: "0px", // Only relevant for mobile now
          }}
        >
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        </div>
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 dark:bg-whiteColor/50 lg:hidden z-20"
            onClick={closeSidebar}
          />
        )}
        {/* Main Content Area */}
        <div className="flex-1 w-full h-full  flex flex-col">
          {/* Header */}
          <div className="w-full sticky top-0 left-0 z-10">
            <Header onMenuClick={openSidebar} sidebarOpen={sidebarOpen} />
          </div>
          {/* Scrollable content area */}
          <main className="flex-1 overflow-y-auto p-0x p-4 lg:pl-6 lg:pt-6 rtl:lg:pr-6 rtl:lg:pl-4">
            {children}
            <ToastContainer />
          </main>
        </div>
      </div>
    </div>
        </ProtectedPageWrapper>
     
  );
};

export default AdminLayout;
