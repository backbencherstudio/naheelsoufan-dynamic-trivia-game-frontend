import CustomToastContainer from "@/components/CustomToast/CustomToastContainer";
import { AppConfig } from "@/config/app.config";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TokenProvider } from "@/hooks/useToken";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";


const roboto = Roboto({ subsets: ['latin'] })
export const metadata: Metadata = {
  title: AppConfig().app.name,
  description: AppConfig().app.slogan,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.className}`}>
        <TokenProvider>
        <LanguageProvider>
      <ThemeProvider>
        <CustomToastContainer/>       
         {children}
         </ThemeProvider>
         </LanguageProvider>
        </TokenProvider>
        </body>
    </html>
  );
}
