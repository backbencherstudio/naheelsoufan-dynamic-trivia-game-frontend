"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPageWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();


  // token extract helper
  const getCookieToken = () => {
    if (typeof document === "undefined") return null;

    const cookieString = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("cartoken="));
    return cookieString?.split("=")[1] || null;
  };

  useEffect(() => {
    const token = getCookieToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    const interval = setInterval(() => {
      const token = getCookieToken();
      if (!token) {
        router.replace("/login");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [router]);



  return <>{children}</>;
}
