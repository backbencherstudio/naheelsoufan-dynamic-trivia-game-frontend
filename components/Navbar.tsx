"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BsGlobe2 } from "react-icons/bs";
import { HiOutlineMenu, HiX } from "react-icons/hi";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const menuItems = [
  { en: "Home", bn: "হোম", slug: "/" },
  { en: "Apartment", bn: "অ্যাপার্টমেন্ট", slug: "/apartments" },
  { en: "Hotel", bn: "হোটেল", slug: "/hotels" },
  { en: "Tours", bn: "ট্যুর", slug: "/tours" },
  { en: "Contact Us", bn: "যোগাযোগ", slug: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-primaryColor py-4 px-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left: Logo */}
        <div className="text-white text-3xl font-semibold tracking-wide">
          LOGO
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 text-base">
          {menuItems.map((item) => (
            <Link
              key={item.slug}
              href={item.slug}
              className={cn(
                "hover:text-secondaryColor transition",
                pathname === item.slug ? "text-secondaryColor" : "text-white"
              )}
            >
              {language === "en" ? item.en : item.bn}
            </Link>
          ))}
        </nav>

        {/* Right: Language, Auth Buttons */}
        <div className="hidden md:flex items-center space-x-[14px]">
          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="text-white text-base flex focus:outline-0 cursor-pointer items-center gap-[6px]">
              <BsGlobe2 /> {language.toUpperCase()}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("en")}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("bn")}>
                বাংলা
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/login" className="text-white text-base">
            Login
          </Link>
          <Link
            href="/registration"
            className="bg-secondaryColor text-blackColor font-medium cursor-pointer  text-base px-4 py-2 rounded-[8px]"
          >
            Sign up
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-2xl"
          >
            {menuOpen ? <HiX /> : <HiOutlineMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {menuOpen && (
        <div className="md:hidden px-4 mt-4 space-y-3">
          {menuItems.map((item) => (
            <Link
              key={item.slug}
              href={item.slug}
              className={cn(
                "block text-base py-2",
                pathname === item.slug ? "text-secondaryColor" : "text-white"
              )}
              onClick={() => setMenuOpen(false)}
            >
              {language === "en" ? item.en : item.bn}
            </Link>
          ))}

          {/* Language Dropdown (Mobile) */}
          <div className=" flex  items-center justify-between">
            <div className="text-white text-base flex items-center gap-2 ">
              <BsGlobe2 />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "en" | "bn")}
                className="bg-transparent outline-none text-white"
              >
                <option value="en" className="text-black">
                  English
                </option>
                <option value="bn" className="text-black">
                  বাংলা
                </option>
              </select>
            </div>
         
              <Link href="/login" className="text-white text-base">
                Login
              </Link>
              <Link
                href="/registration"
                className="bg-secondaryColor inline-block text-blackColor font-medium cursor-pointer  text-base px-4 py-2 rounded-[8px]"
              >
                Sign up
              </Link>

          </div>
        </div>
      )}
    </header>
  );
}
