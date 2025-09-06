"use client";

import { createContext, useContext, useEffect, useState } from "react";

// context accepts an object, not just the token
type TokenContextType = {
  token: string | null;
};

const TokenContext = createContext<TokenContextType | null>(null);

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useToken must be used within a TokenProvider");
  }
  return context;
};

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  const getCookieToken = () => {
    if (typeof document === "undefined") return null;

    const cookieString = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("gametoken="));
    
    return cookieString?.split("=")[1] || null;
  };

  useEffect(() => {
    const updateToken = () => {
      const cookieToken = getCookieToken();
      setToken(cookieToken);
    };

    updateToken(); // Run once on mount

    const interval = setInterval(updateToken, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  return (
    <TokenContext.Provider value={{ token }}>
      {children}
    </TokenContext.Provider>
  );
};
