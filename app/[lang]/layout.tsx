import ClientLayout from "@/components/reusable/ClientLayout";
import { AppConfig } from "@/config/app.config";
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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const {lang} = await params || {lang: "en"};
  return (
    <html   suppressHydrationWarning>
      <body className={`${roboto.className}`}>
        <TokenProvider>
          <ClientLayout lang={lang as any}>
            {children}
          </ClientLayout>
        </TokenProvider>
      </body>
    </html>
  );
}
