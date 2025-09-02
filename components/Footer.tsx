"use client";
import Link from "next/link";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaLocationDot,
  FaPhone,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
const quickLinks = [
  { name: "Home", slug: "/" },
  { name: "Tours", slug: "/tours" },
  { name: "Cruises", slug: "/cruises" },
  { name: "Packages", slug: "/packages" },
  { name: "Reservations", slug: "/reservations" },
  { name: "Blog", slug: "/blog" },
  { name: "About", slug: "/Linkbout" },
  { name: "Contact Us", slug: "/contact" },
];
export default function Footer() {
  return (
    <footer className="bg-primaryColor px-4">
      <div className=" text-white py-12 ">
<div className=" container grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Column 1: Logo & Newsletter */}
        <div className=" md:col-span-6 lg:col-span-4">
          <div className=" w-[328px]">
            <h2 className="text-5xl font-bold mb-8">LOGO</h2>
            <p className="text-base leading-[150%] mb-6">
              Explore the world with us! Find inspiration, plan adventures, and
              make unforgettable memories every journey.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 text-base rounded-l-md rounded-[8px] border border-[#EDFAFF]/50 bg-[#EDFAFF]/10 text-[#D2D2D5] w-full  focus:outline-none"
              />
              <button className=" absolute top-1/2 -translate-1/2 -right-13  bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 text-base leading-[150%] rounded-md font-medium">
                Sign Up →
              </button>
            </div>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="md:col-span-3 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Quick Link</h3>
          <ul className="space-y-3 text-base leading-[150%]">
            {quickLinks.map(({ name, slug }) => (
              <li key={slug}>
                <Link href={slug} className="hover:text-yellow-400">
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Column 3: Contact Info */}
        <div className="md:col-span-3 lg:col-span-3">
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <ul className="space-y-4 text-base leading-[150%]">
            <li className=" flex gap-3 items-center">
              <FaPhone />
              <Link href="tel:602-774-4735" className="hover:text-yellow-400">
                602-774-4735
              </Link>
            </li>
            <li className=" flex gap-3 items-center">
              <IoMdMail />
              <Link
                href="mailto:hello@travelinfo.com"
                className="hover:text-yellow-400"
              >
                hello@travelinfo.com
              </Link>
            </li>
            <li className=" flex gap-3 items-start ">
              <FaLocationDot className="mt-1" /> 12 Victoria Road Barnsley,
              South Yorkshire S70 2BB
            </li>
          </ul>
        </div>

        {/* Column 4: Social Icons */}
        <div className="md:col-span-6 lg:col-span-3">
          <h3 className="text-lg font-semibold mb-4">Follow Us on</h3>
          <div className="flex space-x-4">
            <Link
              href="#"
              className="bg-white text-[#000F75] rounded-full p-2 hover:bg-yellow-400"
            >
              <FaFacebookF className="text-blackColor" />
            </Link>
            <Link
              href="#"
              className="bg-white text-[#000F75] rounded-full p-2 hover:bg-yellow-400"
            >
              <FaYoutube className="text-blackColor" />
            </Link>
            <Link
              href="#"
              className="bg-white text-[#000F75] rounded-full p-2 hover:bg-yellow-400"
            >
              <FaLinkedinIn className="text-blackColor" />
            </Link>
            <Link
              href="#"
              className="bg-white text-[#000F75] rounded-full p-2 hover:bg-yellow-400"
            >
              <FaXTwitter className="text-blackColor" />
            </Link>
          </div>
        </div>
      </div>
      </div>
      

      {/* Footer Bottom */}
      <div className=" container">

      <div className="border-t border-grayColor1 pb-6 pt-4 text-center text-base leading-[150%] text-[#A5A5AB]">
        Copyright © 2024 All rights reserved
      </div>
      </div>
    </footer>
  );
}
